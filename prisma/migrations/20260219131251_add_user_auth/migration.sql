-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DecisionCase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "variant" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "decisionTitle" TEXT NOT NULL,
    "investmentType" TEXT NOT NULL,
    "decisionDescription" TEXT NOT NULL,
    "impactedAreas" TEXT NOT NULL,
    "timeHorizon" TEXT NOT NULL,
    "estimatedInvestment" TEXT,
    "dCtx1" TEXT,
    "dCtx2" TEXT,
    "dCtx3" TEXT,
    "dCtx4" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "firstResponseAt" DATETIME,
    "completedAt" DATETIME,
    "createdBy" TEXT,
    "userId" TEXT,
    CONSTRAINT "DecisionCase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_DecisionCase" ("completedAt", "createdAt", "createdBy", "dCtx1", "dCtx2", "dCtx3", "dCtx4", "decisionDescription", "decisionTitle", "estimatedInvestment", "firstResponseAt", "id", "impactedAreas", "investmentType", "status", "timeHorizon", "updatedAt", "variant") SELECT "completedAt", "createdAt", "createdBy", "dCtx1", "dCtx2", "dCtx3", "dCtx4", "decisionDescription", "decisionTitle", "estimatedInvestment", "firstResponseAt", "id", "impactedAreas", "investmentType", "status", "timeHorizon", "updatedAt", "variant" FROM "DecisionCase";
DROP TABLE "DecisionCase";
ALTER TABLE "new_DecisionCase" RENAME TO "DecisionCase";
CREATE INDEX "DecisionCase_status_idx" ON "DecisionCase"("status");
CREATE INDEX "DecisionCase_createdAt_idx" ON "DecisionCase"("createdAt");
CREATE INDEX "DecisionCase_userId_idx" ON "DecisionCase"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE INDEX "PasswordResetToken_email_idx" ON "PasswordResetToken"("email");
