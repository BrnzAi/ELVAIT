# ELVAIT Test Cases

All possible scenarios based on PRD and Acceptance Criteria v1.0

## Summary Matrix

| # | Scenario | Variant | Expected | Key Flags | Gates |
|---|----------|---------|----------|-----------|-------|
| 1 | Perfect GO | CORE | **GO** | None | None |
| 2 | Ownership Diffusion | CORE | **NO_GO** | OWNERSHIP_DIFFUSION (CRITICAL) | G4 |
| 3 | Low ICS Score | CORE | **NO_GO** | None | G1 |
| 4 | Mid-range ICS | CORE | **CLARIFY** | None | None |
| 5 | Gate G1 Triggered | CORE | **CLARIFY** | None | G1 |
| 6 | Narrative Inflation | CORE | **NO_GO** | NARRATIVE_INFLATION_RISK (CRITICAL) | None |
| 7 | Capacity Illusion | CORE | **NO_GO** | CAPACITY_ILLUSION_CONFIRMED (CRITICAL) | None |
| 8 | Overconfidence | CORE | **NO_GO** | OVERCONFIDENCE (CRITICAL) | None |
| 9 | Cross-Role Mismatch | CORE | **NO_GO** | CROSS_ROLE_MISMATCH (CRITICAL) | None |
| 10 | Complexity Denial | CORE | **CLARIFY** | COMPLEXITY_DENIAL (WARN) | None |
| 11 | Process Not Ready | FULL | **CLARIFY** | None | G2 |
| 12 | Quick Check GO | QUICK_CHECK | **GO** | None | None |
| 13 | Process Standalone | PROCESS_STANDALONE | **null** | None | None |
| 14 | Within-Role Contradiction | CORE | **CLARIFY** | WITHIN_ROLE_CONTRADICTION (WARN) | None |
| 15 | Multiple Participants | QUICK_CHECK | **CLARIFY** | None | None |

---

## Detailed Scenarios

### Scenario 1: Perfect GO - Full Alignment
**Variant:** CORE  
**Expected:** GO (ICS 75-100)  
**Description:** All roles aligned, high scores across all dimensions, no contradictions or flags.

**Key conditions:**
- All Likert responses 4-5
- Ownership aligned (all say "Executive sponsor")
- Evidence documented
- Trade-offs acknowledged

---

### Scenario 2: NO_GO - Ownership Diffusion (TM-5)
**Variant:** CORE  
**Expected:** NO_GO  
**Flag:** OWNERSHIP_DIFFUSION (CRITICAL)  
**Gate:** G4

**Key conditions:**
- E12: "Executive sponsor"
- B4: "Business unit leader"  
- T10: "Not clearly defined"
- 3 unique ownership answers → CRITICAL flag

**PRD Reference:** TM-5 triggers when `uniqueAnswers.size >= 3` or any answer is "Not clearly defined"

---

### Scenario 3: NO_GO - Low ICS Score
**Variant:** CORE  
**Expected:** NO_GO (ICS 30-54)

**Key conditions:**
- All Likert responses 2
- ICS formula: D1×0.20 + D2×0.25 + D3×0.20 + D4×0.20 + D5×0.15 < 55

**PRD Reference:** `if (ics < 55) return 'NO_GO'`

---

### Scenario 4: CLARIFY - Mid-range ICS
**Variant:** CORE  
**Expected:** CLARIFY (ICS 55-74)

**Key conditions:**
- Mixed Likert responses (mostly 3s)
- No critical flags
- ICS in clarify range

**PRD Reference:** `if (ics < 75) return 'CLARIFY'`

---

### Scenario 5: CLARIFY - Gate G1 Triggered
**Variant:** CORE  
**Expected:** CLARIFY  
**Gate:** G1 (LOW_DIMENSION_SCORE_D3)

**Key conditions:**
- High scores on D1, D2, D4, D5 (ICS would be 75+)
- Low scores on D3 (< 50)
- Gate overrides would-be GO

**PRD Reference:** G1 triggers when `caseDimScores[dim] < 50` for any D1-D5

---

### Scenario 6: NO_GO - Narrative Inflation Risk (TM-2)
**Variant:** CORE  
**Expected:** NO_GO  
**Flag:** NARRATIVE_INFLATION_RISK (CRITICAL)

**Key conditions:**
- B1 (claim) = 5 (high confidence)
- B2 = "Assumptions only" (no proof)
- B3 = "Continue anyway" (no consequence ownership)

**PRD Reference:** TM-2 triad: `B1_score >= 4 AND B2 in ['Assumptions only'] AND B3 in ['Continue anyway']`

---

### Scenario 7: NO_GO - Capacity Illusion Confirmed (TM-6)
**Variant:** CORE  
**Expected:** NO_GO  
**Flag:** CAPACITY_ILLUSION_CONFIRMED (CRITICAL)

