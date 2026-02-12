# ELVAIT Complete Test Cases

**Version:** 2.0  
**Last Updated:** 2026-02-12  
**Total Test Cases:** 294 automated + 50 manual scenarios

---

## Part 1: Scoring & Recommendation Scenarios

### 1.1 ICS Score Boundaries

| # | Scenario | ICS | Expected | Condition |
|---|----------|-----|----------|-----------|
| S01 | Perfect Score | 100 | GO | All responses = 5 |
| S02 | Minimum Score | 0 | NO_GO | All responses = 1 |
| S03 | GO Boundary | 75 | GO | Exactly at threshold |
| S04 | CLARIFY Upper | 74 | CLARIFY | Just below GO |
| S05 | CLARIFY Lower | 50 | CLARIFY | At CLARIFY minimum |
| S06 | NO_GO Boundary | 49 | NO_GO | Just below CLARIFY |
| S07 | Mid-range | 62 | CLARIFY | Average responses |

### 1.2 Dimension Weight Scenarios

| # | Scenario | D1 | D2 | D3 | D4 | D5 | ICS | Expected |
|---|----------|----|----|----|----|----|----|----------|
| D01 | D2 Heavy | 50 | 100 | 50 | 50 | 50 | 62.5 | CLARIFY |
| D02 | D1 Heavy | 100 | 50 | 50 | 50 | 50 | 57.5 | CLARIFY |
| D03 | D5 Light | 100 | 100 | 100 | 100 | 0 | 85 | GO |
| D04 | All Equal | 70 | 70 | 70 | 70 | 70 | 70 | CLARIFY |
| D05 | One Weak | 90 | 90 | 30 | 90 | 90 | 79.5 | GO* |

*Note: D05 triggers Gate G1 (D3 < 50) → CLARIFY override

### 1.3 Likert Normalization

| # | Raw | Reverse | Adjusted | Score (0-100) |
|---|-----|---------|----------|---------------|
| L01 | 1 | No | 1 | 0 |
| L02 | 2 | No | 2 | 25 |
| L03 | 3 | No | 3 | 50 |
| L04 | 4 | No | 4 | 75 |
| L05 | 5 | No | 5 | 100 |
| L06 | 1 | Yes | 5 | 100 |
| L07 | 2 | Yes | 4 | 75 |
| L08 | 3 | Yes | 3 | 50 |
| L09 | 4 | Yes | 2 | 25 |
| L10 | 5 | Yes | 1 | 0 |

---

## Part 2: Flag Detection Scenarios

### 2.1 TM-1: Within-Role Contradiction

| # | Scenario | Q_Positive | Q_Reverse | Flag | Severity |
|---|----------|-----------|-----------|------|----------|
| TM1-01 | Both high | 5 | 5 | WITHIN_ROLE_CONTRADICTION | WARN |
| TM1-02 | Both moderate | 4 | 4 | WITHIN_ROLE_CONTRADICTION | WARN |
| TM1-03 | One high | 5 | 3 | None | - |
| TM1-04 | Both low | 2 | 2 | None | - |

### 2.2 TM-2: Narrative Inflation

| # | B1 (Claim) | B2 (Evidence) | B3 (Consequence) | Flag | Severity |
|---|-----------|---------------|------------------|------|----------|
| TM2-01 | 5 | Assumptions | Continue anyway | NARRATIVE_INFLATION_RISK | CRITICAL |
| TM2-02 | 5 | Assumptions | KPIs tracked | PROOF_GAP | WARN |
| TM2-03 | 5 | Documented | Continue anyway | CONSEQUENCE_UNOWNED | WARN |
| TM2-04 | 5 | Documented | KPIs tracked | None | - |
| TM2-05 | 3 | Assumptions | Continue anyway | None | - |

### 2.3 TM-3: Overconfidence

| # | Confidence | Evidence Score | Flag | Severity |
|---|------------|----------------|------|----------|
| TM3-01 | 5 | 1 | OVERCONFIDENCE | CRITICAL |
| TM3-02 | 5 | 2 | OVERCONFIDENCE | WARN |
| TM3-03 | 4 | 1 | OVERCONFIDENCE | CRITICAL |
| TM3-04 | 4 | 2 | OVERCONFIDENCE | WARN |
| TM3-05 | 4 | 3 | None | - |
| TM3-06 | 3 | 1 | None | - |

### 2.4 TM-4: Cross-Role Mismatch

