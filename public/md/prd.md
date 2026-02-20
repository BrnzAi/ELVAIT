# ELVAIT - Product Requirements Document

**Product Name:** Clarity Before Automation Kit  
**Version:** 1.0  
**Last Updated:** 2026-02-12  
**Status:** Production  
**URL:** https://elvait.ai

---

## 1. Executive Summary

ELVAIT is a multi-role survey platform that collects stakeholder input on AI/automation investments, applies deterministic scoring and flag detection, and produces rule-based GO/CLARIFY/NO_GO recommendations.

**Core Principle:** AI never decides outcomes — recommendations are always rule-derived from stakeholder responses.

---

## 2. Problem Statement

Organizations making AI/automation investment decisions often suffer from:
- Lack of alignment between stakeholders (executives, technical, business owners)
- Unclear decision criteria leading to failed implementations
- Overconfidence in technical solutions without process readiness
- Hidden risks and blind spots not surfaced until too late

ELVAIT provides structured clarity before committing resources.

---

## 3. Target Users

### 3.1 Personas

| Role | Description | Survey Participation |
|------|-------------|---------------------|
| **Executive** | C-suite, budget authority | Strategic alignment, ROI expectations |
| **Business Owner** | Process owner, domain expert | Business impact, change readiness |
| **Technical Owner** | IT lead, architect | Technical feasibility, integration |
| **Process Owner** | Operations manager | Process documentation, automation readiness |
| **Functional User** | End user of the system | Day-to-day impact, adoption concerns |

### 3.2 Assessment Initiator
The person who creates the assessment, invites participants, and reviews results. Typically a project manager, transformation lead, or consultant.

---

## 4. Kit Variants

| Variant | Roles | Duration | Use Case |
|---------|-------|----------|----------|
| **Quick Check** | Executive only | 15 min | Fast executive signal |
| **Core (Decision Clarity)** | Exec + Business + Technical | 45 min | Investment-grade assessment |
| **Full Assessment** | All 4 roles + Process | 60+ min | Automation-safe with process check |
| **Process Standalone** | Process Owner only | 20 min | Process readiness audit |

---

## 5. Functional Requirements

### 5.1 Assessment Creation

**FR-001:** Initiator can create assessment with:
- Decision title (max 120 chars, immutable after first response)
- Investment type (AI solution / Software / External consultancy)
- Decision description (max 500 chars)
- Impacted areas (multi-select: IT, Operations, Finance, HR, Sales, Marketing, Customer Service, Legal, Executive)
- Time horizon (Immediate / 3-6 months / >6 months)
- Estimated investment (optional: <€100k / €100k-€500k / €500k-€1m / >€1m)
- Decision framing questions (D-CTX-1 through D-CTX-4)

**FR-002:** Kit variant selection determines required roles and question set.

**FR-003:** Decision title and variant are immutable after first participant response.

### 5.2 Participant Management

**FR-004:** Initiator can add participants by role with optional name/email.

**FR-005:** Each participant receives unique survey URL with token.

**FR-006:** Participant status tracking: INVITED → IN_PROGRESS → COMPLETED.

### 5.3 Survey Experience

**FR-007:** Participants see decision context (D-CTX fields) before questions.

**FR-008:** Questions displayed by role-specific set based on kit variant.

**FR-009:** Answer types: Likert 1-5, Single-select, Multi-select, Open text.

**FR-010:** Progress saved automatically; participants can resume.

**FR-011:** Participants NEVER see: ICS scores, flags, weights, TM codes, others' answers.

### 5.4 Scoring Engine

**FR-012:** Investment Clarity Score (ICS) formula:
```
ICS = D1×0.20 + D2×0.25 + D3×0.20 + D4×0.20 + D5×0.15
```

**FR-013:** Dimension mapping:
- D1: Strategic Alignment
- D2: Business Value
- D3: Technical Feasibility
- D4: Organizational Readiness
- D5: Risk Awareness

**FR-014:** Process dimension (P) is gate-only, never contributes to ICS.

**FR-015:** Likert normalization: Raw 1-5 → Score 0-100 via (adjusted-1)×25.

**FR-016:** Reverse scoring applied where question is_reverse = true.

### 5.5 Flag Detection

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

### 5.6 Gating Rules

| Gate | Condition | Override |
|------|-----------|----------|
| G1 | Any dimension < 50 | → CLARIFY |
| G2 | Critical flag present | → NO_GO |
| G3 | Process gate failed (Full kit) | → CLARIFY |
| G4 | < 2 roles responded | → CLARIFY |

### 5.7 Recommendation Engine

**FR-017:** Recommendation thresholds (before gate overrides):
- ICS ≥ 75 → GO
- ICS 50-74 → CLARIFY
- ICS < 50 → NO_GO

**FR-018:** Gates override ICS-based recommendation per rules above.

**FR-019:** Recommendation is ALWAYS rule-derived, never AI-generated.

### 5.8 Results Dashboard

**FR-020:** Results visible only to initiator, never to participants.

**FR-021:** Dashboard displays:
- ICS score with visual ring
- Dimension breakdown bars
- Triggered flags with evidence
- Blind spots analysis
- Action checklist
- Role mismatch visualization

---

## 6. Non-Functional Requirements

### 6.1 Security

**NFR-001:** Participant tokens are cryptographically random (nanoid).

**NFR-002:** No PII stored in pattern records (anonymized learning data).

**NFR-003:** Open text classified but raw text not stored long-term.

**NFR-004:** Forbidden fields middleware blocks exposure of internal scores to participants.

### 6.2 Performance

**NFR-005:** Survey pages load < 2 seconds.

**NFR-006:** Scoring calculation < 500ms after all responses submitted.