**Key conditions:**
- B9 = "Nothing will be deprioritized"
- T6 = "Nothing critical will be impacted"
- Both business AND tech deny trade-offs

**PRD Reference:** TM-6: `if (biz && tech) addFlag('CAPACITY_ILLUSION_CONFIRMED', 'CRITICAL')`

---

### Scenario 8: NO_GO - Overconfidence (TM-3)
**Variant:** CORE  
**Expected:** NO_GO  
**Flag:** OVERCONFIDENCE (CRITICAL)

**Key conditions:**
- B1 (confidence claim) = 5
- B2 (evidence) = "No formal documentation" (score = 1)
- Gap: high confidence, zero evidence

**PRD Reference:** TM-3: `confidence >= 4 AND evidence_score <= 2`, CRITICAL when evidence = 1

---

### Scenario 9: NO_GO - Cross-Role Mismatch (TM-4)
**Variant:** CORE  
**Expected:** NO_GO  
**Flag:** CROSS_ROLE_MISMATCH (CRITICAL)

**Key conditions:**
- E17 (data readiness) = 5
- T1 (data readiness) = 2
- Gap = 3.0 (> 1.2 threshold on 1-5 scale)
- DATA_READINESS group → CRITICAL severity

**PRD Reference:** TM-4: `gap_1_5 >= 1.2`, CRITICAL for DATA_READINESS group

---

### Scenario 10: CLARIFY - Complexity Denial (TM-7)
**Variant:** CORE  
**Expected:** CLARIFY  
**Flag:** COMPLEXITY_DENIAL (WARN)

**Key conditions:**
- B10 (early) = 5 (underestimates complexity)
- B11 (late) = 5 (still underestimates)
- Same pattern in tech: T11=5, T12=5

**PRD Reference:** TM-7: `adjusted(B10) >= 4 AND adjusted(B11) >= 4`

---

### Scenario 11: CLARIFY - Gate G2 Process Readiness
**Variant:** FULL  
**Expected:** CLARIFY  
**Gate:** G2 (AUTOMATION_PREMATURITY)

**Key conditions:**
- Full kit variant (includes process owner)
- D1-D5 scores high (ICS would be GO)
- Process dimension (P) score < 50

**PRD Reference:** G2: `variant === 'FULL' AND caseDimScores.P < 50`

---

### Scenario 12: Quick Check GO
**Variant:** QUICK_CHECK  
**Expected:** GO

**Key conditions:**
- Single executive role only
- Weight: 100% executive
- High scores → GO

---

### Scenario 13: Process Standalone - No Recommendation
**Variant:** PROCESS_STANDALONE  
**Expected:** null (no ICS, no recommendation)

**Key conditions:**
- Process owner only
- compute_ics = false for this variant

**PRD Reference:** `if (ics === null) return null`

---

### Scenario 14: Within-Role Contradiction (TM-1)
**Variant:** CORE  
**Expected:** CLARIFY  
**Flag:** WITHIN_ROLE_CONTRADICTION (WARN)

**Key conditions:**
- E1 (positive) = 5
- E11 (reverse paired question) = 5
- Both adjusted scores >= 4 → contradiction

**PRD Reference:** TM-1: `adjusted(q_pos) >= 4 AND adjusted(q_rev) >= 4`

---

### Scenario 15: Multiple Participants Same Role
**Variant:** QUICK_CHECK  
**Expected:** CLARIFY

**Key conditions:**
- Two executives: one optimistic (all 5s), one skeptical (all 2s)
- Averaged before weighting
- Result falls in CLARIFY range

**PRD Reference:** "If role has multiple participants, average their dim_scores first, then apply weight"

---

## Flag Reference Table

| Flag ID | Truth Mechanism | Severity | Trigger Condition |
|---------|-----------------|----------|-------------------|
| WITHIN_ROLE_CONTRADICTION | TM-1 | WARN | Reversed pair both >= 4 adjusted |
| NARRATIVE_INFLATION_RISK | TM-2 | CRITICAL | Claim high + no proof + no consequence |
| PROOF_GAP | TM-2 | WARN | Claim high + no proof |
| CONSEQUENCE_UNOWNED | TM-2 | WARN | Claim high + no consequence |
| OVERCONFIDENCE | TM-3 | CRITICAL/WARN | Confidence >= 4, evidence <= 2 |
| CROSS_ROLE_MISMATCH | TM-4 | CRITICAL/WARN | Gap >= 1.2 (1-5) or >= 30 (0-100) |
| OWNERSHIP_DIFFUSION | TM-5 | CRITICAL | 3+ unique answers or "Not clearly defined" |
| CAPACITY_ILLUSION_BUSINESS | TM-6 | WARN | B9 = Nothing deprioritized |
| CAPACITY_ILLUSION_TECH | TM-6 | WARN | T6 = Nothing impacted |
| CAPACITY_ILLUSION_CONFIRMED | TM-6 | CRITICAL | Both B9 and T6 deny trade-offs |
| COMPLEXITY_DENIAL | TM-7 | WARN | Time-pair both >= 4 adjusted |

