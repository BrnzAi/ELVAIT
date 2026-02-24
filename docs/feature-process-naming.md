# Feature: Process Naming in Assessments

**Status:** Proposed  
**Requested by:** Katja Henkel (2026-02-24)  
**Applies to:** Process Readiness Scan, Full Assessment

---

## Problem

Some IT solutions or AI initiatives affect multiple business processes. Today, an assessment evaluates "the process" as a single abstract concept — there's no way to specify *which* process is being assessed. When multiple processes are impacted, users have no way to distinguish or separately evaluate them.

## Solution

Allow users to **add and name specific processes** within an assessment. Each named process gets its own set of Process Readiness questions, enabling per-process evaluation rather than a single blended score.

---

## Scope

| Variant | Process Naming | Why |
|---------|---------------|-----|
| Quick Check | ❌ No | No process lens |
| Decision Clarity | ❌ No | No process lens |
| **Full Assessment** | ✅ Yes | Includes Process Readiness lens |
| **Process Readiness Scan** | ✅ Yes | Entirely process-focused |

---

## User Flow

### During Assessment Creation (Step 2: Decision Context)

When the selected variant is **Full Assessment** or **Process Readiness Scan**, a new section appears after the existing context fields:

**"Impacted Processes"**

> _Which processes are affected by this initiative? Each process will be evaluated separately._

- A default process entry is pre-created (editable name, e.g. "Main Process")
- User can **add** additional processes via "+ Add Process" button
- Each process has:
  - **Name** (required, max 80 chars) — e.g. "Order Fulfillment", "Customer Onboarding", "Invoice Processing"
  - **Description** (optional, max 200 chars) — brief context for participants
- Minimum: 1 process (cannot remove the last one)
- Maximum: 5 processes (prevents survey fatigue)
- Processes can be **reordered** (drag or up/down arrows) and **removed** (except last)

### During Survey (Participant Experience)

For **Process Owner** participants:

- If the assessment has **1 process**: Survey works exactly as today (no change to UX)
- If the assessment has **2+ processes**: 
  - After the introductory context screen, participant sees: _"This assessment evaluates the following processes: [list]. You'll answer questions for each process separately."_
  - Process Readiness questions repeat per process, with the process name shown prominently: _"Regarding: **[Process Name]**"_
  - Each process section is clearly separated with a header and optional description
  - Progress indicator shows which process they're on (e.g. "Process 2 of 3")

For **User Representative** participants (Full Assessment only):
- Same approach — Operational Reality questions may reference specific processes
- If only 1 process, no change to UX

Other roles (Decision Owners, Business Owners, Technical Owners) are **not affected** — they answer their questions once, as today.

### Results & Scoring

- **Per-process Process Readiness Score**: Each named process gets its own score (0–100)
- **Aggregate Process Readiness Score**: Weighted average across all processes (equal weight by default)
- **Process Gate**: For Full Assessment, the gate uses the **lowest** individual process score (weakest link principle) — one broken process can still block GO
- **Results page** shows:
  - Process scores in a table/chart comparing processes side by side
  - Individual process flags and risk areas
  - Overall Process Readiness Score with note on which process scored lowest
- **Single process**: Display identical to today (no table, no comparison)

---

## Data Model Changes

### New Model: `AssessmentProcess`

```prisma
model AssessmentProcess {
  id          String       @id @default(cuid())
  caseId      String
  case        DecisionCase @relation(fields: [caseId], references: [id], onDelete: Cascade)
  
  name        String       // e.g. "Order Fulfillment" (max 80 chars)
  description String?      // Optional context (max 200 chars)
  sortOrder   Int          @default(0)
  
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  
  // Relations
  responses   SurveyResponse[]
  
  @@index([caseId])
  @@unique([caseId, sortOrder])
}
```

### Changes to Existing Models

**DecisionCase** — add relation:
```prisma
processes    AssessmentProcess[]
```

**SurveyResponse** — add optional process link:
```prisma
processId    String?
process      AssessmentProcess? @relation(fields: [processId], references: [id])
```

Responses for non-process roles (EXEC, BUSINESS_OWNER, TECH_OWNER) will have `processId = null`. Only PROCESS_OWNER and USER responses are linked to a specific process.

---

## API Changes

### `POST /api/cases` (Create Case)
- Accept optional `processes` array in request body:
  ```json
  {
    "variant": "FULL",
    "processes": [
      { "name": "Order Fulfillment", "description": "Current manual order routing" },
      { "name": "Invoice Processing" }
    ],
    ...
  }
  ```
- If no processes provided for FULL/PROCESS_STANDALONE: auto-create one default process named "Main Process"
- Validate: 1–5 processes, names unique within case, max lengths

### `GET /api/cases/[id]` (Case Detail)
- Include `processes` array in response

### `PUT /api/cases/[id]` (Update Case)
- Allow adding/editing/removing processes while case is in DRAFT status
- Lock processes after first response (same as other context fields)

### `GET /api/survey/[token]` (Survey Questions)
- For PROCESS_OWNER/USER: return questions grouped by process
- Include process metadata (name, description) for display

### `POST /api/survey/[token]` (Submit Answers)
- Accept `processId` for process-specific responses

### `GET /api/cases/[id]/results` (Results)
- Return per-process scores alongside aggregate scores

---

## UI Components

### New: `ProcessEditor` component
- Used in create flow (Step 2) and case edit
- List of process name/description inputs
- Add/remove/reorder controls
- Validation (at least 1, max 5, unique names)

### Modified: Survey flow
- Process section headers with name + description
- Progress indicator per process
- Clear visual separation between processes

### Modified: Results page
- Per-process score cards or comparison table
- Process-level flags
- Lowest-scoring process highlighted

---

## Migration Path

- Existing assessments have no processes → treated as single unnamed process (backward compatible)
- No data migration needed — `processId` is nullable
- Scoring logic falls back gracefully when no `AssessmentProcess` records exist

---

## Effort Estimate

| Component | Complexity |
|-----------|-----------|
| Schema + migration | Small |
| Create flow UI (ProcessEditor) | Medium |
| API changes (CRUD + validation) | Medium |
| Survey flow (per-process questions) | Medium-Large |
| Scoring (per-process + aggregate) | Medium |
| Results display | Medium |
| Tests | Medium |
| **Total** | **~2-3 days** |

---

## Open Questions

1. **Weight distribution**: Should all processes be equally weighted, or should users assign importance weights?
2. **Process-specific participants**: Should different Process Owners be assignable to different processes, or does one Process Owner evaluate all processes?
3. **PDF reports**: Should per-process breakdown appear in exported reports?
4. **Process templates**: Should we offer common process name suggestions (e.g. "Order-to-Cash", "Hire-to-Retire")?
