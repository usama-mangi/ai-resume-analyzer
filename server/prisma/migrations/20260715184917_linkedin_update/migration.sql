-- CreateTable
CREATE TABLE "InterviewPrep" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "applicationId" TEXT,
    "companyName" TEXT NOT NULL,
    "roleTitle" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewPrep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MockInterviewSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "applicationId" TEXT,
    "roleTitle" TEXT NOT NULL,
    "company" TEXT,
    "messages" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "overallFeedback" JSONB,
    "topicsCovered" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "totalQuestions" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MockInterviewSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BehavioralBank" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "applicationId" TEXT,
    "roleTitle" TEXT NOT NULL,
    "competencies" TEXT[],
    "questions" JSONB NOT NULL,
    "preparationTips" TEXT[],
    "summary" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BehavioralBank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnicalPractice" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "applicationId" TEXT,
    "roleTitle" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TechnicalPractice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewSchedule" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "applicationId" TEXT,
    "companyName" TEXT NOT NULL,
    "roleTitle" TEXT NOT NULL,
    "interviewType" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "location" TEXT,
    "meetingLink" TEXT,
    "interviewerNames" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "prepTimeBlock" INTEGER,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "reminders" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InterviewPrep_userId_type_idx" ON "InterviewPrep"("userId", "type");

-- CreateIndex
CREATE INDEX "InterviewPrep_userId_companyName_idx" ON "InterviewPrep"("userId", "companyName");

-- CreateIndex
CREATE INDEX "MockInterviewSession_userId_idx" ON "MockInterviewSession"("userId");

-- CreateIndex
CREATE INDEX "MockInterviewSession_userId_status_idx" ON "MockInterviewSession"("userId", "status");

-- CreateIndex
CREATE INDEX "BehavioralBank_userId_idx" ON "BehavioralBank"("userId");

-- CreateIndex
CREATE INDEX "TechnicalPractice_userId_idx" ON "TechnicalPractice"("userId");

-- CreateIndex
CREATE INDEX "InterviewSchedule_userId_scheduledAt_idx" ON "InterviewSchedule"("userId", "scheduledAt");

-- CreateIndex
CREATE INDEX "InterviewSchedule_userId_status_idx" ON "InterviewSchedule"("userId", "status");

-- AddForeignKey
ALTER TABLE "InterviewPrep" ADD CONSTRAINT "InterviewPrep_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MockInterviewSession" ADD CONSTRAINT "MockInterviewSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BehavioralBank" ADD CONSTRAINT "BehavioralBank_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicalPractice" ADD CONSTRAINT "TechnicalPractice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewSchedule" ADD CONSTRAINT "InterviewSchedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