| # | Exec Score | Tech Score | Gap | Flag | Severity |
|---|-----------|-----------|-----|------|----------|
| TM4-01 | 5 | 2 | 3.0 | CROSS_ROLE_MISMATCH | CRITICAL |
| TM4-02 | 5 | 3 | 2.0 | CROSS_ROLE_MISMATCH | WARN |
| TM4-03 | 4 | 3 | 1.0 | None | - |
| TM4-04 | 2 | 5 | 3.0 | CROSS_ROLE_MISMATCH | CRITICAL |

### 2.5 TM-5: Ownership Diffusion

| # | Exec Answer | Business Answer | Tech Answer | Flag | Severity |
|---|------------|-----------------|-------------|------|----------|
| TM5-01 | Executive | Business leader | Not defined | OWNERSHIP_DIFFUSION | CRITICAL |
| TM5-02 | Executive | Executive | Not defined | OWNERSHIP_DIFFUSION | CRITICAL |
| TM5-03 | Executive | Business leader | Project mgr | OWNERSHIP_DIFFUSION | CRITICAL |
| TM5-04 | Executive | Executive | Executive | None | - |

### 2.6 TM-6: Capacity Illusion

| # | B9 (Deprioritize) | T6 (Impact) | Flag | Severity |
|---|------------------|-------------|------|----------|
| TM6-01 | Nothing | Nothing | CAPACITY_ILLUSION_CONFIRMED | CRITICAL |
| TM6-02 | Nothing | Identified | CAPACITY_ILLUSION_BUSINESS | WARN |
| TM6-03 | Lower priority | Nothing | CAPACITY_ILLUSION_TECH | WARN |
| TM6-04 | Lower priority | Identified | None | - |

### 2.7 TM-7: Complexity Denial

| # | Early Estimate | Late Estimate | Flag | Severity |
|---|---------------|---------------|------|----------|
| TM7-01 | 5 (easy) | 5 (still easy) | COMPLEXITY_DENIAL | WARN |
| TM7-02 | 4 | 4 | COMPLEXITY_DENIAL | WARN |
| TM7-03 | 5 | 3 | None | - |
| TM7-04 | 3 | 3 | None | - |

### 2.8 TM-8: Open-Text Risk Detection

| # | Response Text | Flag | Keywords |
|---|--------------|------|----------|
| TM8-01 | "No risks identified" | BLIND_OPTIMISM | no risk, none, nothing |
| TM8-02 | "Main risk is budget" | None | - |
| TM8-03 | "N/A" | BLIND_OPTIMISM | n/a, na, none |
| TM8-04 | "Timeline concerns" | None | - |

---

## Part 3: Gate Rule Scenarios

### 3.1 Gate G1: Low Dimension Score

| # | Weak Dimension | Score | Other Dims | Result |
|---|---------------|-------|------------|--------|
| G1-01 | D1 | 45 | All 80 | CLARIFY |
| G1-02 | D2 | 49 | All 90 | CLARIFY |
| G1-03 | D3 | 30 | All 100 | CLARIFY |
| G1-04 | D4 | 50 | All 80 | GO (50 passes) |
| G1-05 | D5 | 48 | All 85 | CLARIFY |

### 3.2 Gate G2: Process Readiness (FULL variant only)

| # | Variant | P Score | ICS | Result |
|---|---------|---------|-----|--------|
| G2-01 | FULL | 45 | 82 | CLARIFY |
| G2-02 | FULL | 50 | 85 | GO |
| G2-03 | CORE | 40 | 80 | GO (G2 N/A) |
| G2-04 | FULL | 30 | 90 | CLARIFY |

### 3.3 Gate G3: User Friction

| # | User Friction | Exec Readiness | Result |
|---|--------------|----------------|--------|
| G3-01 | High (80) | High (85) | CLARIFY |
| G3-02 | High (75) | Low (50) | GO |
| G3-03 | Low (40) | High (90) | GO |
| G3-04 | Low (30) | Low (40) | CLARIFY (low ICS) |

### 3.4 Gate G4: Ownership Diffusion

| # | Has TM-5 Flag | ICS | Result |
|---|--------------|-----|--------|
| G4-01 | Yes | 90 | CLARIFY |
| G4-02 | Yes | 50 | NO_GO (ICS) |
| G4-03 | No | 80 | GO |

---

## Part 4: Kit Variant Scenarios

### 4.1 QUICK_CHECK (Executive Only)

| # | Exec Score | ICS | Result |
|---|-----------|-----|--------|
| QC-01 | 90 | 90 | GO |
| QC-02 | 60 | 60 | CLARIFY |
| QC-03 | 40 | 40 | NO_GO |

### 4.2 CORE (3 Roles)

