-- CreateEnum
CREATE TYPE "ContentDatasetKind" AS ENUM ('INFORMATION', 'OPEN_QA', 'MCQ');

-- CreateEnum
CREATE TYPE "ContentIssueCategory" AS ENUM ('WRONG_INFO', 'CONFLICTING_INFO', 'MISSING_INFO');

-- CreateEnum
CREATE TYPE "ContentIssueStatus" AS ENUM ('OPEN', 'REVIEWED', 'FIXED', 'IGNORED');

-- CreateTable
CREATE TABLE "ContentIssueReport" (
    "id" SERIAL NOT NULL,
    "topicId" INTEGER NOT NULL,
    "subtopicId" INTEGER NOT NULL,
    "datasetKind" "ContentDatasetKind" NOT NULL,
    "contentRowId" INTEGER NOT NULL,
    "category" "ContentIssueCategory" NOT NULL,
    "note" TEXT,
    "topicTitleSnapshot" TEXT,
    "subtopicTitleSnapshot" TEXT,
    "cardTitleSnapshot" VARCHAR(512),
    "status" "ContentIssueStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentIssueReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContentIssueReport_topicId_idx" ON "ContentIssueReport"("topicId");

-- CreateIndex
CREATE INDEX "ContentIssueReport_subtopicId_idx" ON "ContentIssueReport"("subtopicId");

-- CreateIndex
CREATE INDEX "ContentIssueReport_datasetKind_contentRowId_idx" ON "ContentIssueReport"("datasetKind", "contentRowId");

-- CreateIndex
CREATE INDEX "ContentIssueReport_status_createdAt_idx" ON "ContentIssueReport"("status", "createdAt");

-- CreateIndex
CREATE INDEX "ContentIssueReport_createdAt_idx" ON "ContentIssueReport"("createdAt");

-- AddForeignKey
ALTER TABLE "ContentIssueReport" ADD CONSTRAINT "ContentIssueReport_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentIssueReport" ADD CONSTRAINT "ContentIssueReport_subtopicId_fkey" FOREIGN KEY ("subtopicId") REFERENCES "Subtopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
