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

/** İsim → sınav → hesap → e-posta → doğrulama (splash/tanıtım ayrı) */
export const ONBOARDING_TOTAL_STEPS = 5;

/** 1-based adım numarası */
export const ONBOARDING_STEP = {
  name: 1,
  exam: 2,
  authChoice: 3,
  email: 4,
  verify: 5,
} as const;

export const OTP_RESEND_COOLDOWN_SEC = 60;
