# ELVAIT - Product Requirements Document

**Product Name:** Clarity Before Automation Kit  
**Version:** 2.4  
**Last Updated:** 2026-07-07  
**Status:** Production  
**URL:** https://elvait.ai

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.4 | 2026-07-07 | Synchronized Markdown PRD with implemented v2.x product state; corrected PostgreSQL/Cloud Run deployment, auth, tiers, results gate, PDF export, case claim, and process naming details. |
| 2.3 | 2026-02-24 | Process Naming feature, updated assessment type descriptions and roles, Process Check renamed to Process Readiness Scan. |
| 2.2 | 2026-02-24 | Custom roles feature, pricing updates, SMTP fix. |
| 2.1 | 2026-02-23 | New pricing structure, Results Gate tiers, email verification requirement. |
| 2.0 | 2026-02-20 | Results Gate, tiered access, case limits, admin panel. |
| 1.1 | 2026-02-19 | User authentication, sign up/in, email verification, password reset. |
| 1.0 | 2026-02-12 | Initial production release: assessment workflow, scoring engine, demo system. |

---

## 1. Executive Summary

ELVAIT is a multi-role survey platform that collects stakeholder input on AI, automation, software, and consultancy investments. It applies deterministic scoring, Thinking Maturity flag detection, gate rules, and tiered result visibility to produce rule-based GO/CLARIFY/NO_GO recommendations.

**Core principle:** AI may summarize or explain, but AI never decides the outcome. Final recommendations are always rule-derived from stakeholder responses, scoring thresholds, flags, and gates.

Key capabilities:

- Multi-stakeholder assessments across executive, business, technical, process, and user roles.
- Investment Clarity Score (ICS), a deterministic 0-100 score across five weighted dimensions.
- Eight Thinking Maturity flags (TM-1 to TM-8) for contradictions, overconfidence, mismatch, ownership diffusion, and risk signals.
- Results Gate with tiered content visibility for anonymous, free, and paid users.
- Email/password authentication with required email verification.
- Subscription tiers and admin tier management.
- Multi-process assessment support for Full Assessment and Process Readiness Scan.
- PDF report export for eligible paid tiers.

---

## 2. Problem Statement

Organizations making AI and automation investment decisions often suffer from:

- Lack of stakeholder alignment between decision owners, business owners, technical owners, process owners, and users.
- Unclear decision criteria that lead to premature commitment or analysis paralysis.
- Overconfidence in technical solutions without process readiness.
- Hidden risks and blind spots that surface after budget and reputation are already committed.
- Political cover-seeking where weak initiatives continue because no one has an objective stop signal.

ELVAIT creates structured clarity before committing resources.

---

## 3. Target Users

### 3.1 Personas

| Role | Description | Survey Focus |
|------|-------------|--------------|
| Executive / Decision Owner | C-suite, budget owner, strategic sponsor | Strategic alignment, decision intent, ROI expectations |
| Business Owner | Process/domain owner | Business value, change readiness, operating impact |
| Technical Owner | IT lead, architect, engineering owner | Technical feasibility, integration, delivery risk |
| Process Owner | Operations/process manager | Process maturity, documentation, automation readiness |
| Functional User / User Representative | End user or operational user | Day-to-day impact, adoption concerns, operational reality |

### 3.2 Assessment Initiator

The initiator creates the assessment, defines the decision context, invites participants, manages process scope, and reviews results. Typical initiators include project managers, transformation leads, consultants, founders, and internal AI/automation program owners.

---

## 4. Subscription Tiers

| Tier | Price | Assessments | Respondents | Access |
|------|-------|-------------|-------------|--------|
| Free | EUR 0 | 1 | 10 | Quick Check/basic verdict only |
| Try Out | EUR 199 / 3 months | 1 | 50 | Full Standard, full results, PDF, credit toward Core |
| Core | EUR 1,900 / year | Up to 10 | 150 per assessment | Full results, contradiction detection, PDF reports |
| Advanced | EUR 3,500 / year | Up to 20 | 250 per assessment | Flexible questions, limited custom roles, AI clarity narrative, cross-case analytics |
| Enterprise | Custom | Unlimited | Unlimited | API access, custom branding, full customization, portfolio/governance view |

