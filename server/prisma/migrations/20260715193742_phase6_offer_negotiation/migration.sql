-- CreateTable
CREATE TABLE "OfferComparison" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "offers" JSONB NOT NULL,
    "weights" JSONB NOT NULL,
    "scores" JSONB NOT NULL,
    "recommendation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OfferComparison_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NegotiationCoach" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "applicationId" TEXT,
    "companyName" TEXT NOT NULL,
    "roleTitle" TEXT NOT NULL,
    "offerDetails" JSONB NOT NULL,
    "marketData" JSONB,
    "strategy" JSONB,
    "emailTemplates" JSONB,
    "scripts" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NegotiationCoach_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfferDecision" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "criteria" JSONB NOT NULL,
    "offers" JSONB NOT NULL,
    "scores" JSONB NOT NULL,
    "recommendation" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OfferDecision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResignationLetter" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "roleTitle" TEXT NOT NULL,
    "managerName" TEXT,
    "lastDay" TEXT,
    "reason" TEXT,
    "tone" TEXT,
    "letterContent" TEXT NOT NULL,
    "transitionPlan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResignationLetter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OfferComparison_userId_idx" ON "OfferComparison"("userId");

-- CreateIndex
CREATE INDEX "NegotiationCoach_userId_idx" ON "NegotiationCoach"("userId");

-- CreateIndex
CREATE INDEX "OfferDecision_userId_idx" ON "OfferDecision"("userId");

-- CreateIndex
CREATE INDEX "ResignationLetter_userId_idx" ON "ResignationLetter"("userId");

-- AddForeignKey
ALTER TABLE "OfferComparison" ADD CONSTRAINT "OfferComparison_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NegotiationCoach" ADD CONSTRAINT "NegotiationCoach_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferDecision" ADD CONSTRAINT "OfferDecision_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResignationLetter" ADD CONSTRAINT "ResignationLetter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
