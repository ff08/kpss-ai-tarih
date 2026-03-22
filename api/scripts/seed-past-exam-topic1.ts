import "dotenv/config";
import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();
const YEARS = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016] as const;

function toPrompt(subtopicTitle: string, baseTitle: string, year: number): string {
  return `KPSS ${year} (${subtopicTitle}): ${baseTitle} ile ilgili doğru değerlendirme nedir?`;
}

async function main() {
  const topic = await prisma.topic.findUnique({
    where: { id: 1 },
    select: { id: true, title: true },
  });
  if (!topic) {
    throw new Error("topicId=1 bulunamadı.");
  }

  const subtopics = await prisma.subtopic.findMany({
    where: { topicId: topic.id },
    orderBy: { sortOrder: "asc" },
    select: { id: true, title: true },
  });
  if (subtopics.length === 0) {
    throw new Error("topicId=1 için alt konu bulunamadı.");
  }

  const deleted = await prisma.pastExamQaContent.deleteMany({
    where: { topicId: topic.id },
  });
  console.log(`Önceki past-exam kayıtları silindi: ${deleted.count}`);

  const rows: Prisma.PastExamQaContentCreateManyInput[] = [];
  for (const sub of subtopics) {
    const infoCards = await prisma.informationContent.findMany({
      where: { topicId: topic.id, subtopicId: sub.id },
      orderBy: { id: "asc" },
      take: YEARS.length,
      select: { title: true, content: true },
    });
    const qaFallback = await prisma.openQaContent.findMany({
      where: { topicId: topic.id, subtopicId: sub.id },
      orderBy: { id: "asc" },
      take: YEARS.length,
      select: { title: true, content: true },
    });

    const seeds = infoCards.length > 0 ? infoCards : qaFallback;
    if (seeds.length === 0) continue;

    for (let i = 0; i < YEARS.length; i++) {
      const seed = seeds[i % seeds.length]!;
      const year = YEARS[i]!;
      rows.push({
        topicId: topic.id,
        subtopicId: sub.id,
        examYear: year,
        source: "KPSS",
        title: toPrompt(sub.title, seed.title, year),
        content: seed.content,
        tag: "Çıkmış Soru–Cevap",
        hint: `KPSS ${year}`,
      });
    }
  }

  if (rows.length === 0) {
    console.log("Eklenecek kayıt bulunamadı (topicId=1 altındaki subtopiclerde kaynak kart yok).");
    return;
  }

  await prisma.pastExamQaContent.createMany({ data: rows });

  const total = await prisma.pastExamQaContent.count({ where: { topicId: topic.id } });
  const grouped = await prisma.pastExamQaContent.groupBy({
    by: ["subtopicId"],
    where: { topicId: topic.id },
    _count: { _all: true },
    orderBy: { subtopicId: "asc" },
  });
  console.log(`topicId=1 için eklenen toplam kayıt: ${total}`);
  for (const g of grouped) {
    console.log(`- subtopicId=${g.subtopicId}: ${g._count._all}`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
