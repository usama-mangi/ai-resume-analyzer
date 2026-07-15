-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "tailoredResumeResult" JSONB;

-- CreateTable
CREATE TABLE "TailoredResume" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "baseResumeId" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "jobDescription" TEXT,
    "tailoredContent" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TailoredResume_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TailoredResume_userId_baseResumeId_idx" ON "TailoredResume"("userId", "baseResumeId");

-- CreateIndex
CREATE INDEX "TailoredResume_userId_isPrimary_idx" ON "TailoredResume"("userId", "isPrimary");

-- AddForeignKey
ALTER TABLE "TailoredResume" ADD CONSTRAINT "TailoredResume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TailoredResume" ADD CONSTRAINT "TailoredResume_baseResumeId_fkey" FOREIGN KEY ("baseResumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;
