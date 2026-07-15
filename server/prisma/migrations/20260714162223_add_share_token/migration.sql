-- AlterTable
ALTER TABLE "Resume" ADD COLUMN "shareToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Resume_shareToken_key" ON "Resume"("shareToken");
