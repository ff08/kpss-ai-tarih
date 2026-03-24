import "dotenv/config";
import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const topicId = 1;
  const subtopicId = 1;

  const subtopic = await prisma.subtopic.findFirst({
    where: { id: subtopicId, topicId },
    select: { id: true, title: true, topic: { select: { title: true } } },
  });

  if (!subtopic) {
    throw new Error(`topicId=${topicId}, subtopicId=${subtopicId} bulunamadi.`);
  }

  // Tek kelimelik cevaplar WORD_GAME filtresine uygundur.
  const rows: Prisma.OpenQaContentCreateManyInput[] = [
    {
      topicId,
      subtopicId,
      title: `${subtopic.title} ile ilgili temel kavram nedir?`,
      content: "Tarama",
      tag: "Kelime Oyunu Ornek",
      hint: "Tarih arastirmasinda kaynak arama sureci",
    },
    {
      topicId,
      subtopicId,
      title: `${subtopic.title} kapsaminda belgeyi dogrulama islemi nasil adlandirilir?`,
      content: "Tenkit",
      tag: "Kelime Oyunu Ornek",
      hint: "Kaynak elestirisi ve guvenilirlik analizi",
    },
    {
      topicId,
      subtopicId,
      title: `${subtopic.title} baglaminda olaylari siralama yontemi nedir?`,
      content: "Kronoloji",
      tag: "Kelime Oyunu Ornek",
      hint: "Olaylari zamana gore dizme",
    },
  ] as const;

  await prisma.openQaContent.createMany({ data: rows });

  console.log(
    `Eklendi: topicId=${topicId}, subtopicId=${subtopicId} icin ${rows.length} adet kelime oyunu ornek kaydi.`,
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
