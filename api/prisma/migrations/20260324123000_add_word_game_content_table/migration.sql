CREATE TABLE "WordGameContent" (
  "id" SERIAL NOT NULL,
  "topicId" INTEGER NOT NULL,
  "subtopicId" INTEGER NOT NULL,
  "question" TEXT NOT NULL,
  "answer" TEXT NOT NULL,
  "hint" TEXT,
  "tag" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "WordGameContent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "WordGameContent_subtopicId_idx" ON "WordGameContent"("subtopicId");
CREATE INDEX "WordGameContent_topicId_idx" ON "WordGameContent"("topicId");
CREATE INDEX "WordGameContent_subtopicId_topicId_idx" ON "WordGameContent"("subtopicId", "topicId");

ALTER TABLE "WordGameContent"
ADD CONSTRAINT "WordGameContent_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WordGameContent"
ADD CONSTRAINT "WordGameContent_subtopicId_fkey" FOREIGN KEY ("subtopicId") REFERENCES "Subtopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