Tier rules are implemented in `src/lib/tiers.ts`. The user tier is stored on `User.tier` with default `free`. Case limits are enforced when authenticated users create cases. Admin users can update tiers through `/admin/users` and `/api/admin/users`.

---

## 5. Kit Variants

| Variant | Internal Code | Roles | Duration | Use Case |
|---------|---------------|-------|----------|----------|
| Quick Check | `QUICK_CHECK` | Executive / Decision Owner | 15 min | Rapid strategic signal before involving wider stakeholders |
| Decision Clarity / Core | `CORE` | Executive + Business + Technical | 45 min | Cross-functional investment-grade assessment |
| Full Assessment | `FULL` | Executive + Business + Technical + Process + User | 60+ min | 360-degree clarity assessment with process and operational reality |
| Process Readiness Scan | `PROCESS_STANDALONE` | Process Owner | 20 min | Focused process maturity/readiness audit |

### 5.1 Process Naming Scope

Process naming is available only for:

- Full Assessment (`FULL`)
- Process Readiness Scan (`PROCESS_STANDALONE`)

Unsupported variants ignore process configuration.

---

## 6. Functional Requirements

### 6.1 Assessment Creation

**FR-001:** Initiator can create an assessment with:

- Decision title, max 120 characters.
- Investment type: AI solution/automation, software/digital tool, external consultancy/system integrator.
- Decision description, max 500 characters.
- Impacted areas: IT/Technology, Operations, Finance, HR/People, Sales, Marketing, Customer Service, Legal/Compliance, Executive/Strategy.
- Time horizon: Immediate, 3-6 months, greater than 6 months.
- Estimated investment, optional.
- Decision framing fields D-CTX-1 through D-CTX-4.
- Optional processes for process-enabled variants.

**FR-002:** Kit variant determines required roles, question set, and process support.

**FR-003:** Decision title and variant are immutable after the first participant response.

**FR-004:** Authenticated case creation enforces tier-based assessment limits.

**FR-005:** Cases can be anonymous initially and later linked to an authenticated account through the claim flow.

### 6.2 Participant Management

**FR-010:** Initiator can add participants by role with optional name and email.

**FR-011:** Each participant receives a unique tokenized survey URL.

**FR-012:** Participant status tracking supports `INVITED`, `IN_PROGRESS`, and `COMPLETED`.

**FR-013:** Process Owner and User participants can be assigned to one or more named processes when process naming is enabled.

### 6.3 Survey Experience

**FR-020:** Participants see decision context before questions.

**FR-021:** Questions are displayed by role-specific set and kit variant.

**FR-022:** Supported answer types are Likert 1-5, single-select, multi-select, and open text.

**FR-023:** Progress is saved and participants can resume.

**FR-024:** Participants never see ICS scores, flags, weights, TM codes, recommendations, or other participants' answers.

**FR-025:** For multi-process assignments, process-readiness questions repeat per assigned process and show the active process name.

### 6.4 Results Dashboard

**FR-030:** Results are visible to the initiator and authenticated users with access.

**FR-031:** Dashboard displays:

- Recommendation and ICS.
- Dimension breakdown.
- Role dimension breakdown.
- Triggered flags with evidence.
- Gates.
- Blind spots.
- Action checklist.
- Role mismatch/contradiction signals.
- Process breakdown for process-enabled cases.

**FR-032:** Anonymous users see Tier 0 result preview and locked overlays for gated detail.

**FR-033:** PDF download is available only for tiers that allow `canDownloadPDF`.

---

## 7. Authentication and Account Flows

Authentication uses NextAuth v5 credentials with email/password.

