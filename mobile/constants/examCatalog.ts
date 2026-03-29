/** Backend `ExamCatalog.slug` ile aynı anahtarlar (migration seed). */
export const LEGACY_EXAM_TARGET_TO_SLUG: Record<string, string> = {
  kpss_lisans: "kpss_lisans_tarih",
  kpss_on_lisans: "kpss_onlisans_tarih",
  kpss_ortaogretim: "kpss_lisans_tarih",
  kpss_dhbt: "kpss_lisans_tarih",
  kpss_ogretmenlik: "kpss_lisans_tarih",
  diger: "kpss_lisans_tarih",
};

export const DEFAULT_EXAM_SLUG = "kpss_lisans_tarih";

export function legacyExamTargetIdToSlug(examTargetId: string | undefined | null): string {
  if (!examTargetId) return DEFAULT_EXAM_SLUG;
  return LEGACY_EXAM_TARGET_TO_SLUG[examTargetId] ?? DEFAULT_EXAM_SLUG;
}

/** Eski `examTargetId` alanını doldurmak için (API geriye dönük uyumluluk) */
export function examSlugToLegacyExamTargetId(slug: string): string {
  if (slug === "kpss_lisans_tarih") return "kpss_lisans";
  if (slug === "kpss_onlisans_tarih") return "kpss_on_lisans";
  return "diger";
}

/** API yoksa veya hata olursa onboarding listesi */
export const FALLBACK_ACTIVE_EXAMS: { slug: string; label: string; description?: string | null }[] = [
  { slug: "kpss_lisans_tarih", label: "KPSS Lisans — Tarih", description: "KPSS Genel Yetenek Tarih müfredatı" },
  { slug: "kpss_onlisans_tarih", label: "KPSS Önlisans — Tarih" },
  { slug: "yks_tarih", label: "YKS — Tarih" },
  { slug: "ayt_tarih", label: "AYT — Tarih" },
  { slug: "lgs_tarih", label: "LGS — Tarih" },
  { slug: "eyds_tarih", label: "e-YDS — Tarih" },
  { slug: "diger_tarih", label: "Diğer sınavlar (Tarih)" },
];
