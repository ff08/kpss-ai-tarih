import "dotenv/config";
import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const SAMPLE_WORD_GAMES: Array<{ question: string; answer: string; hint: string }> = [
  { question: "Osmanli devlet yonetiminde en ust karar organi?", answer: "DIVAN", hint: "Vezirlerin de toplandigi kurul" },
  { question: "Tarih olaylarini zaman sirasina koyma yontemi?", answer: "KRONOLOJI", hint: "Zaman bilimi" },
  { question: "Belgelerin guvenilirligini sorgulama islemi?", answer: "TENKIT", hint: "Kaynak elestirisi" },
  { question: "Tarih arastirmasinda kaynak toplama asamasi?", answer: "TARAMA", hint: "Ilk arastirma adimi" },
  { question: "Bir devletin baskentine verilen adlardan biri?", answer: "PAYITAHT", hint: "Osmanli icin kullanilir" },
  { question: "Yaziyla olusturulan resmi karar metni?", answer: "FERMAN", hint: "Padisah buyrugu" },
  { question: "Osmanli vergi sistemi icinde toprak duzeni?", answer: "TIMAR", hint: "Sipahi ile iliskili" },
  { question: "Savas ve baris gorusmelerini yurumekle gorevli?", answer: "ELCI", hint: "Diplomatik temsilci" },
  { question: "Tarihte belgeleri saklayan kurumsal birim?", answer: "ARSIV", hint: "Dokuman deposu" },
  { question: "Tarih biliminde olaylari neden-sonuc bagiyla inceleme?", answer: "TAHLIL", hint: "Analiz etme" },
];

function normalizeAnswer(raw: string): string {
  return raw.trim().toLocaleUpperCase("tr-TR");
}

async function main() {
  const topicId = 1;
  const subtopics = await prisma.subtopic.findMany({
    where: { topicId },
    select: { id: true, title: true },
    orderBy: { sortOrder: "asc" },
  });
  if (subtopics.length === 0) {
    throw new Error("topicId=1 icin subtopic bulunamadi.");
  }

  const rows: Prisma.WordGameContentCreateManyInput[] = SAMPLE_WORD_GAMES.map((item, idx) => {
    const targetSubtopic = subtopics[idx % subtopics.length]!;
    return {
      topicId,
      subtopicId: targetSubtopic.id,
      question: item.question,
      answer: normalizeAnswer(item.answer),
      hint: item.hint,
      tag: "Seed Word Game",
    };
  });

  await prisma.wordGameContent.createMany({ data: rows });
  console.log(`Eklendi: topicId=1 icin ${rows.length} adet kelime oyunu kaydi.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
