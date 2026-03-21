-- CreateEnum
CREATE TYPE "QuestionDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- AlterTable
ALTER TABLE "InformationCard" ADD COLUMN     "difficulty" "QuestionDifficulty";
