-- CreateTable
CREATE TABLE "CompanyResearch" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyName_normalized" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompanyResearch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompanyResearch_companyName_normalized_key" ON "CompanyResearch"("companyName_normalized");

-- CreateIndex
CREATE INDEX "CompanyResearch_companyName_normalized_idx" ON "CompanyResearch"("companyName_normalized");