| Flow | Route / Endpoint | Requirement |
|------|------------------|-------------|
| Sign up | `/signup`, `POST /api/auth/signup` | Create account and send verification email |
| Verify email | `/verify-email`, `POST /api/auth/verify-email` | Set `emailVerified`; required before sign-in |
| Sign in | `/signin`, NextAuth handler | Reject unverified email with `EMAIL_NOT_VERIFIED` |
| Forgot password | `/forgot-password`, `POST /api/auth/forgot-password` | Send reset token |
| Reset password | `/reset-password`, `POST /api/auth/reset-password` | Set new password with token |
| Claim case | `POST /api/cases/claim` | Link anonymous case to signed-in user |

Password requirements:

- Minimum 8 characters.
- At least one uppercase letter.
- At least one lowercase letter.
- At least one number.

---

## 8. Results Gate

The Results Gate converts anonymous assessment completion into account creation and paid-plan interest by progressively revealing result content.

| Content | Anonymous | Free | Try Out+ |
|---------|-----------|------|----------|
| Verdict | Visible | Visible | Visible |
| ICS | Visible | Visible | Visible |
| Top flags | First 2 | First 2/basic | All |
| Generic summary | Visible | Visible | Visible |
| Role breakdown | Locked | Locked/basic according to tier rules | Visible |
| All flags | Locked | Locked/basic according to tier rules | Visible |
| Contradiction map | Locked | Locked/basic according to tier rules | Visible |
| Save/claim case | Requires account | Visible | Visible |
| PDF download | Locked | Locked | Visible |

Locked content uses `LockedOverlay` with blurred content and an unlock modal. Tier access is computed by `getResultsAccess()` in `src/lib/tiers.ts`.

---

## 9. Scoring Engine

### 9.1 ICS Formula

```text
ICS = D1 x 0.20 + D2 x 0.25 + D3 x 0.20 + D4 x 0.20 + D5 x 0.15
```

### 9.2 Dimensions

| Code | Dimension | Weight | Primary Questions |
|------|-----------|--------|-------------------|
| D1 | Strategic Alignment | 20% | E1-E6 |
| D2 | Business Value | 25% | B1-B12 |
| D3 | Technical Feasibility | 20% | T1-T12 |
| D4 | Organizational Readiness | 20% | U1-U9 |
| D5 | Risk Awareness | 15% | R1-R6 |
| P | Process Readiness | Gate only | P1-P12 |

Process dimension `P` is gate-only and never contributes to ICS.

### 9.3 Likert Normalization

```text
AdjustedValue = 6 - RawValue  when is_reverse = true
AdjustedValue = RawValue      when is_reverse = false
Score0100     = (AdjustedValue - 1) x 25
```

### 9.4 Recommendation Thresholds

| ICS Range | Recommendation |
|-----------|----------------|
| 75-100 | GO |
| 50-74.99 | CLARIFY |
| Below 50 | NO_GO |

Recommendation thresholds apply before gate overrides.

---

## 10. Flag Detection

| Code | Flag | Trigger | Severity |
|------|------|---------|----------|
| TM-1 | Within-Role Contradiction | Likert variance > 1.5 in same dimension | WARN |
| TM-2 | Narrative Inflation | High confidence + low specificity | WARN |
| TM-3 | Overconfidence | All 5s with no risks identified | CRITICAL |
| TM-4 | Cross-Role Mismatch | Role dimension gap > 30 points | WARN |
| TM-5 | Ownership Diffusion | No clear owner identified | WARN |
| TM-6 | Capacity Illusion | High readiness + low resource clarity | WARN |
| TM-7 | Complexity Denial | Simple rating + complex indicators | WARN |
| TM-8 | Open-Text Risk | Risk keywords in open responses | INFO |

Flags are generated by the deterministic flag engine under `src/lib/flags/`.

---

## 11. Gate Rules

