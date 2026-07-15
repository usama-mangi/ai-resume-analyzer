-- CreateTable
CREATE TABLE "OnboardingPlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "applicationId" TEXT,
    "companyName" TEXT NOT NULL,
    "roleTitle" TEXT NOT NULL,
    "startDate" TEXT,
    "planType" TEXT NOT NULL,
    "milestones" JSONB NOT NULL,
    "learningGoals" JSONB NOT NULL,
    "stakeholders" JSONB NOT NULL,
    "summary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnboardingPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OnboardingChecklist" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "applicationId" TEXT,
    "companyName" TEXT NOT NULL,
    "roleTitle" TEXT NOT NULL,
    "startDate" TEXT,
    "categories" JSONB NOT NULL,
    "completedCount" INTEGER NOT NULL DEFAULT 0,
    "totalCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnboardingChecklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManagerAlignment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "applicationId" TEXT,
    "companyName" TEXT NOT NULL,
    "roleTitle" TEXT NOT NULL,
    "managerName" TEXT,
    "successMetrics" JSONB NOT NULL,
    "communicationStyle" JSONB NOT NULL,
    "meetingCadence" JSONB NOT NULL,
    "expectations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ManagerAlignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NetworkMap" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "applicationId" TEXT,
    "companyName" TEXT NOT NULL,
    "roleTitle" TEXT NOT NULL,
    "contacts" JSONB NOT NULL,
    "coffeeChats" JSONB NOT NULL,
    "relationshipMap" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NetworkMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillRefresh" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "applicationId" TEXT,
    "companyName" TEXT NOT NULL,
    "roleTitle" TEXT NOT NULL,
    "techStack" TEXT[],
    "recommendations" JSONB NOT NULL,
    "learningPath" JSONB NOT NULL,
    "estimatedHours" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkillRefresh_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "First90DaysTracker" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "applicationId" TEXT,
    "companyName" TEXT NOT NULL,
    "roleTitle" TEXT NOT NULL,
    "startDate" TEXT,
    "milestones" JSONB NOT NULL,
    "feedbackLoops" JSONB NOT NULL,
    "earlyWins" JSONB NOT NULL,
    "currentPhase" TEXT NOT NULL,
    "overallProgress" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "First90DaysTracker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OnboardingPlan_userId_idx" ON "OnboardingPlan"("userId");

-- CreateIndex
CREATE INDEX "OnboardingChecklist_userId_idx" ON "OnboardingChecklist"("userId");

-- CreateIndex
CREATE INDEX "ManagerAlignment_userId_idx" ON "ManagerAlignment"("userId");

-- CreateIndex
CREATE INDEX "NetworkMap_userId_idx" ON "NetworkMap"("userId");

-- CreateIndex
CREATE INDEX "SkillRefresh_userId_idx" ON "SkillRefresh"("userId");

-- CreateIndex
CREATE INDEX "First90DaysTracker_userId_idx" ON "First90DaysTracker"("userId");

-- AddForeignKey
ALTER TABLE "OnboardingPlan" ADD CONSTRAINT "OnboardingPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnboardingChecklist" ADD CONSTRAINT "OnboardingChecklist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManagerAlignment" ADD CONSTRAINT "ManagerAlignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetworkMap" ADD CONSTRAINT "NetworkMap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillRefresh" ADD CONSTRAINT "SkillRefresh_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "First90DaysTracker" ADD CONSTRAINT "First90DaysTracker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
