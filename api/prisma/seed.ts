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
  const exam = await prisma.examCatalog.upsert({
    where: { slug: "kpss_lisans_tarih" },
    create: {
      slug: "kpss_lisans_tarih",
      label: "KPSS Lisans Tarih",
      description: "KPSS Genel Yetenek / Genel Kültür — Tarih",
      sortOrder: 0,
      isActive: true,
    },
    update: {},
  });

  // —— Sınav takvimi (örnek veriler) ——
  // Not: applicationDeadline alanı gerçek ÖSYM başvuru son tarihleriyle güncellenmelidir.
  function utcYmdAtHour(dateStr: string, hourUTC: number, minuteUTC = 0): Date {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d, hourUTC, minuteUTC, 0, 0));
  }
  function utcAddDays(dt: Date, days: number): Date {
    return new Date(dt.getTime() + days * 24 * 60 * 60 * 1000);
  }

  const examCalendarRows: Array<{
    examDateStr: string;
    applicationDeadlineStr?: string | null;
    title: string;
    description: string | null;
  }> = [
    {
      examDateStr: "2026-09-06",
      applicationDeadlineStr: "2026-07-13",
      title: "2026-KPSS Lisans (Genel Yetenek-Genel Kültür)",
      description: "ÖSYM başvuru ve sınav duyurularını takip edin.",
    },
    {
      examDateStr: "2026-09-12",
      title: "2026-KPSS Lisans (Alan Bilgisi) 1. gün",
      description: "ÖSYM başvuru ve sınav duyurularını takip edin.",
    },
    {
      examDateStr: "2026-09-13",
      title: "2026-KPSS Lisans (Alan Bilgisi) 2. gün",
      description: "ÖSYM başvuru ve sınav duyurularını takip edin.",
    },
    {
      examDateStr: "2026-10-04",
      title: "2026-KPSS Ön Lisans",
      description: "ÖSYM başvuru ve sınav duyurularını takip edin.",
    },
    {
      examDateStr: "2026-10-25",
      title: "2026-KPSS Ortaöğretim",
      description: "ÖSYM başvuru ve sınav duyurularını takip edin.",
    },
    {
      examDateStr: "2026-11-01",
      title: "2026-KPSS Din Hizmetleri Alan Bilgisi Testi (DHBT)",
      description: "ÖSYM başvuru ve sınav duyurularını takip edin.",
    },
  ];

  // Sınav tarihinden ~45 gün önceyi başvuru son tarihi gibi işliyoruz (geçici).
  for (const row of examCalendarRows) {
    const examDate = utcYmdAtHour(row.examDateStr, 9, 0);
    const applicationDeadline = row.applicationDeadlineStr
      ? utcYmdAtHour(row.applicationDeadlineStr, 0, 0)
      : utcAddDays(examDate, -45);
    // Başvuru son tarihi gün sonu (UTC).
    applicationDeadline.setUTCHours(23, 59, 0, 0);

    await prisma.examCalendar.upsert({
      where: { examId_examDate: { examId: exam.id, examDate } },
      create: {
        examId: exam.id,
        isActive: true,
        examDate,
        applicationDeadline,
        title: row.title,
        description: row.description,
        sortOrder: 0,
      },
      update: {
        isActive: true,
        applicationDeadline,
        title: row.title,
        description: row.description,
        sortOrder: 0,
      },
    });
  }

  await prisma.topic.deleteMany({ where: { examId: exam.id } });

  for (const u of mufredatJson.kpss_tarih_tam_mufredat) {
    await prisma.topic.create({
      data: {
        examId: exam.id,
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
