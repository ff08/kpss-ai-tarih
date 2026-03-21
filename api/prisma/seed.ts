import { PrismaClient, type Prisma } from "@prisma/client";
import {
  flattenSubtopics,
  generatedInformationRows,
  generatedMcqRows,
  generatedQaRows,
  PER_SUBTOPIC,
} from "./seed-generated";

const prisma = new PrismaClient();

const topics: {
  id: string;
  title: string;
  /** Ana sayfa satırında gösterilen kısa açıklama */
  description: string;
  sortOrder: number;
  subtopics: { id: string; title: string; sortOrder: number }[];
}[] = [
    {
      id: "pre_islam_turk",
      title: "İslamiyet Öncesi Türk Tarihi",
      description:
        "Orta Asya kültür merkezleri, Asya Hun ve Göktürk devletleri, kut–kurultay geleneği ve İslamiyet öncesi Türk medeniyeti.",
      sortOrder: 1,
      subtopics: [
        {
          id: "turk_name_culture_centers",
          title: "Türk Adının Anlamı ve Orta Asya Kültür Merkezleri (Anav, Afanesyevo, Andronova vb.)",
          sortOrder: 1,
        },
        {
          id: "first_turk_states",
          title: "İlk Türk Devletleri: Asya Hun, I. ve II. Göktürk (Kutluk), Uygur Devleti.",
          sortOrder: 2,
        },
        {
          id: "other_turk_tribes",
          title: "Diğer Türk Boyları ve Devletleri: Hazarlar, Avarlar, Peçenekler, Macarlar, Kumanlar vb.",
          sortOrder: 3,
        },
        {
          id: "culture_civilization_pre",
          title: "Kültür ve Medeniyet: Devlet yönetimi (Kut, Kurultay), Ordu, Sosyal Hayat, Din ve İnanış, Hukuk, Sanat.",
          sortOrder: 4,
        },
      ],
    },
    {
      id: "turk_islam",
      title: "Türk-İslam Tarihi",
      sortOrder: 2,
      subtopics: [
        {
          id: "first_muslim_turk_states",
          title: "İlk Müslüman Türk Devletleri: Karahanlılar, Gazneliler, Büyük Selçuklu Devleti.",
          sortOrder: 1,
        },
        {
          id: "egypt_turk_states",
          title: "Mısır'da Kurulan Türk Devletleri: Tolunoğulları, İhşidiler, Eyyubiler, Memlükler.",
          sortOrder: 2,
        },
        {
          id: "other_states_mongol",
          title: "Diğer Devletler: Harzemşahlar, Moğol İmparatorluğu ve Parçalanması (Altın Orda, Çağatay vb.).",
          sortOrder: 3,
        },
        {
          id: "culture_civilization_turk_islam",
          title: "Kültür ve Medeniyet: Toprak sistemi (İkta), Eğitim (Medreseler), Mimari, Bilim İnsanları (Farabi, İbn-i Sina, Biruni).",
          sortOrder: 4,
        },
      ],
    },
    {
      id: "anadolu_selcuk",
      title: "Türkiye (Anadolu) Selçuklu Tarihi ve Beylikler",
      description:
        "I. ve II. dönem Anadolu beylikleri, Türkiye Selçuklu Devleti ve Osmanlı’ya zemin hazırlayan siyasi düzen.",
      sortOrder: 3,
      subtopics: [
        {
          id: "beylik_period_1",
          title: "I. Dönem Anadolu Beylikleri: Saltuklular, Mengücekliler, Danişmentliler, Artuklular, Çaka Beyliği.",
          sortOrder: 1,
        },
        {
          id: "turkey_seljuk",
          title: "Türkiye Selçuklu Devleti: Kuruluş, Yükselme ve Kösedağ Savaşı sonrası yıkılış süreci.",
          sortOrder: 2,
        },
        {
          id: "beylik_period_2",
          title: "II. Dönem Anadolu Beylikleri: Karamanoğulları, Karesioğulları, Germiyanoğulları vb.",
          sortOrder: 3,
        },
      ],
    },
    {
      id: "ottoman_political",
      title: "Osmanlı Devleti: Siyasi Tarih",
      description:
        "1299–1922 kuruluştan dağılışa fetihler, duraklama ve gerileme; antlaşmalar, isyanlar ve diplomasi ile siyasi çizgi.",
      sortOrder: 4,
      subtopics: [
        { id: "foundation_1299_1453", title: "Kuruluş Dönemi (1299 - 1453)", sortOrder: 1 },
        {
          id: "rise_1453_1579",
          title: "Yükselme Dönemi (Dünya Gücü Osmanlı: 1453 - 1579)",
          sortOrder: 2,
        },
        {
          id: "stagnation_and_decline",
          title: "Duraklama ve Gerileme Dönemleri (Arayış ve Diplomasi Yılları)",
          sortOrder: 3,
        },
        {
          id: "dissolution_1792_1922",
          title: "Dağılma Dönemi (En Uzun Yüzyıl: 1792 - 1922)",
          sortOrder: 4,
        },
      ],
    },
    {
      id: "ottoman_culture",
      title: "Osmanlı Kültür ve Medeniyeti (Sınavın Kalbi)",
      description:
        "Merkez ve taşra teşkilatı, tımar, hukuk, ordu, eğitim, lonca ve ekonomi; sınavda sık çıkan kurum ve kavramlar.",
      sortOrder: 5,
      subtopics: [
        {
          id: "central_org",
          title: "Merkez Teşkilatı: Padişah, Saray, Divan-ı Hümayun ve Üyeleri.",
          sortOrder: 1,
        },
        {
          id: "provincial_org",
          title: "Taşra Teşkilatı: Eyalet Sistemi, Tımar Sistemi.",
          sortOrder: 2,
        },
        {
          id: "law_army_education",
          title: "Hukuk, Ordu ve Eğitim: Enderun, Medreseler, Yeniçeri Ocağı.",
          sortOrder: 3,
        },
        {
          id: "economy_social",
          title: "Ekonomi ve Sosyal Hayat: Lonca Teşkilatı, Vakıflar, Vergi Türleri.",
          sortOrder: 4,
        },
      ],
    },
    {
      id: "ottoman_xx",
      title: "XX. Yüzyılda Osmanlı Devleti",
      sortOrder: 6,
      subtopics: [
        { id: "tripolitan_balkan_wars", title: "Trablusgarp ve Balkan Savaşları", sortOrder: 1 },
        {
          id: "ww1_fronts",
          title: "I. Dünya Savaşı: Cepheler, Gizli Antlaşmalar, Ateşkes (Mondros).",
          sortOrder: 2,
        },
        { id: "societies_xx", title: "Cemiyetler: Yararlı ve Zararlı Cemiyetler.", sortOrder: 3 },
      ],
    },
    {
      id: "war_independence",
      title: "Kurtuluş Savaşı: Hazırlık ve Muharebeler",
      description:
        "Amasya genelgesi, Erzurum ve Sivas kongreleri, TBMM, cephe muharebeleri, Mudanya ve Lozan ile tam bağımsızlık.",
      sortOrder: 7,
      subtopics: [
        {
          id: "preparation_period",
          title: "Hazırlık Dönemi: Genelgeler (Amasya) ve Kongreler (Erzurum, Sivas), TBMM'nin Açılması.",
          sortOrder: 1,
        },
        {
          id: "battles_period",
          title: "Muharebeler Dönemi: Doğu, Güney ve Batı Cepheleri (I. ve II. İnönü, Kütahya-Eskişehir, Sakarya, Büyük Taarruz).",
          sortOrder: 2,
        },
        {
          id: "diplomacy_lozan",
          title: "Diplomasi: Mudanya Ateşkesi ve Lozan Barış Antlaşması.",
          sortOrder: 3,
        },
      ],
    },
    {
      id: "ataturk_principles",
      title: "Atatürk İlke ve İnkılapları",
      description:
        "Altı ilke, siyasi–hukuki–toplumsal inkılaplar ve çağdaş laik Cumhuriyet’in temel taşları.",
      sortOrder: 8,
      subtopics: [
        {
          id: "ataturk_principles_list",
          title: "Atatürk İlkeleri: Cumhuriyetçilik, Milliyetçilik, Halkçılık, Devletçilik, Laiklik, İnkılapçılık.",
          sortOrder: 1,
        },
        {
          id: "reforms_ataturk",
          title: "İnkılaplar: Siyasi, Hukuki, Eğitim, Toplumsal ve Ekonomik alandaki yenilikler.",
          sortOrder: 2,
        },
      ],
    },
    {
      id: "modern_turk_world",
      title: "Çağdaş Türk ve Dünya Tarihi",
      sortOrder: 9,
      subtopics: [
        {
          id: "interwar",
          title: "İki Savaş Arası Dönem: SSCB, Orta Doğu, Uzak Doğu'daki gelişmeler.",
          sortOrder: 1,
        },
        {
          id: "ww2_turkey",
          title: "II. Dünya Savaşı: Savaşın seyri ve Türkiye'nin tutumu.",
          sortOrder: 2,
        },
        {
          id: "cold_war_global",
          title: "Soğuk Savaş Dönemi, Yumuşama ve Küreselleşen Dünya.",
          sortOrder: 3,
        },
      ],
    },
  ];

