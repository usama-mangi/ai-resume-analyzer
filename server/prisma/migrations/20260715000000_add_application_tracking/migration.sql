-- AlterTable
ALTER TABLE "Resume" ADD COLUMN "applicationStatus" TEXT NOT NULL DEFAULT 'not_applied';
ALTER TABLE "Resume" ADD COLUMN "applicationNotes" TEXT;
