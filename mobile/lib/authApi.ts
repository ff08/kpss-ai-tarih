import { getDefaultApiBase } from "./config";

const base = () => getDefaultApiBase();

export type AuthUser = {
  id: string;
  email: string | null;
  displayName: string | null;
  examTargetId: string | null;
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
): Promise<AuthResponse> {
  const r = await fetch(`${base()}/auth/otp/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      code,
      displayName,
      examTargetId,
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
): Promise<AuthResponse> {
  const r = await fetch(`${base()}/auth/guest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ guestClientId, displayName, examTargetId }),
  });
  const j = (await r.json()) as AuthResponse & { error?: string };
  if (!r.ok) throw new Error(j.error ?? "Misafir oturumu açılamadı");
  return j as AuthResponse;
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