async function main() {
  await prisma.informationCard.deleteMany();
  await prisma.subtopic.deleteMany();
  await prisma.topic.deleteMany();

  for (const t of topics) {
    await prisma.topic.create({
      data: {
        id: t.id,
        title: t.title,
        sortOrder: t.sortOrder,
        description: t.description,
        subtopics: {
          create: t.subtopics.map((s) => ({
            id: s.id,
            title: s.title,
            sortOrder: s.sortOrder,
          })),
        },
      },
    });
  }

  const flat = flattenSubtopics(topics);
  const rows: Prisma.InformationCardCreateManyInput[] = [];
  for (const s of flat) {
    for (let n = 1; n <= PER_SUBTOPIC; n++) {
      const inf = generatedInformationRows(s, n);
      rows.push({
        id: inf.id,
        subtopicId: inf.subtopicId,
        kind: inf.kind,
        title: inf.title,
        content: inf.content,
        tag: inf.tag,
      });
      const qa = generatedQaRows(s, n);
      rows.push({
        id: qa.id,
        subtopicId: qa.subtopicId,
        kind: qa.kind,
        title: qa.title,
        content: qa.content,
        tag: qa.tag,
        hint: qa.hint,
      });
      const mcq = generatedMcqRows(s, n);
      rows.push({
        id: mcq.id,
        subtopicId: mcq.subtopicId,
        kind: mcq.kind,
        difficulty: mcq.difficulty,
        title: mcq.title,
        content: mcq.content,
        tag: mcq.tag,
      });
    }
  }
  await prisma.informationCard.createMany({ data: rows });

  const topicCount = await prisma.topic.count();
  const subCount = await prisma.subtopic.count();
  const cardCount = await prisma.informationCard.count();
  console.log(
    `Seed tamam: ${topicCount} konu, ${subCount} alt konu, ${cardCount} kart (alt konu başına ${PER_SUBTOPIC} bilgi + ${PER_SUBTOPIC} soru-cevap + ${PER_SUBTOPIC} çoktan seçmeli).`,
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
