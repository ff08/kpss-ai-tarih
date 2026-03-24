-- Remove copyrighted past-exam dataset and move to word-game capable enum.
DELETE FROM "ContentIssueReport" WHERE "datasetKind" = 'PAST_EXAM_QA';

DROP TABLE IF EXISTS "PastExamQaContent";

CREATE TYPE "ContentDatasetKind_new" AS ENUM ('INFORMATION', 'OPEN_QA', 'MCQ', 'WORD_GAME');

ALTER TABLE "ContentIssueReport"
ALTER COLUMN "datasetKind" TYPE "ContentDatasetKind_new"
USING ("datasetKind"::text::"ContentDatasetKind_new");

DROP TYPE "ContentDatasetKind";
ALTER TYPE "ContentDatasetKind_new" RENAME TO "ContentDatasetKind";
