import type { Subtopic } from "./api";

const CARD_BLURBS = [
  "Önce bilgileri okuyup özümseyin; ardından soru–cevap ve testlerle pekiştirin.",
  "Kavramları sırayla işleyin; her adım bir öncekine dayanır.",
  "Tarihsel bağlamı kurun ve anahtar terimleri hatırlayın.",
  "Kısa tekrarlarla kalıcılığı artırın; acele etmeden ilerleyin.",
];

/**
 * Konu ekranı alt konu kartı metni: önce `Subtopic.description` (DB),
 * yoksa içerik yok / yedek blurp.
 */
export function buildSubtopicCardDescription(st: Subtopic, sortedIndex: number): string {
  const fromDb = st.description?.trim();
  if (fromDb) return fromDb;

  const i = st.informationCount ?? 0;
  const q = st.openQaCount ?? 0;
  const m = st.mcqCount ?? 0;
  const w = st.wordGameCount ?? 0;
  const total = i + q + m + w;
  if (total === 0) {
    return "Bu alt konuda içerik hazırlandığında çalışma adımları burada görünecek.";
  }
  return CARD_BLURBS[sortedIndex % CARD_BLURBS.length];
}
