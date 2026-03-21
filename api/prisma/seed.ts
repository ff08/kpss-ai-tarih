import { createRequire } from "node:module";
import { PrismaClient, type Prisma } from "@prisma/client";
import {
  flattenSubtopics,
  generatedInformationRows,
  generatedMcqRows,
  generatedQaRows,
  PER_SUBTOPIC,
} from "./seed-generated";

const require = createRequire(import.meta.url);
const mufredatJson = require("./kpss-tarih-mufredat.json") as {
  kpss_tarih_tam_mufredat: {
    id: string;
    unite_no: number;
    ana_baslik: string;
    aciklama: string;
    alt_basliklar: { id: string; baslik: string; aciklama: string }[];
  }[];
};

const prisma = new PrismaClient();

type SeedTopic = {
  id: string;
  title: string;
  description: string;
  sortOrder: number;
  subtopics: { id: string; title: string; sortOrder: number }[];
};

const topics: SeedTopic[] = mufredatJson.kpss_tarih_tam_mufredat.map((u) => ({
  id: u.id,
  title: u.ana_baslik,
  description: u.aciklama,
  sortOrder: u.unite_no,
  subtopics: u.alt_basliklar.map((a, i) => ({
    id: a.id,
    title: a.baslik,
    sortOrder: i + 1,
  })),
}));

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