| Gate | Condition | Override |
|------|-----------|----------|
| G1 | Any dimension < 50 | CLARIFY |
| G2 | Critical flag present | NO_GO |
| G3 | Process gate failed for Full kit | CLARIFY |
| G4 | Fewer than 2 roles responded | CLARIFY |

Gates override ICS-based recommendation. A high ICS can still be downgraded by gates.

---

## 12. Process Naming

Process Naming allows initiatives that affect multiple business processes to evaluate each process separately.

Requirements:

- Available for `FULL` and `PROCESS_STANDALONE`.
- Minimum 1 process, maximum 5 processes.
- Process name is required and max 80 characters.
- Description is optional and max 200 characters.
- Process weights must sum to 100%.
- Process names must be unique within a case.
- Process Owner and User participants can be assigned to process subsets.
- Process Readiness scoring supports per-process scores and weighted aggregate.
- Process gate uses the weakest relevant process score where applicable.

Data model:

```text
AssessmentProcess
  id
  caseId
  name
  description
  weight
  sortOrder

ParticipantProcess
  participantId
  processId

SurveyResponse
  processId?  // nullable for non-process answers and backward compatibility
```

---

## 13. API Endpoints

### 13.1 Cases

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/cases` | Create assessment | Optional |
| GET | `/api/cases` | List assessments | Optional |
| GET | `/api/cases?countOnly=true` | Get user case count and tier | Required for user-specific count |
| GET | `/api/cases/[id]` | Get assessment details | Optional |
| PATCH | `/api/cases/[id]` | Update assessment | Optional/access-controlled |
| DELETE | `/api/cases/[id]` | Delete if no responses | Optional/access-controlled |
| POST | `/api/cases/[id]/participants` | Add participant | Optional/access-controlled |
| GET | `/api/cases/[id]/results` | Get scoring results | Optional with tiered visibility |
| POST | `/api/cases/claim` | Link anonymous case to account | Required |

### 13.2 Survey

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/survey/[token]` | Get participant survey |
| POST | `/api/survey/[token]/responses` | Submit/save participant responses |

### 13.3 Auth, Admin, Contact

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/verify-email` | Verify email token |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password |
| GET/PATCH | `/api/admin/users` | List users and update tiers |
| POST | `/api/contact` | Submit contact form |
| POST | `/api/email/send` | Send email |
| POST | `/api/email/verify` | Verify email configuration |

---

## 14. Non-Functional Requirements

### 14.1 Security

**NFR-001:** Participant tokens are cryptographically random (`nanoid`).

**NFR-002:** Passwords are hashed with bcrypt.

**NFR-003:** Email verification is required before sign-in and before unlocking account-gated features.

**NFR-004:** Participant survey payloads must not expose ICS, flags, weights, TM codes, recommendations, or other participants' answers.

**NFR-005:** Admin APIs are restricted to allowed admin emails/domains.

**NFR-006:** Auth sessions use JWT strategy through NextAuth.

### 14.2 Performance

**NFR-010:** Survey pages should load in under 2 seconds under normal production conditions.

**NFR-011:** Scoring calculation should complete in under 500ms for typical assessment sizes.

### 14.3 Availability and Deployment

**NFR-020:** Production deployment targets Google Cloud Run in `europe-west1`.

**NFR-021:** Cloud Run service listens on port 3002.

**NFR-022:** CI/CD uses GitHub Actions with Workload Identity Federation.

**NFR-023:** Runtime configuration is supplied through environment variables and GitHub/GCP secrets.

---

## 15. Technical Architecture

### 15.1 Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 App Router |
| UI | Tailwind CSS, Radix UI, lucide-react |
| Auth | NextAuth v5 credentials |
| Database | PostgreSQL + Prisma ORM |
| Email | Nodemailer / SMTP |
| Charts | Recharts |
| Animation | Framer Motion |
| PDF | jsPDF |
| Hosting | Google Cloud Run |
| CI/CD | GitHub Actions + Google Workload Identity Federation |

### 15.2 Data Model

```text
User (1) ───────────── DecisionCase (N)
                            |
