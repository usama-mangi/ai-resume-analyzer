-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT,
    "logoUrl" TEXT,
    "description" TEXT,
    "website" TEXT,
    "industry" TEXT,
    "size" TEXT,
    "foundedYear" INTEGER,
    "headquarters" TEXT,
    "glassdoorRating" DOUBLE PRECISION,
    "glassdoorReviewCount" INTEGER,
    "glassdoorPros" TEXT[],
    "glassdoorCons" TEXT[],
    "glassdoorCeoRating" DOUBLE PRECISION,
    "glassdoorRecommendToFriend" DOUBLE PRECISION,
    "ticker" TEXT,
    "marketCap" DOUBLE PRECISION,
    "revenue" DOUBLE PRECISION,
    "employeesCount" INTEGER,
    "interviewDifficulty" DOUBLE PRECISION,
    "interviewProcess" TEXT[],
    "commonQuestions" TEXT[],
    "recentNews" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationDeadline" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobId" TEXT,
    "companyName" TEXT NOT NULL,
    "roleTitle" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "reminderAt" TIMESTAMP(3),
    "reminderSent" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'upcoming',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApplicationDeadline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobApplication" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobId" TEXT,
    "companyName" TEXT NOT NULL,
    "roleTitle" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "appliedAt" TIMESTAMP(3),
    "resumeId" TEXT,
    "coverLetterId" TEXT,
    "referralContact" TEXT,
    "notes" TEXT,
    "nextSteps" TEXT,
    "nextActionAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");

-- CreateIndex
CREATE INDEX "Company_name_idx" ON "Company"("name");

-- CreateIndex
CREATE INDEX "Company_industry_idx" ON "Company"("industry");

-- CreateIndex
CREATE INDEX "ApplicationDeadline_userId_deadline_idx" ON "ApplicationDeadline"("userId", "deadline");

-- CreateIndex
CREATE INDEX "ApplicationDeadline_userId_status_idx" ON "ApplicationDeadline"("userId", "status");

-- CreateIndex
CREATE INDEX "JobApplication_userId_status_idx" ON "JobApplication"("userId", "status");

-- CreateIndex
CREATE INDEX "JobApplication_userId_appliedAt_idx" ON "JobApplication"("userId", "appliedAt");

-- AddForeignKey
ALTER TABLE "ApplicationDeadline" ADD CONSTRAINT "ApplicationDeadline_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationDeadline" ADD CONSTRAINT "ApplicationDeadline_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;
