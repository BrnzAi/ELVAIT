-- AlterTable
ALTER TABLE "User" ADD COLUMN "tier" TEXT NOT NULL DEFAULT 'free';
ALTER TABLE "User" ADD COLUMN "company" TEXT;

-- CreateIndex
CREATE INDEX "User_tier_idx" ON "User"("tier");
