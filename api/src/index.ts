import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { PrismaClient, type ContentDatasetKind } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const contentIssueBodySchema = z.object({
  topicId: z.number().int().positive(),
  subtopicId: z.number().int().positive(),
  datasetKind: z.enum(["INFORMATION", "OPEN_QA", "MCQ"]),
  contentRowId: z.number().int().positive(),
  category: z.enum(["WRONG_INFO", "CONFLICTING_INFO", "MISSING_INFO"]),
  note: z.string().max(8000).optional().nullable(),
  topicTitleSnapshot: z.string().max(500).optional().nullable(),
  subtopicTitleSnapshot: z.string().max(500).optional().nullable(),
  cardTitleSnapshot: z.string().max(512).optional().nullable(),
});
const app = Fastify({ logger: true });

const port = Number(process.env.PORT) || 3000;

/** Yol parametresinden pozitif tamsayı id (konu / alt konu) */
function parsePositiveIntParam(raw: string): number | null {
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1) return null;
  return n;
}

async function verifyContentRowExists(
  topicId: number,
  subtopicId: number,
  datasetKind: ContentDatasetKind,
  contentRowId: number,
): Promise<boolean> {
  const sub = await prisma.subtopic.findFirst({
    where: { id: subtopicId, topicId },
    select: { id: true },
  });
  if (!sub) return false;
  if (datasetKind === "INFORMATION") {
    return !!(await prisma.informationContent.findFirst({
      where: { id: contentRowId, subtopicId },
      select: { id: true },
    }));
  }
  if (datasetKind === "OPEN_QA") {
    return !!(await prisma.openQaContent.findFirst({
      where: { id: contentRowId, subtopicId },
      select: { id: true },
    }));
  }
  return !!(await prisma.mcqContent.findFirst({
    where: { id: contentRowId, subtopicId },
    select: { id: true },
  }));
}

