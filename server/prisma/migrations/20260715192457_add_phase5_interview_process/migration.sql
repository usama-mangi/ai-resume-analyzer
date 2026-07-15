-- CreateTable
CREATE TABLE "InterviewNote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "applicationId" TEXT,
    "scheduleId" TEXT,
    "companyName" TEXT NOT NULL,
    "roleTitle" TEXT NOT NULL,
    "interviewType" TEXT NOT NULL,
    "roundNumber" INTEGER NOT NULL DEFAULT 1,
    "questionsAsked" JSONB NOT NULL,
    "selfRating" INTEGER NOT NULL,
    "strengths" TEXT[],
    "weaknesses" TEXT[],
    "followUpItems" TEXT[],
    "generalNotes" TEXT,
    "interviewDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewerFeedback" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "interviewNoteId" TEXT NOT NULL,
    "interviewerName" TEXT NOT NULL,
    "interviewerRole" TEXT,
    "rating" INTEGER NOT NULL,
    "feedbackText" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,
    "strengths" TEXT[],
    "concerns" TEXT[],
    "sharedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewerFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FollowUpEmail" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "applicationId" TEXT,
    "interviewNoteId" TEXT,
    "type" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FollowUpEmail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PanelInterview" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "applicationId" TEXT,
    "companyName" TEXT NOT NULL,
    "roleTitle" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "location" TEXT,
    "meetingLink" TEXT,
    "interviewers" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PanelInterview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseStudy" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "applicationId" TEXT,
    "companyName" TEXT NOT NULL,
    "roleTitle" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "slides" JSONB NOT NULL,
    "aiAssisted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaseStudy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InterviewNote_userId_interviewDate_idx" ON "InterviewNote"("userId", "interviewDate");

-- CreateIndex
CREATE INDEX "InterviewNote_userId_companyName_idx" ON "InterviewNote"("userId", "companyName");

-- CreateIndex
CREATE INDEX "InterviewerFeedback_interviewNoteId_idx" ON "InterviewerFeedback"("interviewNoteId");

-- CreateIndex
CREATE INDEX "InterviewerFeedback_userId_idx" ON "InterviewerFeedback"("userId");

-- CreateIndex
CREATE INDEX "FollowUpEmail_userId_type_idx" ON "FollowUpEmail"("userId", "type");

-- CreateIndex
CREATE INDEX "FollowUpEmail_interviewNoteId_idx" ON "FollowUpEmail"("interviewNoteId");

-- CreateIndex
CREATE INDEX "PanelInterview_userId_scheduledAt_idx" ON "PanelInterview"("userId", "scheduledAt");

-- CreateIndex
CREATE INDEX "PanelInterview_userId_status_idx" ON "PanelInterview"("userId", "status");

-- CreateIndex
CREATE INDEX "CaseStudy_userId_companyName_idx" ON "CaseStudy"("userId", "companyName");

-- AddForeignKey
ALTER TABLE "InterviewNote" ADD CONSTRAINT "InterviewNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewerFeedback" ADD CONSTRAINT "InterviewerFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewerFeedback" ADD CONSTRAINT "InterviewerFeedback_interviewNoteId_fkey" FOREIGN KEY ("interviewNoteId") REFERENCES "InterviewNote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUpEmail" ADD CONSTRAINT "FollowUpEmail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUpEmail" ADD CONSTRAINT "FollowUpEmail_interviewNoteId_fkey" FOREIGN KEY ("interviewNoteId") REFERENCES "InterviewNote"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PanelInterview" ADD CONSTRAINT "PanelInterview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseStudy" ADD CONSTRAINT "CaseStudy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
