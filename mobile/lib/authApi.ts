import { getDefaultApiBase } from "./config";

const base = () => getDefaultApiBase();

export type AuthUser = {
  id: string;
  email: string | null;
  displayName: string | null;
  /** @deprecated examSlug / selectedExamSlug kullanın */
  examTargetId: string | null;
  selectedExamId?: number | null;
  selectedExamSlug?: string | null;
  selectedExamLabel?: string | null;
  isGuest: boolean;
};

export type AuthResponse = {
  token: string;
  expiresAt: string;
  user: AuthUser;
};

export async function sendOtp(email: string): Promise<void> {
  const r = await fetch(`${base()}/auth/otp/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim().toLowerCase() }),
  });
  if (!r.ok) {
    const j = (await r.json().catch(() => ({}))) as { error?: string };
    throw new Error(j.error ?? `Kod gönderilemedi (${r.status})`);
  }
}

export async function verifyOtp(
  email: string,
  code: string,
  displayName?: string,
  examTargetId?: string,
  examSlug?: string,
  /** Misafir oturumunu e-posta ile birleştirmek için mevcut session token */
  mergeToken?: string | null,
): Promise<AuthResponse> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (mergeToken) headers.Authorization = `Bearer ${mergeToken}`;
  const r = await fetch(`${base()}/auth/otp/verify`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      code,
      displayName,
      examTargetId,
      examSlug,
    }),
  });
  const j = (await r.json()) as AuthResponse & { error?: string };
  if (!r.ok) throw new Error(j.error ?? "Doğrulama başarısız");
  return j as AuthResponse;
}

export async function createGuestSession(
  guestClientId: string,
  displayName?: string,
  examTargetId?: string,
  examSlug?: string,
): Promise<AuthResponse> {
  const r = await fetch(`${base()}/auth/guest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ guestClientId, displayName, examTargetId, examSlug }),
  });
  const j = (await r.json()) as AuthResponse & { error?: string };
  if (!r.ok) throw new Error(j.error ?? "Misafir oturumu açılamadı");
  return j as AuthResponse;
}

/** Oturumu sunucuda kapatır; hata olsa bile istemci çıkışına devam edilir. */
export async function logoutSession(token: string): Promise<void> {
  try {
    await fetch(`${base()}/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    /* ağ hatası — yerel temizlik yine de yapılır */
  }
}

export async function fetchMe(token: string): Promise<{
  user: AuthUser;
  premium: boolean;
  subscription: { plan: string; status: string; currentPeriodEnd: string | null } | null;
}> {
  const r = await fetch(`${base()}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!r.ok) throw new Error("Oturum geçersiz");
  return r.json() as Promise<{
    user: AuthUser;
    premium: boolean;
    subscription: { plan: string; status: string; currentPeriodEnd: string | null } | null;
  }>;
}

export async function updateMyExam(
  token: string,
  examSlug: string,
): Promise<{ user: AuthUser }> {
  const r = await fetch(`${base()}/auth/me`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ examSlug }),
  });
  const j = (await r.json()) as { user?: AuthUser; error?: string };
  if (!r.ok) throw new Error(j.error ?? "Sınav güncellenemedi");
  if (!j.user) throw new Error("Yanıt geçersiz");
  return { user: j.user };
}

export async function fetchBillingPlans(): Promise<{
  currency: string;
  plans: {
    id: string;
    plan: string;
    label: string;
    priceMinor: number;
    priceLabel: string;
    period: string;
    savingsHint?: string;
  }[];
}> {
  const r = await fetch(`${base()}/billing/plans`);
  if (!r.ok) throw new Error("Planlar alınamadı");
  return r.json();
}

export async function syncRevenueCatSubscription(
  token: string,
  payload: {
    entitlementId: string;
    isActive: boolean;
    productId: string;
    plan: "MONTHLY" | "YEARLY";
    currentPeriodEnd?: string | null;
    appUserId: string;
    platform?: "ios" | "android";
  },
): Promise<{ premium: boolean; subscription: { plan: string; status: string; currentPeriodEnd: string | null } | null }> {
  const r = await fetch(`${base()}/billing/revenuecat/sync`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const j = (await r.json().catch(() => ({}))) as
    | { ok: true; premium: boolean; subscription: { plan: string; status: string; currentPeriodEnd: string | null } }
    | { error?: string };
  if (!r.ok) throw new Error(("error" in j && j.error) ? j.error : "Satın alım senkronlanamadı");
  if (!("ok" in j) || !j.ok) throw new Error("Satın alım senkronlanamadı");
  return { premium: j.premium, subscription: j.subscription ?? null };
}
