-- CreateTable
CREATE TABLE "GeneratedCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeneratedCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GeneratedCode_code_key" ON "GeneratedCode"("code");

-- CreateIndex
CREATE INDEX "GeneratedCode_code_idx" ON "GeneratedCode"("code");
