/**
 * topicId=9 (İslamiyet Öncesi Türk Tarihi) için tüm içerik tablolarını temizler ve
 * scripts/data/islam-oncesi-topic9-packs.ts içindeki müfredat uyumlu verileri yükler.
 *
 *   npx tsx scripts/seed-topic-9-islam-oncesi-content.ts
 */
import "dotenv/config";
import { PrismaClient, type Prisma } from "@prisma/client";
import { TOPIC9_PACKS, type Topic9Pack } from "./data/islam-oncesi-topic9-packs";

const TOPIC_ID = 9;

const prisma = new PrismaClient();

function normalizeWordAnswer(raw: string): string {
  return raw.trim().toLocaleUpperCase("tr-TR");
}

async function main() {
  const topic = await prisma.topic.findUnique({
    where: { id: TOPIC_ID },
    include: { subtopics: { orderBy: { sortOrder: "asc" } } },
  });
  if (!topic) {
    throw new Error(`Topic id=${TOPIC_ID} bulunamadı.`);
  }
  if (topic.title !== "İslamiyet Öncesi Türk Tarihi") {
    console.warn(`Uyarı: topic.title beklenen başlıktan farklı: "${topic.title}"`);
  }

  const delReports = await prisma.contentIssueReport.deleteMany({ where: { topicId: TOPIC_ID } });
  const delInfo = await prisma.informationContent.deleteMany({ where: { topicId: TOPIC_ID } });
  const delQa = await prisma.openQaContent.deleteMany({ where: { topicId: TOPIC_ID } });
  const delWg = await prisma.wordGameContent.deleteMany({ where: { topicId: TOPIC_ID } });
  const delMcq = await prisma.mcqContent.deleteMany({ where: { topicId: TOPIC_ID } });
  console.log(
    `Silindi: ContentIssueReport=${delReports.count}, Information=${delInfo.count}, OpenQa=${delQa.count}, WordGame=${delWg.count}, Mcq=${delMcq.count}`,
  );

  const infoRows: Prisma.InformationContentCreateManyInput[] = [];
  const qaRows: Prisma.OpenQaContentCreateManyInput[] = [];
  const wgRows: Prisma.WordGameContentCreateManyInput[] = [];
  const mcqRows: Prisma.McqContentCreateManyInput[] = [];

  for (const sub of topic.subtopics) {
    const pack: Topic9Pack | undefined = TOPIC9_PACKS[sub.title];
    if (!pack) {
      throw new Error(`Paket yok: subtopic title="${sub.title}" (id=${sub.id}, sortOrder=${sub.sortOrder})`);
    }

    for (const row of pack.information) {
      infoRows.push({
        topicId: TOPIC_ID,
        subtopicId: sub.id,
        title: row.title,
        content: row.content,
        tag: row.tag ?? null,
        imageUrl: null,
      });
    }
    for (const row of pack.openQa) {
      qaRows.push({
        topicId: TOPIC_ID,
        subtopicId: sub.id,
        title: row.title,
        content: row.content,
        tag: row.tag ?? null,
        hint: row.hint ?? null,
      });
    }
    for (const row of pack.wordGames) {
      const answer = normalizeWordAnswer(row.answer);
      if (answer.length < 3 || answer.length > 12) {
        throw new Error(`Kelime oyunu cevabı 3–12 harf olmalı: "${row.answer}" (${sub.title})`);
      }
      wgRows.push({
        topicId: TOPIC_ID,
        subtopicId: sub.id,
        question: row.question,
        answer,
        hint: row.hint,
        tag: "Kelime",
      });
    }
    for (const row of pack.mcq) {
      mcqRows.push({
        topicId: TOPIC_ID,
        subtopicId: sub.id,
        difficulty: row.difficulty,
        title: row.title,
        content: JSON.stringify({ options: row.options, correctIndex: row.correctIndex }),
        explanation: row.explanation,
        tag: "Çoktan seçmeli",
      });
    }
  }

  if (infoRows.length) await prisma.informationContent.createMany({ data: infoRows });
  if (qaRows.length) await prisma.openQaContent.createMany({ data: qaRows });
  if (wgRows.length) await prisma.wordGameContent.createMany({ data: wgRows });
  if (mcqRows.length) await prisma.mcqContent.createMany({ data: mcqRows });

  console.log(
    `Yüklendi (topicId=${TOPIC_ID}): bilgi=${infoRows.length}, soru–cevap=${qaRows.length}, kelime=${wgRows.length}, çoktan seçmeli=${mcqRows.length}`,
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