| # | Exec | Business | Tech | ICS | Result |
|---|------|----------|------|-----|--------|
| CO-01 | 80 | 80 | 80 | 80 | GO |
| CO-02 | 90 | 50 | 50 | 63.3 | CLARIFY |
| CO-03 | 40 | 40 | 40 | 40 | NO_GO |

### 4.3 FULL (4 Roles + Process)

| # | Exec | Business | Tech | Process | P | ICS | Result |
|---|------|----------|------|---------|---|-----|--------|
| FU-01 | 80 | 80 | 80 | 80 | 80 | 80 | GO |
| FU-02 | 90 | 90 | 90 | 90 | 40 | 90 | CLARIFY (G2) |
| FU-03 | 80 | 80 | 80 | 80 | 60 | 80 | GO |

### 4.4 PROCESS_STANDALONE

| # | Process Score | ICS | Result |
|---|--------------|-----|--------|
| PS-01 | 90 | null | null |
| PS-02 | 50 | null | null |
| PS-03 | 30 | null | null |

---

## Part 5: API Validation Scenarios

### 5.1 Create Case Validation

| # | Field | Value | Expected |
|---|-------|-------|----------|
| V01 | decisionTitle | empty | 400 Error |
| V02 | decisionTitle | 121 chars | 400 Error |
| V03 | decisionTitle | 120 chars | Success |
| V04 | variant | "INVALID" | 400 Error |
| V05 | variant | "CORE" | Success |
| V06 | investmentType | "Invalid" | 400 Error |
| V07 | investmentType | "AI solution / automation" | Success |
| V08 | impactedAreas | [] | 400 Error |
| V09 | impactedAreas | ["IT"] | Success |
| V10 | timeHorizon | "Invalid" | 400 Error |
| V11 | timeHorizon | "3-6 months" | Success |
| V12 | dCtx1 | empty | 400 Error |
| V13 | dCtx1 | 1001 chars | 400 Error |
| V14 | dCtx1 | "Valid text" | Success |
| V15 | dCtx2 | empty | 400 Error |
| V16 | dCtx3 | empty | 400 Error |
| V17 | dCtx4 | empty | 400 Error |
| V18 | estimatedInvestment | empty | Success (optional) |
| V19 | estimatedInvestment | "Invalid" | 400 Error |
| V20 | estimatedInvestment | "€100k-€500k" | Success |

### 5.2 Survey Response Validation

| # | Scenario | Expected |
|---|----------|----------|
| SR01 | Valid token | 200 + survey data |
| SR02 | Invalid token | 404 Error |
| SR03 | Expired token | 404 Error |
| SR04 | Submit all answers | 201 Success |
| SR05 | Submit partial | 400 Error |
| SR06 | Submit duplicate | 409 Conflict |
| SR07 | Invalid Likert (0) | 400 Error |
| SR08 | Invalid Likert (6) | 400 Error |
| SR09 | Valid Likert (1-5) | Success |

---

## Part 6: UI/UX Scenarios

### 6.1 Case Creation Flow

| # | Step | Validation | Expected |
|---|------|-----------|----------|
| UI01 | Step 1 | No variant selected | Next disabled |
| UI02 | Step 1 | Variant selected | Next enabled |
| UI03 | Step 2 | Empty title | Next disabled |
| UI04 | Step 2 | Title > 120 chars | Error shown |
| UI05 | Step 2 | No investment type | Next disabled |
| UI06 | Step 2 | No impacted areas | Next disabled |
| UI07 | Step 2 | No time horizon | Next disabled |
| UI08 | Step 3 | Empty D-CTX-1 | Submit disabled |
| UI09 | Step 3 | All D-CTX filled | Submit enabled |
| UI10 | Submit | Valid data | Redirect to case |
| UI11 | Submit | API error | Error message |

### 6.2 Survey Flow

| # | State | Expected |
|---|-------|----------|
| SU01 | Context view | Show decision context |
| SU02 | Start clicked | Show first question |
| SU03 | Likert selected | Enable Next |
| SU04 | Next clicked | Show next question |
| SU05 | Previous clicked | Show previous |
| SU06 | Last question | Show Complete |
| SU07 | Complete clicked | Show completion |
| SU08 | View Results | Redirect to results |

### 6.3 Results Dashboard

| # | Component | Data | Expected |
|---|-----------|------|----------|
| RD01 | ICS Ring | 85 | Green ring, 85 displayed |
| RD02 | ICS Ring | 60 | Yellow ring, 60 displayed |
| RD03 | ICS Ring | 40 | Red ring, 40 displayed |
| RD04 | Recommendation | GO | Green banner |
| RD05 | Recommendation | CLARIFY | Yellow banner |
| RD06 | Recommendation | NO_GO | Red banner |
| RD07 | Dimensions | Click | Expand insights |
| RD08 | Flags | Triggered | Show with severity |
| RD09 | Blind Spots | Detected | Show cards |
| RD10 | Checklist | Items | Show with priority |