---

## Gate Reference Table

| Gate | Condition | Action | Applies To |
|------|-----------|--------|------------|
| G1 | Any D1-D5 < 50 | CLARIFY | All variants |
| G2 | P < 50 | CLARIFY | FULL only |
| G3 | User friction high + Exec readiness high | CLARIFY | With USER role |
| G4 | OWNERSHIP_DIFFUSION flag | CLARIFY | All variants |

---

## Running Test Cases

```bash
# Seed all test cases
npx ts-node prisma/seed-test-cases.ts

# Run scoring tests
npx vitest run tests/scoring.test.ts

# Run flag tests  
npx vitest run tests/flags.test.ts

# Run gate tests
npx vitest run tests/gates.test.ts

# Run all tests
npx vitest run
```

---

## Acceptance Criteria Mapping

| AC ID | Description | Covered By |
|-------|-------------|------------|
| AC-001 | ICS formula exact | Scenarios 1-4, 11, 12 |
| AC-002 | Reverse scoring | Scenario 14 |
| AC-003 | Kit weights | Scenarios 1, 11, 12, 13 |
| AC-004 | CRITICAL flag → NO_GO | Scenarios 2, 6, 7, 8, 9 |
| AC-005 | Gate → CLARIFY | Scenarios 5, 11 |
| AC-006 | ICS < 55 → NO_GO | Scenario 3 |
| AC-007 | ICS 55-74 → CLARIFY | Scenario 4 |
| AC-008 | ICS >= 75 + no flags → GO | Scenarios 1, 12 |
| AC-009 | Process standalone no ICS | Scenario 13 |
| AC-010 | Multi-participant averaging | Scenario 15 |

---

## Results Gate Test Cases

Tests for the tiered access system that gates results page content.

### Authentication & Verification

| # | Scenario | Expected | Test File |
|---|----------|----------|-----------|
| RG-01 | Unverified user tries to sign in | Blocked with "Please verify your email" | auth.test.ts |
| RG-02 | Verified user signs in | Success, redirected to dashboard/returnTo | auth.test.ts |
| RG-03 | Sign up sends verification email | Email sent with verification link | auth.test.ts |
| RG-04 | Sign up does NOT auto-sign-in | Shows "Check your email" message | auth.test.ts |

### Tier 0 - Anonymous Access

| # | Scenario | Expected | Test File |
|---|----------|----------|-----------|
| RG-05 | Anonymous views results | Sees verdict, ICS, 2 flags, summary | results-gate.test.ts |
| RG-06 | Anonymous clicks locked content | Opens unlock modal with signup CTA | results-gate.test.ts |
| RG-07 | Anonymous tries PDF download | Shows upgrade modal | results-gate.test.ts |
| RG-08 | Unverified = unauthenticated | Treated as Tier 0 | results-gate.test.ts |

### Tier 1 - Free Account Access

| # | Scenario | Expected | Test File |
|---|----------|----------|-----------|
| RG-09 | Free user views results | Sees all flags, role breakdown, contradiction map | results-gate.test.ts |
| RG-10 | Free user creates first case | Allowed | results-gate.test.ts |
| RG-11 | Free user creates second case | Blocked with upgrade prompt | results-gate.test.ts |
| RG-12 | Free user tries PDF download | Blocked with upgrade prompt | results-gate.test.ts |

### Tier 2+ - Paid Account Access

| # | Scenario | Expected | Test File |
|---|----------|----------|-----------|
| RG-13 | Starter user downloads PDF | Allowed | results-gate.test.ts |
| RG-14 | Starter user creates 4th case | Blocked (3 case limit) | results-gate.test.ts |
| RG-15 | Professional user - unlimited cases | Allowed | results-gate.test.ts |
| RG-16 | Enterprise user - all features | Full access | results-gate.test.ts |

### Admin Access

| # | Scenario | Expected | Test File |
|---|----------|----------|-----------|
| RG-17 | @brnz.ai user accesses /admin/users | Allowed | auth.test.ts |
| RG-18 | @elvait.ai user accesses /admin/users | Allowed | auth.test.ts |
| RG-19 | @gmail.com user accesses /admin/users | Blocked (redirect or 403) | auth.test.ts |

### Running Results Gate Tests

```bash
# Run results gate tests only
npx vitest run tests/results-gate.test.ts

# Run auth tests (includes verification)
npx vitest run tests/auth.test.ts

# Run all tests
npx vitest run
```
