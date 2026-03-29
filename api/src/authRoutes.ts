import { createHash, randomBytes } from "node:crypto";
import type { FastifyInstance } from "fastify";
import type { PrismaClient } from "@prisma/client";
import { AppLogLevel, SubscriptionStatus } from "@prisma/client";
import { z } from "zod";
import { resolveSelectedExamId } from "./examHelpers";

const OTP_TTL_MS = Number(process.env.OTP_EXPIRY_MINUTES ?? 10) * 60 * 1000;
const SESSION_MS = Number(process.env.SESSION_DAYS ?? 30) * 24 * 60 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;

function hashOtp(code: string): string {
  return createHash("sha256").update(code, "utf8").digest("hex");
}

function generateSixDigitCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function newSessionToken(): string {
  return randomBytes(32).toString("hex");
}

async function sendResendOtpEmail(to: string, code: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const subject = "Tarih AI — giriş kodunuz";
  const html = `
    <p>Merhaba,</p>
    <p>Tarih AI uygulamasına giriş için tek kullanımlık kodunuz:</p>
    <p style="font-size:24px;font-weight:bold;letter-spacing:4px;">${code}</p>
    <p>Bu kod ${Math.round(OTP_TTL_MS / 60000)} dakika geçerlidir. Kimseyle paylaşmayın.</p>
  `;
  if (!key || !from) {
    console.warn(`[auth] OTP for ${to}: ${code} (RESEND not configured)`);
    return true;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });
  if (!res.ok) {
    const t = await res.text();
    console.error("Resend failed", res.status, t);
    return false;
  }
  return true;
}

const sendOtpBody = z.object({
  email: z.string().email(),
});

const verifyOtpBody = z.object({
  email: z.string().email(),
  code: z.string().regex(/^\d{6}$/),
  displayName: z.string().max(120).optional(),
  /** @deprecated examSlug kullanın */
  examTargetId: z.string().max(80).optional(),
  /** ExamCatalog.slug (örn. kpss_lisans_tarih) */
  examSlug: z.string().max(80).optional(),
});

const guestBody = z.object({
  guestClientId: z.string().min(16).max(64),
  displayName: z.string().max(120).optional(),
  examTargetId: z.string().max(80).optional(),
  examSlug: z.string().max(80).optional(),
});

export function authHeaderToken(raw: string | undefined): string | null {
  if (!raw || !raw.startsWith("Bearer ")) return null;
  const t = raw.slice(7).trim();
  return t.length > 0 ? t : null;
}