---

## Part 7: Security Scenarios

### 7.1 Data Privacy

| # | Scenario | Expected |
|---|----------|----------|
| SEC01 | Participant views survey | No ICS visible |
| SEC02 | Participant views survey | No flags visible |
| SEC03 | Participant views survey | No other answers visible |
| SEC04 | Participant views survey | No weights visible |
| SEC05 | Admin views results | All data visible |

### 7.2 Token Security

| # | Scenario | Expected |
|---|----------|----------|
| TOK01 | Guess token | 404 Not found |
| TOK02 | Reuse token | Blocked after submit |
| TOK03 | Token format | 21+ char nanoid |

### 7.3 Input Sanitization

| # | Input | Field | Expected |
|---|-------|-------|----------|
| XSS01 | `<script>alert(1)</script>` | title | Escaped |
| XSS02 | `<img onerror=alert(1)>` | description | Escaped |
| XSS03 | `javascript:alert(1)` | dCtx1 | Escaped |
| SQL01 | `'; DROP TABLE--` | title | Safe (Prisma) |

---

## Part 8: Demo System Scenarios

### 8.1 Role Routing

| # | Role | Expected Route |
|---|------|---------------|
| DM01 | Admin | /demo/admin |
| DM02 | Executive | /demo/dashboard |
| DM03 | Business Owner | /demo/survey |
| DM04 | Technical Owner | /demo/survey |
| DM05 | Process Owner | /demo/survey |
| DM06 | Sponsor | /demo/survey |

### 8.2 Admin Pages

| # | Page | Expected |
|---|------|----------|
| AD01 | /demo/admin | Dashboard with stats |
| AD02 | /demo/admin/users | User table |
| AD03 | /demo/admin/organizations | Org cards |
| AD04 | /demo/admin/assessments | Assessment table |
| AD05 | /demo/admin/industries | Industry list |
| AD06 | /demo/admin/process-types | Process cards |
| AD07 | /demo/admin/roles | Role cards |
| AD08 | /demo/admin/questions | Question registry |

### 8.3 Demo Survey

| # | Scenario | Expected |
|---|----------|----------|
| DS01 | Start survey | Show context |
| DS02 | Answer questions | Progress updates |
| DS03 | Complete survey | Show completion |
| DS04 | View results | Show results page |

---

## Part 9: Edge Cases

### 9.1 Empty States

| # | Scenario | Expected |
|---|----------|----------|
| ED01 | No participants | Empty state message |
| ED02 | No responses | Cannot calculate ICS |
| ED03 | Partial responses | Show pending count |
| ED04 | No flags triggered | "No flags" message |

### 9.2 Boundary Values

| # | Scenario | Value | Expected |
|---|----------|-------|----------|
| BV01 | ICS exactly 0 | 0 | NO_GO |
| BV02 | ICS exactly 100 | 100 | GO |
| BV03 | Title exactly 120 | 120 chars | Valid |
| BV04 | Title 121 chars | 121 chars | Invalid |
| BV05 | D-CTX exactly 1000 | 1000 chars | Valid |
| BV06 | D-CTX 1001 chars | 1001 chars | Invalid |

### 9.3 Special Characters

| # | Input | Expected |
|---|-------|----------|
| SP01 | Emoji 🚀 | Preserved |
| SP02 | Unicode Проект | Preserved |
| SP03 | Currency €100k | Preserved |
| SP04 | Newlines | Preserved |
| SP05 | Leading spaces | Trimmed |
| SP06 | Trailing spaces | Trimmed |

---

## Running Tests

```bash
# Run all 294 automated tests
npm test

# Run specific test file
npx vitest run tests/scoring.test.ts

# Run with coverage
npx vitest run --coverage

# Run in watch mode
npx vitest
```

---

## Test Coverage Summary

| Area | Automated | Manual | Total |
|------|-----------|--------|-------|
| Scoring Engine | 17 | 7 | 24 |
| Flag Detection | 13 | 8 | 21 |
| Gate Rules | 11 | 4 | 15 |
| API Validation | 59 | 20 | 79 |
| User Journeys | 58 | 12 | 70 |
| Demo Pages | 89 | 8 | 97 |
| Security | 47 | 10 | 57 |
| **Total** | **294** | **69** | **363** |

---

*Generated by QA Master - ELVAIT v1.0*
