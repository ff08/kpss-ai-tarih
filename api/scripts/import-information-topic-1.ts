/**
 * İslamiyet Öncesi Türk Tarihi (müfredatta sortOrder=1) bilgi kartlarını JSON'dan yükler.
 * Alt konu eşlemesi sortOrder ile yapılır (veritabanı id'leri ortama göre değişebilir).
 *
 * Bilgi kartı `content` formatı (frontend tarafından okunur):
 * - Metin normal şekilde basılır (frontend yalnızca `**kalın**` + satır sonu desteği yapar).
 * - Ayrı `imageUrl` alanı ile kart üstünde görsel gösterilir.
 *
 * Kullanım:
 *   npx tsx scripts/import-information-topic-1.ts
 * Önce tüm bilgi kartlarını silmek için:
 *   npm run db:clear-info
 */
import "dotenv/config";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const __dirname = dirname(fileURLToPath(import.meta.url));

const payloadSchema = z.object({
  topicSortOrder: z.number().int().positive(),
  cards: z.array(
    z.object({
      subtopicSortOrder: z.number().int().positive(),
      title: z.string().min(1),
      content: z.string().min(1),
      tag: z.string().optional(),
      imageUrl: z.string().url().optional().nullable(),
    }),
  ),
});

async function main() {
  const jsonPath = join(__dirname, "..", "prisma", "data", "information-topic-1.json");
  const raw = readFileSync(jsonPath, "utf8");
  const parsed = payloadSchema.parse(JSON.parse(raw));

  const topic = await prisma.topic.findFirst({
    where: { sortOrder: parsed.topicSortOrder },
  });
  if (!topic) {
    throw new Error(`Konu bulunamadı: sortOrder=${parsed.topicSortOrder}. Önce prisma seed çalıştırın.`);
  }
  if (topic.id !== 1) {
    console.warn(`Uyarı: Beklenen topic id=1, veritabanında id=${topic.id}. sortOrder=${parsed.topicSortOrder} kullanılıyor.`);
  }

  const subtopics = await prisma.subtopic.findMany({
    where: { topicId: topic.id },
    orderBy: { sortOrder: "asc" },
  });
  const bySort = new Map(subtopics.map((s) => [s.sortOrder, s]));

  const rows: {
    topicId: number;
    subtopicId: number;
    title: string;
    content: string;
    tag?: string;
    imageUrl?: string | null;
  }[] = [];
  for (const c of parsed.cards) {
    const sub = bySort.get(c.subtopicSortOrder);
    if (!sub) {
      throw new Error(`Alt konu yok: subtopicSortOrder=${c.subtopicSortOrder} (topicId=${topic.id})`);
    }
    rows.push({
      topicId: topic.id,
      subtopicId: sub.id,
      title: c.title.trim(),
      content: c.content.trim(),
      tag: c.tag?.trim() || undefined,
      imageUrl: c.imageUrl?.trim() || null,
    });
  }

  const del = await prisma.informationContent.deleteMany({});
  console.log(`Önceki bilgi kartları silindi: ${del.count} satır.`);

  await prisma.informationContent.createMany({ data: rows });
  console.log(`Yüklendi: ${rows.length} bilgi kartı (konu: ${topic.title}, topicId=${topic.id}).`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
