-- CreateTable: bilgi kartları
CREATE TABLE "InformationContent" (
    "id" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "subtopicId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tag" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InformationContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable: soru-cevap
CREATE TABLE "OpenQaContent" (
    "id" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "subtopicId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tag" TEXT,
    "hint" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OpenQaContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable: çoktan seçmeli
CREATE TABLE "McqContent" (
    "id" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "subtopicId" TEXT NOT NULL,
    "difficulty" "QuestionDifficulty" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tag" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "McqContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InformationContent_subtopicId_idx" ON "InformationContent"("subtopicId");
CREATE INDEX "InformationContent_topicId_idx" ON "InformationContent"("topicId");
CREATE INDEX "InformationContent_subtopicId_topicId_idx" ON "InformationContent"("subtopicId", "topicId");

CREATE INDEX "OpenQaContent_subtopicId_idx" ON "OpenQaContent"("subtopicId");
CREATE INDEX "OpenQaContent_topicId_idx" ON "OpenQaContent"("topicId");
CREATE INDEX "OpenQaContent_subtopicId_topicId_idx" ON "OpenQaContent"("subtopicId", "topicId");

CREATE INDEX "McqContent_subtopicId_idx" ON "McqContent"("subtopicId");
CREATE INDEX "McqContent_topicId_idx" ON "McqContent"("topicId");
CREATE INDEX "McqContent_subtopicId_topicId_idx" ON "McqContent"("subtopicId", "topicId");

-- AddForeignKey
ALTER TABLE "InformationContent" ADD CONSTRAINT "InformationContent_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "InformationContent" ADD CONSTRAINT "InformationContent_subtopicId_fkey" FOREIGN KEY ("subtopicId") REFERENCES "Subtopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "OpenQaContent" ADD CONSTRAINT "OpenQaContent_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OpenQaContent" ADD CONSTRAINT "OpenQaContent_subtopicId_fkey" FOREIGN KEY ("subtopicId") REFERENCES "Subtopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "McqContent" ADD CONSTRAINT "McqContent_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "McqContent" ADD CONSTRAINT "McqContent_subtopicId_fkey" FOREIGN KEY ("subtopicId") REFERENCES "Subtopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Veriyi mevcut InformationCard tablosundan taşı (topicId = Subtopic üzerinden)
INSERT INTO "InformationContent" ("id", "topicId", "subtopicId", "title", "content", "tag", "createdAt")
SELECT ic."id", s."topicId", ic."subtopicId", ic."title", ic."content", ic."tag", ic."createdAt"
FROM "InformationCard" ic
INNER JOIN "Subtopic" s ON s."id" = ic."subtopicId"
WHERE ic."kind" = 'INFORMATION';

INSERT INTO "OpenQaContent" ("id", "topicId", "subtopicId", "title", "content", "tag", "hint", "createdAt")
SELECT ic."id", s."topicId", ic."subtopicId", ic."title", ic."content", ic."tag", ic."hint", ic."createdAt"
FROM "InformationCard" ic
INNER JOIN "Subtopic" s ON s."id" = ic."subtopicId"
WHERE ic."kind" = 'OPEN_QA';

INSERT INTO "McqContent" ("id", "topicId", "subtopicId", "difficulty", "title", "content", "tag", "createdAt")
SELECT ic."id", s."topicId", ic."subtopicId", COALESCE(ic."difficulty", 'MEDIUM'::"QuestionDifficulty"), ic."title", ic."content", ic."tag", ic."createdAt"
FROM "InformationCard" ic
INNER JOIN "Subtopic" s ON s."id" = ic."subtopicId"
WHERE ic."kind" = 'MCQ';

-- Eski tablo ve enum
DROP INDEX IF EXISTS "InformationCard_subtopicId_kind_idx";
DROP TABLE "InformationCard";
DROP TYPE "CardKind";
