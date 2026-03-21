-- CreateEnum
CREATE TYPE "CardKind" AS ENUM ('INFORMATION', 'OPEN_QA', 'MCQ');

-- AlterTable
ALTER TABLE "InformationCard" ADD COLUMN     "kind" "CardKind" NOT NULL DEFAULT 'INFORMATION';

-- CreateIndex
CREATE INDEX "InformationCard_subtopicId_kind_idx" ON "InformationCard"("subtopicId", "kind");
