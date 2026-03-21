import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = Fastify({ logger: true });

const port = Number(process.env.PORT) || 3000;

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
    const stats = new Map<string, TopicStats>();
    for (const t of topics) {
      stats.set(t.id, { subtopicCount: 0, informationCount: 0, openQaCount: 0, mcqCount: 0 });
    }
    for (const s of subtopics) {
      const row = stats.get(s.topicId);
      if (row) row.subtopicCount += 1;
    }

    const subtopicIds = subtopics.map((s) => s.id);
    const cardCounts =
      subtopicIds.length === 0
        ? []
        : await prisma.informationCard.groupBy({
            by: ["subtopicId", "kind"],
            where: { subtopicId: { in: subtopicIds } },
            _count: { _all: true },
          });

    for (const row of cardCounts) {
      const topicId = subtopicToTopic.get(row.subtopicId);
      if (!topicId) continue;
      const agg = stats.get(topicId);
      if (!agg) continue;
      const n = row._count._all;
      if (row.kind === "INFORMATION") agg.informationCount += n;
      else if (row.kind === "OPEN_QA") agg.openQaCount += n;
      else if (row.kind === "MCQ") agg.mcqCount += n;
    }

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
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      include: {
        subtopics: { orderBy: { sortOrder: "asc" }, select: { id: true, title: true, sortOrder: true } },
      },
    });
    if (!topic) {
      return reply.status(404).send({ error: "Konu bulunamadı" });
    }
    return { topicId: topic.id, title: topic.title, subtopics: topic.subtopics };
  });

  app.get("/subtopics/:subtopicId", async (request, reply) => {
    const { subtopicId } = request.params as { subtopicId: string };
    const sub = await prisma.subtopic.findUnique({
      where: { id: subtopicId },
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
    const q = request.query as { kind?: string };
    const allowed = ["INFORMATION", "OPEN_QA", "MCQ"] as const;
    const kind = allowed.includes(q.kind as (typeof allowed)[number]) ? (q.kind as (typeof allowed)[number]) : "INFORMATION";

    const sub = await prisma.subtopic.findUnique({
      where: { id: subtopicId },
      include: {
        topic: { select: { id: true, title: true } },
        cards: {
          where: { kind },
          orderBy: { id: "asc" },
          select: { id: true, kind: true, difficulty: true, title: true, content: true, tag: true, hint: true },
        },
      },
    });
    if (!sub) {
      return reply.status(404).send({ error: "Alt konu bulunamadı" });
    }
    return {
      subtopicId: sub.id,
      title: sub.title,
      topicId: sub.topic.id,
      topicTitle: sub.topic.title,
      kind,
      cards: sub.cards,
    };
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