### 6.3 Scalability

**NFR-007:** Cloud Run auto-scales 0-10 instances.

**NFR-008:** SQLite database with volume mount for persistence.

### 6.4 Availability

**NFR-009:** 99.5% uptime target.

**NFR-010:** Zero-downtime deployments via Cloud Run revisions.

---

## 7. Technical Architecture

### 7.1 Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS + Radix UI |
| Database | SQLite + Prisma ORM |
| Hosting | Google Cloud Run |
| CI/CD | GitHub Actions + Workload Identity Federation |
| Charts | Recharts |
| Animations | Framer Motion |

### 7.2 Data Model

```
DecisionCase (1) ──┬── Participants (N)
                   │        │
                   │        └── SurveyResponses (N)
                   │
                   └── CaseSummary (1)
                          │
                          ├── ICS Score
                          ├── Dimension Scores
                          ├── Flags
                          └── Recommendation
```

### 7.3 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/cases | Create assessment |
| GET | /api/cases | List assessments |
| GET | /api/cases/[id] | Get assessment details |
| PATCH | /api/cases/[id] | Update assessment |
| DELETE | /api/cases/[id] | Delete (if no responses) |
| POST | /api/cases/[id]/participants | Add participant |
| GET | /api/cases/[id]/results | Get scoring results |
| GET | /api/survey/[token] | Get survey for participant |
| POST | /api/survey/[token]/responses | Submit responses |

---

## 8. Question Registry

**Total Questions:** 57

| Dimension | Questions | Roles |
|-----------|-----------|-------|
| D1: Strategic Alignment | E1-E6 | Executive |
| D2: Business Value | B1-B12 | Business Owner |
| D3: Technical Feasibility | T1-T12 | Technical Owner |
| D4: Organizational Readiness | U1-U9 | All roles |
| D5: Risk Awareness | R1-R6 | All roles |
| P: Process Readiness | P1-P12 | Process Owner |

---

## 9. Demo Mode

### 9.1 Demo Personas

| Persona | Role | Route |
|---------|------|-------|
| Admin | Platform administrator | /demo/admin |
| Executive | C-suite viewer | /demo/dashboard |
| Project Manager | Assessment initiator | /demo/survey |
| IT Lead | Technical participant | /demo/survey |
| HR Manager | Functional participant | /demo/survey |
| Operations Director | Process participant | /demo/survey |

### 9.2 Demo Pages

- `/demo` - Scenario selection wizard
- `/demo/login` - Persona login
- `/demo/dashboard` - Executive view with assessments
- `/demo/survey` - Participant survey experience
- `/demo/results` - Results dashboard preview
- `/demo/admin` - Admin panel with 7 sub-pages

---

## 10. Test Coverage

| Category | Automated | Manual | Total |
|----------|-----------|--------|-------|
| Scoring Engine | 17 | 7 | 24 |
| Flag Detection | 13 | 8 | 21 |
| Gate Rules | 11 | 4 | 15 |
| API Validation | 59 | 20 | 79 |
| User Journeys | 58 | 12 | 70 |
| Demo Pages | 89 | 8 | 97 |
| Security | 47 | 10 | 57 |
| Critical Flows | 35 | 18 | 53 |
| **Total** | **329** | **87** | **416** |

---

## 11. Deployment

### 11.1 Environments

| Environment | URL | Branch |
|-------------|-----|--------|
| Production | https://elvait.ai | main |
| Cloud Run | https://elvait-644878782438.europe-west1.run.app | main |

### 11.2 CI/CD Pipeline

1. Push to `main` triggers GitHub Actions
2. Tests run (329 automated tests)
3. Docker image built (node:20-slim)
4. Deployed to Cloud Run via Workload Identity Federation
5. Zero-downtime revision switch

### 11.3 Configuration

- **Port:** 3002
- **Memory:** 512Mi
- **CPU:** 1
- **Min instances:** 0
- **Max instances:** 10
- **Database:** SQLite at /app/data/production.db

---

## 12. Constraints & Decisions

### 12.1 Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| SQLite over Postgres | Simplicity for MVP, file-based persistence |
| Prisma 5.x over 7.x | Prisma 7 had breaking config changes |
| node:20-slim over alpine | Alpine's musl libc breaks Prisma |
| WIF over SA keys | More secure, no key management |
| Deterministic scoring | Trust and auditability over AI black box |

### 12.2 Constraints

- AI NEVER decides GO/CLARIFY/NO_GO
- Participants NEVER see scores, flags, weights
- Decision title immutable after first response
- Process dimension gates but doesn't contribute to ICS
- No Cloudflare tunnels - GitHub → GCP only

---

## 13. Future Roadmap

### Phase 2 (Planned)
- [ ] Email invitations for participants
- [ ] PDF report generation
- [ ] Comparative analysis across assessments
- [ ] Organization-level analytics

### Phase 3 (Considered)
- [ ] Integration with project management tools
- [ ] Custom question sets per organization
- [ ] Multi-language support
- [ ] SSO/SAML authentication

---

## 14. Glossary

| Term | Definition |
|------|------------|
| ICS | Investment Clarity Score (0-100) |
| D-CTX | Decision Context questions (1-4) |
| TM | Thinking Maturity flags (1-8) |
| Gate | Rule that can override ICS-based recommendation |
| Kit Variant | Assessment type determining roles/questions |

---

## 15. References

- Test Cases: `/md/cases.md`
- Deployment Guide: `/docs/DEPLOYMENT.md`
- API Schema: `/prisma/schema.prisma`
- Question Registry: `/src/lib/questions/registry.ts`

---

*Document maintained by ELVAIT development team*  
*Last updated: 2026-02-12*
