/**
 * topicId = 1 alt konularında OpenQaContent: her subtopic için en düşük id'li 2 kayıt kalır, fazlası silinir.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TOPIC_ID = 1;
const KEEP_PER_SUBTOPIC = 2;

async function main() {
  const subs = await prisma.subtopic.findMany({
    where: { topicId: TOPIC_ID },
    select: { id: true },
    orderBy: { sortOrder: "asc" },
  });

  let deletedTotal = 0;

  for (const s of subs) {
    const rows = await prisma.openQaContent.findMany({
      where: { subtopicId: s.id, topicId: TOPIC_ID },
      orderBy: { id: "asc" },
      select: { id: true },
    });
    const removeIds = rows.slice(KEEP_PER_SUBTOPIC).map((r) => r.id);
    if (removeIds.length === 0) continue;
    const r = await prisma.openQaContent.deleteMany({
      where: { id: { in: removeIds } },
    });
    deletedTotal += r.count;
    console.log(`subtopicId=${s.id}: kaldı ${Math.min(rows.length, KEEP_PER_SUBTOPIC)}, silindi ${r.count}`);
  }

  console.log(`Tamam. Alt konu: ${subs.length}, toplam silinen OpenQa satırı: ${deletedTotal}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => void prisma.$disconnect());
