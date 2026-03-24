/**
 * Her alt konu için sabit sayıda (PER_SUBTOPIC) soru-cevap / çoktan seçmeli üretir.
 * Bilgi kartları: `prisma/data/information-topic-1.json` + `scripts/import-information-topic-1.ts`
 */

export const PER_SUBTOPIC = 10;

function clip(s: string, max: number): string {
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1)}…`;
}

const QA_FACE_HINTS = [
  "Önce soruda geçen kavramı netleştir.",
  "Zihninde bir örnek olay canlandır.",
  "Anahtar terimi cümle içinde kullan.",
  "Kronolojiyi tek cümleyle özetle.",
  "Yanlış şık tuzaklarını düşün.",
  "Paragrafta ana fikri ayırt et.",
  "Coğrafya veya bağlam ipucu ara.",
  "Neden–sonuç zincirini kur.",
  "Karşılaştırma eksenlerini seç.",
  "Sesli tekrar için 3 madde söyle.",
] as const;

function qaPair(subtopicTitle: string, topicTitle: string, n: number): { title: string; content: string } {
  const t = (n - 1) % 10;
  const st = clip(subtopicTitle, 95);
  const questions = [
    `“${st}” alt konusunda KPSS’nin en sık sorduğu **kavramsal çekirdek** nedir?`,
    `Bu alt başlıkta **kronoloji**yi nasıl akılda tutmalıyım?`,
    `“${st}” ile **${topicTitle}** arasındaki ilişkiyi tek paragrafta nasıl özetlersin?`,
    `Bu konuda **yanlış şık** üretmek için hangi benzerlikler kullanılır?`,
    `Paragraf sorusu çıksa hangi **ana fikri** savunmalıyım?`,
    `“${st}” kapsamında **devlet–toplum** ilişkisine örnek ver.`,
    `Bu alt konuda **coğrafya** boyutu neden önemli?`,
    `“${st}” ile ilgili **neden–sonuç** zincirini kur.`,
    `Sınavda **karşılaştırma** sorusu gelirse hangi eksenleri kullanmalıyım?`,
    `Bu başlıkta **hatırlatma listesi** olarak 4 madde öner.`,
  ];
  const answers = [
    `Çekirdek kavramlar: tanım + **örnek olay** + müfredat vurgusu. **${st}** için önce genel çerçeve, sonra sınavda çıkan **ayrıntı**.\n\n• Anahtar terimleri **cümle içinde** tekrar edin.`,
    `Zaman çizelgesi çıkarın; **önce geniş**, sonra **dar** aralık. **${topicTitle}** içinde bu alt başlığın **yeri**ni tek cümleyle sabitleyin.\n\n• Tarihleri **olayla** eşleştirin, yalın ezberden kaçının.`,
    `İlişki özeti: **${topicTitle}** büyük çerçeve; **${st}** bu çerçevede belirli **olay/kavram kümesi**. Sınavda “bağlam” sorularında bu iki düzeyi ayırt edin.`,
    `Benzer isimler, yakın tarihler ve **yakın coğrafya** tuzak oluşturur. Şıklarda **kesin bağlantı** arayın; zayıf eşleşmeleri eleyin.`,
    `Ana fikir: müfredatın bu alt başlıkta **vurguladığı** siyasi/kültürel/askeri çekirdek. Yardımcı fikirler: örnekler ve **tarih**.\n\n• Paragrafta **konu cümlesi** = ana fikir.`,
    `Örnek: merkez–taşra, vergi–askerlik, din–hukuk eksenlerinden **bu başlığa oturan** birini seçip kısa açıklayın. Somut **isim/tarih** ekleyin.`,
    `Coğrafya; güzergâh, **sınır**, doğal setler ve **strateji** sorularında belirleyicidir. Haritada **yer** gösterin, olayı **konumla** ilişkilendirin.`,
    `Zincir: önce **kısa sebep**, sonra **olay**, sonra **sonuç**. Mümkünse **tarih** ve **aktör** ekleyin. Alternatif senaryoları (yanlış şıkları) eleyin.`,
    `Eksenler: **zaman**, **coğrafya**, **aktör**, **sonuç**. İki olayı bu dörtlü üzerinden **karşılaştırın**; benzerlik ve farkı net yazın.`,
    `1) Tanım cümlesi\n2) 2 önemli tarih/olay\n3) 1 karışan kavram çifti\n4) 1 sınav ipucu\n\n— **${st}** için bu listeyi sesli tekrar edin.`,
  ];
  return { title: questions[t] ?? questions[0], content: answers[t] ?? answers[0] };
}

function mcqPayload(subtopicTitle: string, topicTitle: string, n: number): {
  title: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
} {
  const correctIndex = (n - 1) % 4;
  const correct = `Bu alt başlık KPSS müfredatında **${clip(subtopicTitle, 85)}** ile doğrudan ilişkilendirilir ve **${clip(topicTitle, 50)}** kapsamında çalışılır.`;
  const wrong = [
    "Bu alt başlık yalnızca antik Yunan şehir devletleriyle ilişkilendirilir; Türk–İslam veya Osmanlı bağlamı yoktur.",
    "Bu alt başlık yalnızca II. Dünya Savaşı Pasifik cephesiyle ilişkilendirilir; Anadolu tarihiyle bağlantısı yoktur.",
    "Bu alt başlık yalnızca Sanayi İnkılabı’nın İngiltere ekonomisiyle ilişkilendirilir; Türkiye tarihiyle ilgisi yoktur.",
  ];
  const options = ["", "", "", ""];
  options[correctIndex] = correct;
  let wi = 0;
  for (let i = 0; i < 4; i++) {
    if (i !== correctIndex) {
      options[i] = wrong[wi] ?? wrong[0];
      wi++;
    }
  }
  const title = `Aşağıdaki ifadelerden hangisi **${clip(subtopicTitle, 72)}** alt konusunun müfredattaki yeriyle en uyumludur?`;
  const difficulty = (["EASY", "MEDIUM", "HARD"] as const)[(n - 1) % 3];
  const explanation =
    `Doğru seçenek, ${clip(subtopicTitle, 68)} alt konusunu ${clip(topicTitle, 46)} bağlamında doğru konumlandırır. ` +
    "Yanlış seçenekler ise konuyu KPSS-Tarih müfredatı dışı dönem/bağlamlarla eşleştirerek hatalı çıkarım üretir.";
  return { title, options, correctIndex, explanation, difficulty };
}

export type FlatSubtopic = { id: number; title: string; topicTitle: string; topicId: number };

export function generatedQaRows(s: FlatSubtopic, n: number) {
  const { title, content } = qaPair(s.title, s.topicTitle, n);
  const hint = QA_FACE_HINTS[(n - 1) % QA_FACE_HINTS.length];
  return {
    topicId: s.topicId,
    subtopicId: s.id,
    title,
    content,
    tag: "Soru–Cevap",
    hint,
  };
}

export function generatedMcqRows(s: FlatSubtopic, n: number) {
  const m = mcqPayload(s.title, s.topicTitle, n);
  return {
    topicId: s.topicId,
    subtopicId: s.id,
    difficulty: m.difficulty,
    title: m.title,
    content: JSON.stringify({ options: m.options, correctIndex: m.correctIndex }),
    explanation: m.explanation,
    tag: "Çoktan seçmeli",
  };
}
