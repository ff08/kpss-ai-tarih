-- CreateEnum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ContentDatasetKind') THEN
    CREATE TYPE "ContentDatasetKind" AS ENUM ('INFORMATION', 'OPEN_QA', 'MCQ');
  END IF;
END$$;

-- AlterEnum (append PAST_EXAM_QA if missing)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    WHERE t.typname = 'ContentDatasetKind' AND e.enumlabel = 'PAST_EXAM_QA'
  ) THEN
    ALTER TYPE "ContentDatasetKind" ADD VALUE 'PAST_EXAM_QA';
  END IF;
END$$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "PastExamQaContent" (
  "id" SERIAL NOT NULL,
  "topicId" INTEGER NOT NULL,
  "subtopicId" INTEGER NOT NULL,
  "examYear" INTEGER NOT NULL,
  "source" VARCHAR(120),
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "tag" TEXT,
  "hint" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PastExamQaContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "PastExamQaContent_subtopicId_idx" ON "PastExamQaContent"("subtopicId");
CREATE INDEX IF NOT EXISTS "PastExamQaContent_topicId_idx" ON "PastExamQaContent"("topicId");
CREATE INDEX IF NOT EXISTS "PastExamQaContent_subtopicId_topicId_idx" ON "PastExamQaContent"("subtopicId", "topicId");
CREATE INDEX IF NOT EXISTS "PastExamQaContent_topicId_examYear_idx" ON "PastExamQaContent"("topicId", "examYear");

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'PastExamQaContent_topicId_fkey'
  ) THEN
    ALTER TABLE "PastExamQaContent"
      ADD CONSTRAINT "PastExamQaContent_topicId_fkey"
      FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'PastExamQaContent_subtopicId_fkey'
  ) THEN
    ALTER TABLE "PastExamQaContent"
      ADD CONSTRAINT "PastExamQaContent_subtopicId_fkey"
      FOREIGN KEY ("subtopicId") REFERENCES "Subtopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END$$;
