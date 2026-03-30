import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function utcYmdAtHour(dateStr: string, hourUTC: number, minuteUTC = 0): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, hourUTC, minuteUTC, 0, 0));
}

function setToUtcEndOfDay(dt: Date): Date {
  const next = new Date(dt.getTime());
  next.setUTCHours(23, 59, 0, 0);
  return next;
}

async function main() {
  const exam = await prisma.examCatalog.findFirst({
    where: { slug: "kpss_lisans_tarih" },
    select: { id: true },
  });
  if (!exam) throw new Error("Exam slug bulunamadı: kpss_lisans_tarih");

  const examDate = utcYmdAtHour("2026-09-06", 9, 0);
  const applicationDeadline = setToUtcEndOfDay(utcYmdAtHour("2026-07-13", 0, 0));

  await prisma.examCalendar.upsert({
    where: { examId_examDate: { examId: exam.id, examDate } },
    create: {
      examId: exam.id,
      isActive: true,
      examDate,
      applicationDeadline,
      title: "KPSS Lisans 2026 (Genel Yetenek-Genel Kültür)",
      description: null,
      sortOrder: 0,
    },
    update: {
      isActive: true,
      applicationDeadline,
      title: "KPSS Lisans 2026 (Genel Yetenek-Genel Kültür)",
      description: null,
      sortOrder: 0,
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

