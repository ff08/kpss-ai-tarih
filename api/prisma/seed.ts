import { createRequire } from "node:module";
import { PrismaClient, type Prisma } from "@prisma/client";
import { generatedMcqRows, generatedQaRows, PER_SUBTOPIC } from "./seed-generated";

const require = createRequire(import.meta.url);
const mufredatJson = require("./kpss-tarih-mufredat.json") as {
  kpss_tarih_tam_mufredat: {
    unite_no: number;
    ana_baslik: string;
    aciklama: string;
    alt_basliklar: { baslik: string; aciklama: string }[];
  }[];
};

const prisma = new PrismaClient();

async function main() {
  await prisma.wordGameContent.deleteMany();
  await prisma.openQaContent.deleteMany();
  await prisma.mcqContent.deleteMany();
  await prisma.subtopic.deleteMany();
  await prisma.topic.deleteMany();

  for (const u of mufredatJson.kpss_tarih_tam_mufredat) {
    await prisma.topic.create({
      data: {
        title: u.ana_baslik,
        sortOrder: u.unite_no,
        description: u.aciklama,
        subtopics: {
          create: u.alt_basliklar.map((a, i) => ({
            title: a.baslik,
            sortOrder: i + 1,
          })),
        },
      },
    });
  }

  const flat = await prisma.subtopic.findMany({
    include: { topic: { select: { id: true, title: true } } },
    orderBy: [{ topic: { sortOrder: "asc" } }, { sortOrder: "asc" }],
  });

  const qaRows: Prisma.OpenQaContentCreateManyInput[] = [];
  const mcqRows: Prisma.McqContentCreateManyInput[] = [];
  for (const s of flat) {
    const row = {
      id: s.id,
      title: s.title,
      topicTitle: s.topic.title,
      topicId: s.topicId,
    };
    for (let n = 1; n <= PER_SUBTOPIC; n++) {
      const qa = generatedQaRows(row, n);
      qaRows.push({
        topicId: qa.topicId,
        subtopicId: qa.subtopicId,
        title: qa.title,
        content: qa.content,
        tag: qa.tag,
        hint: qa.hint,
      });
      const mcq = generatedMcqRows(row, n);
      mcqRows.push({
        topicId: mcq.topicId,
        subtopicId: mcq.subtopicId,
        difficulty: mcq.difficulty,
        title: mcq.title,
        content: mcq.content,
        explanation: mcq.explanation,
        tag: mcq.tag,
      });
    }
  }
  await prisma.openQaContent.createMany({ data: qaRows });
  await prisma.mcqContent.createMany({ data: mcqRows });

  const topicCount = await prisma.topic.count();
  const subCount = await prisma.subtopic.count();
  const qaCount = await prisma.openQaContent.count();
  const wordGameCount = await prisma.wordGameContent.count();
  const mcqCount = await prisma.mcqContent.count();
  console.log(
    `Seed tamam: ${topicCount} konu, ${subCount} alt konu, bilgi kartları JSON ile ayrı yüklenir; ${qaCount} soru-cevap + ${wordGameCount} kelime oyunu + ${mcqCount} çoktan seçmeli.`,
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
