/**
 * Yalnızca InformationContent tablosunu boşatır (OpenQa / Mcq / Topic / Subtopic dokunulmaz).
 * Kullanım: npx tsx scripts/clear-information-content.ts
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const r = await prisma.informationContent.deleteMany({});
  console.log(`InformationContent silindi: ${r.count} satır.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
