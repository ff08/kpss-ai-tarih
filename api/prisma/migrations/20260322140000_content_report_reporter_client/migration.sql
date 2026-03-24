-- AlterTable
ALTER TABLE "ContentIssueReport" ADD COLUMN IF NOT EXISTS "reporterClientId" TEXT;

-- CreateIndex (aynı istemci + aynı kart için tek bildirim)
CREATE UNIQUE INDEX IF NOT EXISTS "ContentIssueReport_reporterClientId_subtopicId_datasetKind_contentRowId_key" ON "ContentIssueReport"("reporterClientId", "subtopicId", "datasetKind", "contentRowId");
