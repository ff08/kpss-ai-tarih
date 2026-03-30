import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function utcYmdAtHour(dateStr: string, hourUTC: number, minuteUTC = 0): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, hourUTC, minuteUTC, 0, 0));
}

async function main() {
  const exam = await prisma.examCatalog.findFirst({
    where: { slug: "kpss_lisans_tarih" },
    select: { id: true },
  });
  if (!exam) {
    console.log("Exam not found");
    return;
  }

  const examDate = utcYmdAtHour("2026-09-06", 9, 0);
  const row = await prisma.examCalendar.findUnique({
    where: { examId_examDate: { examId: exam.id, examDate } },
  });

  console.log(
    row
      ? {
          examId: row.examId,
          title: row.title,
          isActive: row.isActive,
          examDate: row.examDate.toISOString(),
          applicationDeadline: row.applicationDeadline.toISOString(),
        }
      : null,
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