DecisionCase (1) ──┬── Participant (N)
                   |        |
                   |        ├── SurveyResponse (N)
                   |        └── ParticipantProcess (N)
                   |
                   ├── AssessmentProcess (N)
                   |
                   └── CaseSummary (1)
                            ├── ICS
                            ├── dimension scores
                            ├── role dimension scores
                            ├── flags
                            ├── gates
                            ├── blind spots
                            └── recommendation
```

---

## 16. Demo Mode

Demo routes remain available for scenario exploration:

- `/demo`
- `/demo/login`
- `/demo/dashboard`
- `/demo/survey`
- `/demo/results`
- `/demo/results/[id]`
- `/demo/admin`
- `/demo/admin/users`
- `/demo/admin/organizations`
- `/demo/admin/assessments`
- `/demo/admin/industries`
- `/demo/admin/process-types`
- `/demo/admin/roles`
- `/demo/admin/questions`

---

## 17. Deployment

### 17.1 Environments

| Environment | URL | Branch |
|-------------|-----|--------|
| Production | https://elvait.ai | main |
| Cloud Run | `elvait` service in `europe-west1` | main |

### 17.2 Pipeline

1. Push or PR to `main` triggers GitHub Actions test job.
2. Node 20 is installed and dependencies are installed with `npm ci`.
3. Prisma client is generated.
4. Vitest test suite runs.
5. Push to `main` deploys to Cloud Run via WIF.
6. Cloud Run deploys from source with port 3002 and configured environment variables.

### 17.3 Runtime Configuration

Required runtime variables include:

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_TRUST_HOST`
- `NEXT_PUBLIC_APP_URL`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `SMTP_FROM_NAME`

---

## 18. Test Coverage

Automated coverage is implemented with Vitest and includes:

- PRD requirement checks.
- Context validation.
- Scoring and normalization.
- Recommendation thresholds.
- Gate rules.
- Flag detection.
- API validation.
- Auth and tier behavior.
- Demo/admin route expectations.

Run with:

```bash
npm test
```

---

## 19. Constraints and Product Decisions

- AI never determines GO/CLARIFY/NO_GO.
- Participants never see scoring internals.
- Process Readiness gates but does not contribute to ICS.
- Decision title and variant become immutable after first response.
- Free tier remains intentionally limited to preserve conversion path.
- Full result detail and PDF export are tier-gated.
- PostgreSQL is the production database.
- Cloud Run and GitHub Actions WIF are the production deployment path.

---

## 20. Roadmap

### Completed

- Multi-role survey and deterministic ICS scoring.
- Thinking Maturity flags TM-1 through TM-8.
- Gate rules and rule-derived recommendations.
- Demo system.
- Authentication, email verification, password reset.
- Subscription tiers and pricing page.
- Results Gate with locked overlays and unlock modal.
- Admin tier management.
- Contact form and email service.
- Case claim flow.
- PDF export module.
- Process Naming data model and editor.

### Planned / Next

- Stripe/payment integration for self-serve plan upgrades.
- Google OAuth.
- Organization-level accounts.
- Cross-case analytics.
- Custom question sets and expanded role customization.
- Multi-language support.
- SSO/SAML for Enterprise.

---

## 21. References

- Deployment Guide: `/docs/DEPLOYMENT.md`
- Results Gate Spec: `/docs/SPEC-results-gate.md`
- Auth Plan: `/docs/PLAN-auth.md`
- API/Data Schema: `/prisma/schema.prisma`
- Question Registry: `/src/lib/questions/registry.ts`
- Tier Rules: `/src/lib/tiers.ts`
- Process Editor: `/src/components/cases/ProcessEditor.tsx`
- PRD Tests: `/tests/prd-requirements.test.ts`

---

*Document maintained by ELVAIT development team*  
*Last updated: 2026-07-07*
