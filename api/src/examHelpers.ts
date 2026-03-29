import type { PrismaClient } from "@prisma/client";

/** Eski onboarding `examTargetId` → `ExamCatalog.slug` */
export const LEGACY_EXAM_TARGET_TO_SLUG: Record<string, string> = {
  kpss_lisans: "kpss_lisans_tarih",
  kpss_on_lisans: "kpss_onlisans_tarih",
  kpss_ortaogretim: "kpss_lisans_tarih",
  kpss_dhbt: "kpss_lisans_tarih",
  kpss_ogretmenlik: "kpss_lisans_tarih",
  diger: "kpss_lisans_tarih",
};

export const DEFAULT_EXAM_SLUG = "kpss_lisans_tarih";

export function legacyExamTargetIdToSlug(examTargetId: string | null | undefined): string {
  if (!examTargetId) return DEFAULT_EXAM_SLUG;
  return LEGACY_EXAM_TARGET_TO_SLUG[examTargetId] ?? DEFAULT_EXAM_SLUG;
}

/** Yeni `examSlug` veya eski `examTargetId` ile `selectedExamId` çözümler. */
export async function resolveSelectedExamId(
  prisma: PrismaClient,
  opts: { examSlug?: string | null; examTargetId?: string | null },
): Promise<number | null> {
  const raw = opts.examSlug?.trim();
  if (raw) {
    const ex = await prisma.examCatalog.findUnique({ where: { slug: raw }, select: { id: true } });
    return ex?.id ?? null;
  }
  const slug = legacyExamTargetIdToSlug(opts.examTargetId ?? undefined);
  const ex = await prisma.examCatalog.findUnique({ where: { slug }, select: { id: true } });
  return ex?.id ?? null;
}

export async function getDefaultExamId(prisma: PrismaClient): Promise<number | null> {
  const ex = await prisma.examCatalog.findUnique({
    where: { slug: DEFAULT_EXAM_SLUG },
    select: { id: true },
  });
  return ex?.id ?? null;
}
