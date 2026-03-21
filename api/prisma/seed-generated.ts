/**
 * Her alt konu için sabit sayıda (PER_SUBTOPIC) bilgi / soru-cevap / çoktan seçmeli üretir.
 */

export const PER_SUBTOPIC = 10;

function clip(s: string, max: number): string {
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1)}…`;
}

const INFO_TAGS = [
  "Özet",
  "KPSS",
  "Tarih",
  "Sınav",
  "Kavram",
  "Kronoloji",
  "Bağlam",
  "Analiz",
  "Karşılaştırma",
  "Hatırlat",
] as const;

function infoContent(subtopicTitle: string, topicTitle: string, n: number): string {
  const t = (n - 1) % 10;
  const blocks: string[] = [
    `**${topicTitle}** ana başlığı altında **${clip(subtopicTitle, 90)}** konusu, müfredatta **kronoloji ve kavram** sorularında sık geçer.\n\n• Tarihleri **neden–sonuç** zinciriyle öğrenin.\n• Harita ve **coğrafi** bağlamı gözden geçirin.\n• Karıştırılan kavramları **tablo** ile ayırın.`,
    `Bu alt konuda **öncelik**: temel tanımlar, **dönüm noktaları** ve sınavda çıkan **karşılaştırmalar**.\n\n• **${clip(subtopicTitle, 70)}** ile ilişkili kişi/yer/olay üçlüsünü eşleştirin.\n• Paragraf sorularında **ana fikir** ve **yardımcı fikir** ayrımı yapın.`,
    `**Ezber değil bağlam:** ${clip(subtopicTitle, 80)} başlığında olayları **zincirleme** okuyun.\n\n• Önce genel çerçeve, sonra detay.\n• **KPSS** tipik olarak “hangisi **değildir**” ve “aşağıdakilerden hangisi **eşleşir**” sorularını sever.`,
    `**Kaynak disiplin:** tarih + coğrafya + kültür bileşkesi. **${topicTitle}** içinde bu alt başlığın **yeri**ni cümleyle özetleyebilin.\n\n• Kronolojik çizelge çıkarın.\n• **Önem–önemsiz** ayrımını müfredat ipuçlarıyla yapın.`,
    `**Sınav stratejisi:** ${clip(subtopicTitle, 75)} için 5 maddelik mini tekrar listesi tutun.\n\n1) Anahtar kavramlar\n2) Tarihler (gün/ay/yıl)\n3) Kişiler ve roller\n4) Sebep–sonuç\n5) Diğer dönemlerle **fark**`,
    `**Yanlış şık tuzakları:** benzer isimli devletler, yakın tarihler, **yakın coğrafya**.\n\n• **${clip(subtopicTitle, 85)}** kapsamında “önce/sonra” ilişkisini netleştirin.\n• İsim eşleştirme sorularında **harf** ve **sıra** dikkat.`,
    `**Medeniyet / kültür** boyutu: sanat, hukuk, ordu, ekonomi etiketlerinden hangileri bu alt konuda öne çıkıyor?\n\n• Her etiket için **bir örnek** yazın.\n• **${topicTitle}** ile bağlantıyı tek cümlede kurun.`,
    `**Diplomasi ve savaş** bağlamı (varsa): antlaşmalar, **cephane**, cephe, **ateşkes** kelimelerini olaylarla ilişkilendirin.\n\n• ${clip(subtopicTitle, 80)} başlığında **özgün** vurgu nedir?\n• Kaynak kitaptaki **başlık altı** maddeleri kontrol edin.`,
    `**Modern dünya bağlantısı** (gerekirse): geçmişten günümüze **miras** ve **etki** sorularına hazırlanın.\n\n• **${clip(subtopicTitle, 75)}** ile ilgili **tartışma** maddelerini not edin.`,
    `**Özet tekrar:** 3 soru yazın ve yanıtlayın:\n\n1) Bu alt konunun **anahtar cümlesi** nedir?\n2) En çok karıştırılan **iki kavram** hangisi?\n3) Bir **neden–sonuç** örneği verin.\n\nKonu: **${clip(subtopicTitle, 70)}** (${topicTitle}).`,
  ];
  return blocks[t] ?? blocks[0];
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
  return { title, options, correctIndex, difficulty };
}

export type FlatSubtopic = { id: number; title: string; topicTitle: string; topicId: number };

export function generatedInformationRows(s: FlatSubtopic, n: number) {
  return {
    topicId: s.topicId,
    subtopicId: s.id,
    title: `${n}. özet — ${clip(s.title, 75)}`,
    content: infoContent(s.title, s.topicTitle, n),
    tag: INFO_TAGS[(n - 1) % INFO_TAGS.length],
  };
}

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
    tag: "Çoktan seçmeli",
  };
}
