/**
 * Onboarding ve e-posta/OTP akışları için sabit yeşil–beyaz tema (ekran görüntüleriyle uyumlu).
 * Uygulama genelinde karanlık moddan bağımsız tutulur.
 */
export const ONBOARDING_THEME = {
  primary: "#74B84D",
  primaryDark: "#5fa33a",
  bg: "#FFFFFF",
  text: "#111827",
  muted: "#6b7280",
  inputBg: "#f3f4f6",
  border: "#e5e7eb",
  trackBg: "#e5e7eb",
  error: "#ef4444",
  onPrimary: "#FFFFFF",
  shadow: "rgba(17, 24, 39, 0.06)",
} as const;

export const ONBOARDING_TOTAL_STEPS = 6;

/** 1-based adım numarası (welcome=1 … verify=6) */
export const ONBOARDING_STEP = {
  welcome: 1,
  name: 2,
  exam: 3,
  authChoice: 4,
  email: 5,
  verify: 6,
} as const;

export const OTP_RESEND_COOLDOWN_SEC = 60;
