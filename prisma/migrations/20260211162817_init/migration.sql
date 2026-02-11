-- CreateTable
CREATE TABLE "DecisionCase" (
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
    "createdBy" TEXT
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "token" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'INVITED',
    "invitedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" DATETIME,
    "completedAt" DATETIME,
    CONSTRAINT "Participant_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "DecisionCase" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SurveyResponse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answerType" TEXT NOT NULL,
    "rawValue" TEXT NOT NULL,
    "adjustedValue" INTEGER,
    "score0100" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SurveyResponse_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "DecisionCase" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SurveyResponse_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CaseSummary" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseId" TEXT NOT NULL,
    "ics" REAL,
    "recommendation" TEXT,
    "dimScores" TEXT NOT NULL,
    "roleDimScores" TEXT NOT NULL,
    "flags" TEXT NOT NULL,
    "gates" TEXT NOT NULL,
    "topMismatches" TEXT NOT NULL,
    "aiSummary" TEXT,
    "blindSpots" TEXT NOT NULL,
    "checklistItems" TEXT NOT NULL,
    "processScore" REAL,
    "processReadiness" TEXT,
    "generatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CaseSummary_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "DecisionCase" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DecisionPatternRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kitVariant" TEXT NOT NULL,
    "investmentType" TEXT NOT NULL,
    "icsBucket" TEXT NOT NULL,
    "topFlags" TEXT NOT NULL,
    "roleMismatchSignatures" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,
    "recordedMonth" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "OpenTextClassification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "confidence" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "DecisionCase_status_idx" ON "DecisionCase"("status");

-- CreateIndex
CREATE INDEX "DecisionCase_createdAt_idx" ON "DecisionCase"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_token_key" ON "Participant"("token");

-- CreateIndex
CREATE INDEX "Participant_caseId_idx" ON "Participant"("caseId");

-- CreateIndex
CREATE INDEX "Participant_token_idx" ON "Participant"("token");

-- CreateIndex
CREATE INDEX "Participant_role_idx" ON "Participant"("role");

-- CreateIndex
CREATE INDEX "SurveyResponse_caseId_idx" ON "SurveyResponse"("caseId");

-- CreateIndex
CREATE INDEX "SurveyResponse_participantId_idx" ON "SurveyResponse"("participantId");

-- CreateIndex
CREATE INDEX "SurveyResponse_questionId_idx" ON "SurveyResponse"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "SurveyResponse_participantId_questionId_key" ON "SurveyResponse"("participantId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "CaseSummary_caseId_key" ON "CaseSummary"("caseId");

-- CreateIndex
CREATE INDEX "CaseSummary_recommendation_idx" ON "CaseSummary"("recommendation");

-- CreateIndex
CREATE INDEX "DecisionPatternRecord_kitVariant_idx" ON "DecisionPatternRecord"("kitVariant");

-- CreateIndex
CREATE INDEX "DecisionPatternRecord_recommendation_idx" ON "DecisionPatternRecord"("recommendation");

-- CreateIndex
CREATE INDEX "DecisionPatternRecord_recordedMonth_idx" ON "DecisionPatternRecord"("recordedMonth");

-- CreateIndex
CREATE INDEX "OpenTextClassification_caseId_idx" ON "OpenTextClassification"("caseId");

-- CreateIndex
CREATE INDEX "OpenTextClassification_category_idx" ON "OpenTextClassification"("category");

-- CreateIndex
CREATE UNIQUE INDEX "OpenTextClassification_participantId_questionId_key" ON "OpenTextClassification"("participantId", "questionId");