export function registerAuthRoutes(app: FastifyInstance, prisma: PrismaClient) {
  app.post("/auth/otp/send", async (request, reply) => {
    const parsed = sendOtpBody.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Geçersiz e-posta" });
    }
    const { email } = parsed.data;
    const normalized = email.toLowerCase().trim();

    const recent = await prisma.emailOtpChallenge.count({
      where: {
        email: normalized,
        createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) },
      },
    });
    if (recent >= 5) {
      return reply.status(429).send({ error: "Çok fazla istek. Bir süre sonra tekrar deneyin." });
    }

    const code = generateSixDigitCode();
    const codeHash = hashOtp(code);
    const expiresAt = new Date(Date.now() + OTP_TTL_MS);

    await prisma.emailOtpChallenge.deleteMany({ where: { email: normalized } });
    await prisma.emailOtpChallenge.create({
      data: { email: normalized, codeHash, expiresAt },
    });

    const sent = await sendResendOtpEmail(normalized, code);
    if (!sent) {
      return reply.status(502).send({ error: "E-posta gönderilemedi" });
    }

    await prisma.appLog.create({
      data: {
        level: AppLogLevel.INFO,
        action: "otp_send",
        meta: { email: normalized } as object,
      },
    });

    return { ok: true };
  });

  app.post("/auth/otp/verify", async (request, reply) => {
    const parsed = verifyOtpBody.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Geçersiz istek" });
    }
    const { email, code, displayName, examTargetId, examSlug } = parsed.data;
    const normalized = email.toLowerCase().trim();

    const challenge = await prisma.emailOtpChallenge.findFirst({
      where: { email: normalized },
      orderBy: { createdAt: "desc" },
    });
    if (!challenge || challenge.expiresAt < new Date()) {
      return reply.status(400).send({ error: "Kod süresi dolmuş veya bulunamadı" });
    }
    if (challenge.attempts >= MAX_OTP_ATTEMPTS) {
      return reply.status(429).send({ error: "Çok fazla deneme" });
    }
    if (hashOtp(code) !== challenge.codeHash) {
      await prisma.emailOtpChallenge.update({
        where: { id: challenge.id },
        data: { attempts: { increment: 1 } },
      });
      return reply.status(400).send({ error: "Geçersiz kod" });
    }

    await prisma.emailOtpChallenge.delete({ where: { id: challenge.id } });

    const mergeToken = authHeaderToken(request.headers.authorization);
    let guestUser: {
      id: string;
      isGuest: boolean;
      displayName: string | null;
      examTargetId: string | null;
      selectedExamId: number | null;
    } | null = null;
    if (mergeToken) {
      const mergeSession = await prisma.session.findUnique({
        where: { token: mergeToken },
        include: { user: { select: { id: true, isGuest: true, displayName: true, examTargetId: true, selectedExamId: true } } },
      });
      if (mergeSession && mergeSession.expiresAt >= new Date()) {
        if (!mergeSession.user.isGuest) {
          return reply.status(400).send({ error: "Bu oturum zaten e-postalı hesaba bağlı" });
        }
        guestUser = mergeSession.user;
      }
    }

    const emailUser = await prisma.user.findUnique({ where: { email: normalized } });
    let user: Awaited<ReturnType<typeof prisma.user.findUnique>>;

    if (guestUser) {
      if (emailUser && emailUser.id !== guestUser.id) {
        await prisma.session.deleteMany({ where: { userId: guestUser.id } });
        await prisma.user.update({
          where: { id: emailUser.id },
          data: {
            displayName: emailUser.displayName ?? guestUser.displayName,
            examTargetId: emailUser.examTargetId ?? guestUser.examTargetId,
            selectedExamId: emailUser.selectedExamId ?? guestUser.selectedExamId,
            isGuest: false,
          },
        });
        await prisma.user.delete({ where: { id: guestUser.id } });
        user = await prisma.user.findUnique({ where: { id: emailUser.id } });
      } else if (!emailUser) {
        user = await prisma.user.update({
          where: { id: guestUser.id },
          data: {
            email: normalized,
            isGuest: false,
            guestClientId: null,
            displayName: displayName?.trim() ?? guestUser.displayName,
            examTargetId: examTargetId ?? guestUser.examTargetId,
          },
        });
      } else {
        user = await prisma.user.update({
          where: { id: guestUser.id },
          data: {
            displayName: displayName?.trim() ?? guestUser.displayName,
            examTargetId: examTargetId ?? guestUser.examTargetId,
            isGuest: false,
          },
        });
      }
    } else if (!emailUser) {
      user = await prisma.user.create({
        data: {
          email: normalized,
          isGuest: false,
          displayName: displayName?.trim() || null,
          examTargetId: examTargetId ?? null,
        },
      });
    } else {
      user = await prisma.user.update({
        where: { id: emailUser.id },
        data: {
          displayName: displayName?.trim() ?? emailUser.displayName,
          examTargetId: examTargetId ?? emailUser.examTargetId,
          isGuest: false,
        },
      });
    }

    if (!user) {
      return reply.status(500).send({ error: "İşlem tamamlanamadı" });
    }

    const examIdResolved = await resolveSelectedExamId(prisma, {
      examSlug: examSlug ?? undefined,
      examTargetId: examTargetId ?? guestUser?.examTargetId ?? undefined,
    });
    if (examIdResolved) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { selectedExamId: examIdResolved },
      });
    }

    const token = newSessionToken();
    const expiresAt = new Date(Date.now() + SESSION_MS);
    await prisma.session.deleteMany({ where: { userId: user.id } });
    await prisma.session.create({ data: { token, userId: user.id, expiresAt } });

    const logAction = guestUser
      ? emailUser && emailUser.id !== guestUser.id
        ? "otp_verify_merge_guest"
        : "otp_verify_guest_link_email"
      : "otp_verify_ok";

    await prisma.appLog.create({
      data: {
        level: AppLogLevel.INFO,
        action: logAction,
        userId: user.id,
        meta: { email: normalized } as object,
      },
    });

    const uOut = await prisma.user.findUnique({
      where: { id: user.id },
      include: { selectedExam: { select: { slug: true, label: true } } },
    });
    if (!uOut) {
      return reply.status(500).send({ error: "İşlem tamamlanamadı" });
    }

    return {
      token,
      expiresAt: expiresAt.toISOString(),
      user: {
        id: uOut.id,
        email: uOut.email,
        displayName: uOut.displayName,
        examTargetId: uOut.examTargetId,
        selectedExamId: uOut.selectedExamId,
        selectedExamSlug: uOut.selectedExam?.slug ?? null,
        selectedExamLabel: uOut.selectedExam?.label ?? null,
        isGuest: uOut.isGuest,
      },
    };
  });

  app.post("/auth/guest", async (request, reply) => {
    const parsed = guestBody.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Geçersiz istek" });
    }
    const { guestClientId, displayName, examTargetId, examSlug } = parsed.data;

    let user = await prisma.user.findUnique({ where: { guestClientId } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          guestClientId,
          isGuest: true,
          displayName: displayName?.trim() || null,
          examTargetId: examTargetId ?? null,
        },
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          displayName: displayName?.trim() ?? user.displayName,
          examTargetId: examTargetId ?? user.examTargetId,
        },
      });
    }

    const examIdGuest = await resolveSelectedExamId(prisma, {
      examSlug: examSlug ?? undefined,
      examTargetId: examTargetId ?? undefined,
    });
    if (examIdGuest) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { selectedExamId: examIdGuest },
      });
    }

    const token = newSessionToken();
    const expiresAt = new Date(Date.now() + SESSION_MS);
    await prisma.session.deleteMany({ where: { userId: user.id } });
    await prisma.session.create({ data: { token, userId: user.id, expiresAt } });

    await prisma.appLog.create({
      data: {
        level: AppLogLevel.INFO,
        action: "guest_session",
        userId: user.id,
        meta: { guestClientId } as object,
      },
    });

    const uGuest = await prisma.user.findUnique({
      where: { id: user.id },
      include: { selectedExam: { select: { slug: true, label: true } } },
    });
    if (!uGuest) {
      return reply.status(500).send({ error: "İşlem tamamlanamadı" });
    }

    return {
      token,
      expiresAt: expiresAt.toISOString(),
      user: {
        id: uGuest.id,
        email: uGuest.email,
        displayName: uGuest.displayName,
        examTargetId: uGuest.examTargetId,
        selectedExamId: uGuest.selectedExamId,
        selectedExamSlug: uGuest.selectedExam?.slug ?? null,
        selectedExamLabel: uGuest.selectedExam?.label ?? null,
        isGuest: uGuest.isGuest,
      },
    };
  });

  const patchMeBody = z.object({
    examSlug: z.string().min(1).max(80),
  });

  /** Seçili sınavı günceller (`ExamCatalog.slug`). */
  app.patch("/auth/me", async (request, reply) => {
    const token = authHeaderToken(request.headers.authorization);
    if (!token) {
      return reply.status(401).send({ error: "Yetkisiz" });
    }
    const parsed = patchMeBody.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Geçersiz istek" });
    }
    const session = await prisma.session.findUnique({
      where: { token },
      select: { userId: true, expiresAt: true },
    });
    if (!session || session.expiresAt < new Date()) {
      return reply.status(401).send({ error: "Oturum geçersiz" });
    }
    const slug = parsed.data.examSlug.trim();
    const exam = await prisma.examCatalog.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!exam) {
      return reply.status(400).send({ error: "Geçersiz sınav" });
    }
    await prisma.user.update({
      where: { id: session.userId },
      data: { selectedExamId: exam.id },
    });
    const u = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { selectedExam: { select: { slug: true, label: true } } },
    });
    if (!u) {
      return reply.status(500).send({ error: "İşlem tamamlanamadı" });
    }
    return {
      user: {
        id: u.id,
        email: u.email,
        displayName: u.displayName,
        examTargetId: u.examTargetId,
        selectedExamId: u.selectedExamId,
        selectedExamSlug: u.selectedExam?.slug ?? null,
        selectedExamLabel: u.selectedExam?.label ?? null,
        isGuest: u.isGuest,
      },
    };
  });

  /** Geçerli oturumu sunucuda sonlandırır (token geçersiz olur). */
  app.post("/auth/logout", async (request, reply) => {
    const token = authHeaderToken(request.headers.authorization);
    if (!token) {
      return reply.status(401).send({ error: "Yetkisiz" });
    }
    const sess = await prisma.session.findUnique({
      where: { token },
      select: { userId: true },
    });
    await prisma.session.deleteMany({ where: { token } });
    if (sess) {
      await prisma.appLog.create({
        data: {
          level: AppLogLevel.INFO,
          action: "logout",
          userId: sess.userId,
          meta: {} as object,
        },
      });
    }
    return { ok: true };
  });

  app.get("/auth/me", async (request, reply) => {
    const token = authHeaderToken(request.headers.authorization);
    if (!token) {
      return reply.status(401).send({ error: "Yetkisiz" });
    }
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: { include: { selectedExam: { select: { slug: true, label: true } } } } },
    });
    if (!session || session.expiresAt < new Date()) {
      return reply.status(401).send({ error: "Oturum geçersiz" });
    }
    const u = session.user;
    let premium = false;
    const sub = await prisma.subscription.findUnique({
      where: { userId: u.id },
    });
    if (sub && sub.status === SubscriptionStatus.ACTIVE && sub.currentPeriodEnd && sub.currentPeriodEnd > new Date()) {
      premium = true;
    }
    return {
      user: {
        id: u.id,
        email: u.email,
        displayName: u.displayName,
        examTargetId: u.examTargetId,
        selectedExamId: u.selectedExamId,
        selectedExamSlug: u.selectedExam?.slug ?? null,
        selectedExamLabel: u.selectedExam?.label ?? null,
        isGuest: u.isGuest,
      },
      premium,
      subscription: sub
        ? {
            plan: sub.plan,
            status: sub.status,
            currentPeriodEnd: sub.currentPeriodEnd?.toISOString() ?? null,
          }
        : null,
    };
  });

  /** Premium fiyatları (ödeme entegrasyonu öncesi gösterim). */
  app.get("/billing/plans", async () => {
    return {
      currency: "TRY",
      plans: [
        {
          id: "MONTHLY",
          plan: "MONTHLY",
          label: "Aylık",
          priceMinor: 9900,
          priceLabel: "₺99",
          period: "month",
        },
        {
          id: "YEARLY",
          plan: "YEARLY",
          label: "Yıllık",
          priceMinor: 79900,
          priceLabel: "₺799",
          period: "year",
          savingsHint: "2 ay bedava",
        },
      ],
    };
  });
}
