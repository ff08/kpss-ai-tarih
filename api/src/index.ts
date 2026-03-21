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
      select: { id: true, title: true, sortOrder: true },
    });
    return { topics };
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
          select: { id: true, kind: true, title: true, content: true, tag: true },
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
