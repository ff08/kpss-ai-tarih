/** ÖSYM / KPSS sınav takvimi — geri sayım için sabit kayıtlar */

export type ExamRecord = {
  id: string;
  /** Üst başlık (kurum / sınav türü) */
  groupLabel: string;
  /** Sınav adı */
  title: string;
  /** YYYY-MM-DD (yerel tarih) */
  date: string;
};

export const KPSS_EXAMS: ExamRecord[] = [
  {
    id: "kpss_2026_lisans_gy_gk",
    groupLabel: "Kamu Personel Seçme Sınavı",
    title: "2026-KPSS Lisans (Genel Yetenek-Genel Kültür)",
    date: "2026-09-06",
  },
  {
    id: "kpss_2026_lisans_alan_1",
    groupLabel: "Kamu Personel Seçme Sınavı",
    title: "2026-KPSS Lisans (Alan Bilgisi) 1. gün",
    date: "2026-09-12",
  },
  {
    id: "kpss_2026_lisans_alan_2",
    groupLabel: "Kamu Personel Seçme Sınavı",
    title: "2026-KPSS Lisans (Alan Bilgisi) 2. gün",
    date: "2026-09-13",
  },
  {
    id: "kpss_2026_on_lisans",
    groupLabel: "Kamu Personel Seçme Sınavı",
    title: "2026-KPSS Ön Lisans",
    date: "2026-10-04",
  },
  {
    id: "kpss_2026_ortaogretim",
    groupLabel: "Kamu Personel Seçme Sınavı",
    title: "2026-KPSS Ortaöğretim",
    date: "2026-10-25",
  },
  {
    id: "kpss_2026_dhbt",
    groupLabel: "Kamu Personel Seçme Sınavı",
    title: "2026-KPSS Din Hizmetleri Alan Bilgisi Testi (DHBT)",
    date: "2026-11-01",
  },
];
