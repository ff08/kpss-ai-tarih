/** Onboarding’da “hangi sınava hazırlanıyorsun?” seçenekleri (API’de `examTargetId` olarak saklanır). */
export const ONBOARDING_EXAM_OPTIONS: { id: string; label: string }[] = [
  { id: "kpss_lisans", label: "KPSS Lisans" },
  { id: "kpss_on_lisans", label: "KPSS Ön Lisans" },
  { id: "kpss_ortaogretim", label: "KPSS Ortaöğretim" },
  { id: "kpss_dhbt", label: "KPSS DHBT" },
  { id: "kpss_ogretmenlik", label: "Öğretmenlik / alan sınavı" },
  { id: "diger", label: "Diğer / henüz karar vermedim" },
];
