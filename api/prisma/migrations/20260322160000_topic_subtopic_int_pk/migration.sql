-- Topic / Subtopic ve içerik FK'leri tamsayı PK
DROP TABLE IF EXISTS "McqContent" CASCADE;
DROP TABLE IF EXISTS "OpenQaContent" CASCADE;
DROP TABLE IF EXISTS "InformationContent" CASCADE;
DROP TABLE IF EXISTS "Subtopic" CASCADE;
DROP TABLE IF EXISTS "Topic" CASCADE;

CREATE TABLE "Topic" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Subtopic" (
    "id" SERIAL NOT NULL,
    "topicId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Subtopic_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Subtopic_topicId_idx" ON "Subtopic"("topicId");

ALTER TABLE "Subtopic" ADD CONSTRAINT "Subtopic_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "InformationContent" (
    "id" SERIAL NOT NULL,
    "topicId" INTEGER NOT NULL,
    "subtopicId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tag" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InformationContent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OpenQaContent" (
    "id" SERIAL NOT NULL,
    "topicId" INTEGER NOT NULL,
    "subtopicId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tag" TEXT,
    "hint" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OpenQaContent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "McqContent" (
    "id" SERIAL NOT NULL,
    "topicId" INTEGER NOT NULL,
    "subtopicId" INTEGER NOT NULL,
    "difficulty" "QuestionDifficulty" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tag" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "McqContent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "InformationContent_subtopicId_idx" ON "InformationContent"("subtopicId");
CREATE INDEX "InformationContent_topicId_idx" ON "InformationContent"("topicId");
CREATE INDEX "InformationContent_subtopicId_topicId_idx" ON "InformationContent"("subtopicId", "topicId");

CREATE INDEX "OpenQaContent_subtopicId_idx" ON "OpenQaContent"("subtopicId");
CREATE INDEX "OpenQaContent_topicId_idx" ON "OpenQaContent"("topicId");
CREATE INDEX "OpenQaContent_subtopicId_topicId_idx" ON "OpenQaContent"("subtopicId", "topicId");

CREATE INDEX "McqContent_subtopicId_idx" ON "McqContent"("subtopicId");
CREATE INDEX "McqContent_topicId_idx" ON "McqContent"("topicId");
CREATE INDEX "McqContent_subtopicId_topicId_idx" ON "McqContent"("subtopicId", "topicId");

ALTER TABLE "InformationContent" ADD CONSTRAINT "InformationContent_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "InformationContent" ADD CONSTRAINT "InformationContent_subtopicId_fkey" FOREIGN KEY ("subtopicId") REFERENCES "Subtopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "OpenQaContent" ADD CONSTRAINT "OpenQaContent_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OpenQaContent" ADD CONSTRAINT "OpenQaContent_subtopicId_fkey" FOREIGN KEY ("subtopicId") REFERENCES "Subtopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "McqContent" ADD CONSTRAINT "McqContent_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "McqContent" ADD CONSTRAINT "McqContent_subtopicId_fkey" FOREIGN KEY ("subtopicId") REFERENCES "Subtopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