async function build() {
  await app.register(cors, {
    origin: true,
  });

  app.get("/health", async () => ({ ok: true }));

  app.get("/topics", async () => {
    const topics = await prisma.topic.findMany({
      orderBy: { sortOrder: "asc" },
      select: { id: true, title: true, description: true, sortOrder: true },
    });
    const topicIds = topics.map((t) => t.id);
    const subtopics = await prisma.subtopic.findMany({
      where: { topicId: { in: topicIds } },
      select: { id: true, topicId: true },
    });
    const subtopicToTopic = new Map(subtopics.map((s) => [s.id, s.topicId]));

    type TopicStats = {
      subtopicCount: number;
      informationCount: number;
      openQaCount: number;
      mcqCount: number;
    };
    const stats = new Map<number, TopicStats>();
    for (const t of topics) {
      stats.set(t.id, { subtopicCount: 0, informationCount: 0, openQaCount: 0, mcqCount: 0 });
    }
    for (const s of subtopics) {
      const row = stats.get(s.topicId);
      if (row) row.subtopicCount += 1;
    }

    const subtopicIds = subtopics.map((s) => s.id);
    if (subtopicIds.length === 0) {
      return {
        topics: topics.map((t) => {
          const s = stats.get(t.id)!;
          return {
            ...t,
            subtopicCount: s.subtopicCount,
            informationCount: s.informationCount,
            openQaCount: s.openQaCount,
            mcqCount: s.mcqCount,
          };
        }),
      };
    }

    const [infoCounts, qaCounts, mcqCounts] = await Promise.all([
      prisma.informationContent.groupBy({
        by: ["subtopicId"],
        where: { subtopicId: { in: subtopicIds } },
        _count: { _all: true },
      }),
      prisma.openQaContent.groupBy({
        by: ["subtopicId"],
        where: { subtopicId: { in: subtopicIds } },
        _count: { _all: true },
      }),
      prisma.mcqContent.groupBy({
        by: ["subtopicId"],
        where: { subtopicId: { in: subtopicIds } },
        _count: { _all: true },
      }),
    ]);

    function addCounts(
      rows: { subtopicId: number; _count: { _all: number } }[],
      key: "informationCount" | "openQaCount" | "mcqCount",
    ) {
      for (const row of rows) {
        const topicId = subtopicToTopic.get(row.subtopicId);
        if (!topicId) continue;
        const agg = stats.get(topicId);
        if (!agg) continue;
        agg[key] += row._count._all;
      }
    }
    addCounts(infoCounts, "informationCount");
    addCounts(qaCounts, "openQaCount");
    addCounts(mcqCounts, "mcqCount");

    return {
      topics: topics.map((t) => {
        const s = stats.get(t.id)!;
        return {
          ...t,
          subtopicCount: s.subtopicCount,
          informationCount: s.informationCount,
          openQaCount: s.openQaCount,
          mcqCount: s.mcqCount,
        };
      }),
    };
  });

  app.get("/topics/:topicId/subtopics", async (request, reply) => {
    const { topicId } = request.params as { topicId: string };
    const topicIdNum = parsePositiveIntParam(topicId);
    if (topicIdNum === null) {
      return reply.status(404).send({ error: "Konu bulunamadı" });
    }
    const topic = await prisma.topic.findUnique({
      where: { id: topicIdNum },
      include: {
        subtopics: { orderBy: { sortOrder: "asc" }, select: { id: true, title: true, sortOrder: true } },
      },
    });
    if (!topic) {
      return reply.status(404).send({ error: "Konu bulunamadı" });
    }
    const ids = topic.subtopics.map((s) => s.id);
    if (ids.length === 0) {
      return {
        topicId: topic.id,
        title: topic.title,
        subtopics: topic.subtopics.map((s) => ({
          ...s,
          informationCount: 0,
          openQaCount: 0,
          mcqCount: 0,
        })),
      };
    }
    const [infoCounts, qaCounts, mcqCounts] = await Promise.all([
      prisma.informationContent.groupBy({
        by: ["subtopicId"],
        where: { subtopicId: { in: ids } },
        _count: { _all: true },
      }),
      prisma.openQaContent.groupBy({
        by: ["subtopicId"],
        where: { subtopicId: { in: ids } },
        _count: { _all: true },
      }),
      prisma.mcqContent.groupBy({
        by: ["subtopicId"],
        where: { subtopicId: { in: ids } },
        _count: { _all: true },
      }),
    ]);
    const mapI = new Map(infoCounts.map((r) => [r.subtopicId, r._count._all]));
    const mapQ = new Map(qaCounts.map((r) => [r.subtopicId, r._count._all]));
    const mapM = new Map(mcqCounts.map((r) => [r.subtopicId, r._count._all]));
    return {
      topicId: topic.id,
      title: topic.title,
      subtopics: topic.subtopics.map((s) => ({
        ...s,
        informationCount: mapI.get(s.id) ?? 0,
        openQaCount: mapQ.get(s.id) ?? 0,
        mcqCount: mapM.get(s.id) ?? 0,
      })),
    };
  });

  app.get("/subtopics/:subtopicId", async (request, reply) => {
    const { subtopicId } = request.params as { subtopicId: string };
    const subtopicIdNum = parsePositiveIntParam(subtopicId);
    if (subtopicIdNum === null) {
      return reply.status(404).send({ error: "Alt konu bulunamadı" });
    }
    const sub = await prisma.subtopic.findUnique({
      where: { id: subtopicIdNum },
      include: { topic: { select: { id: true, title: true } } },
    });
    if (!sub) {
      return reply.status(404).send({ error: "Alt konu bulunamadı" });
    }
    return {
      subtopicId: sub.id,
      title: sub.title,
      topicId: sub.topic.id,
      topicTitle: sub.topic.title,
    };
  });

  app.get("/subtopics/:subtopicId/cards", async (request, reply) => {
    const { subtopicId } = request.params as { subtopicId: string };
    const subtopicIdNum = parsePositiveIntParam(subtopicId);
    if (subtopicIdNum === null) {
      return reply.status(404).send({ error: "Alt konu bulunamadı" });
    }
    const q = request.query as { kind?: string };
    const allowed = ["INFORMATION", "OPEN_QA", "MCQ"] as const;
    const kind = allowed.includes(q.kind as (typeof allowed)[number]) ? (q.kind as (typeof allowed)[number]) : "INFORMATION";

    const sub = await prisma.subtopic.findUnique({
      where: { id: subtopicIdNum },
      include: {
        topic: { select: { id: true, title: true } },
      },
    });
    if (!sub) {
      return reply.status(404).send({ error: "Alt konu bulunamadı" });
    }

    if (kind === "INFORMATION") {
      const rows = await prisma.informationContent.findMany({
        where: { subtopicId: subtopicIdNum },
        orderBy: { id: "asc" },
        select: { id: true, title: true, content: true, tag: true },
      });
      return {
        subtopicId: sub.id,
        title: sub.title,
        topicId: sub.topic.id,
        topicTitle: sub.topic.title,
        kind,
        cards: rows.map((c) => ({
          id: c.id,
          kind: "INFORMATION" as const,
          difficulty: null,
          title: c.title,
          content: c.content,
          tag: c.tag,
          hint: null,
        })),
      };
    }

    if (kind === "OPEN_QA") {
      const rows = await prisma.openQaContent.findMany({
        where: { subtopicId: subtopicIdNum },
        orderBy: { id: "asc" },
        select: { id: true, title: true, content: true, tag: true, hint: true },
      });
      return {
        subtopicId: sub.id,
        title: sub.title,
        topicId: sub.topic.id,
        topicTitle: sub.topic.title,
        kind,
        cards: rows.map((c) => ({
          id: c.id,
          kind: "OPEN_QA" as const,
          difficulty: null,
          title: c.title,
          content: c.content,
          tag: c.tag,
          hint: c.hint,
        })),
      };
    }

    const rows = await prisma.mcqContent.findMany({
      where: { subtopicId: subtopicIdNum },
      orderBy: { id: "asc" },
      select: { id: true, difficulty: true, title: true, content: true, tag: true },
    });
    return {
      subtopicId: sub.id,
      title: sub.title,
      topicId: sub.topic.id,
      topicTitle: sub.topic.title,
      kind,
      cards: rows.map((c) => ({
        id: c.id,
        kind: "MCQ" as const,
        difficulty: c.difficulty,
        title: c.title,
        content: c.content,
        tag: c.tag,
        hint: null,
      })),
    };
  });

  app.post("/content-issue-reports", async (request, reply) => {
    const parsed = contentIssueBodySchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Geçersiz istek" });
    }
    const b = parsed.data;
    const exists = await verifyContentRowExists(
      b.topicId,
      b.subtopicId,
      b.datasetKind as ContentDatasetKind,
      b.contentRowId,
    );
    if (!exists) {
      return reply.status(404).send({ error: "İçerik bulunamadı veya konu/alt konu eşleşmiyor" });
    }
    const row = await prisma.contentIssueReport.create({
      data: {
        topicId: b.topicId,
        subtopicId: b.subtopicId,
        datasetKind: b.datasetKind as ContentDatasetKind,
        contentRowId: b.contentRowId,
        category: b.category,
        note: b.note ?? undefined,
        topicTitleSnapshot: b.topicTitleSnapshot ?? undefined,
        subtopicTitleSnapshot: b.subtopicTitleSnapshot ?? undefined,
        cardTitleSnapshot: b.cardTitleSnapshot ?? undefined,
      },
    });
    return { id: row.id, createdAt: row.createdAt.toISOString() };
  });

  return app;
}

build()
  .then((server) => {
    server.listen({ port, host: "0.0.0.0" }, (err) => {
      if (err) {
        server.log.error(err);
        process.exit(1);
      }
    });
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
