# ELVAIT - Frequently Asked Questions

**Clarity Before Automation Kit**

---

## General

### What is ELVAIT?

ELVAIT is a decision-support platform that helps organizations evaluate AI and automation investments before committing resources. It collects structured input from multiple stakeholders and produces objective, rule-based recommendations.

### Who is ELVAIT for?

- **Organizations** considering AI/automation investments
- **Decision makers** who need clarity before committing budget
- **Project teams** evaluating technical feasibility
- **Consultants** helping clients assess automation opportunities

### What does ELVAIT stand for?

ELVAIT = **EL**evate **VA**lue through **I**ntelligent **T**ransformation

---

## How It Works

### What is the assessment process?

1. **Initiator creates assessment** - Defines the decision context and selects a kit variant
2. **Participants are invited** - Each receives a unique survey link
3. **Stakeholders complete surveys** - Role-specific questions (5-10 minutes each)
4. **System calculates results** - Investment Clarity Score (ICS) + flags + recommendation
5. **Initiator reviews results** - Dashboard shows GO / CLARIFY / NO-GO recommendation

### What are the kit variants?

| Variant | Roles | Duration | Best For |
|---------|-------|----------|----------|
| **Quick Check** | Executive only | 15 min | Fast signal, early filtering |
| **Core** | Exec + Business + Tech | 45 min | Investment decisions |
| **Full** | All 4 roles + Process | 60+ min | Automation projects |
| **Process Standalone** | Process Owner only | 20 min | Process readiness audits |

### What roles can participate?

- **Executive** - Strategic alignment, business value
- **Business Owner** - Operational impact, change readiness
- **Technical Owner** - Feasibility, integration, risks
- **User Representative** - User impact, adoption readiness
- **Process Owner** - Process documentation, standardization

---

## The Scoring System

### What is the Investment Clarity Score (ICS)?

The ICS is a weighted composite score (0-100) calculated from five dimensions:

| Dimension | Weight | What It Measures |
|-----------|--------|------------------|
| D1 - Strategic Alignment | 20% | Fit with org strategy |
| D2 - Business Value | 25% | Expected ROI and benefits |
| D3 - Technical Feasibility | 20% | Can it be built? |
| D4 - Organizational Readiness | 20% | Is the org ready? |
| D5 - Risk Awareness | 15% | Are risks understood? |

**Formula:** `ICS = D1×0.20 + D2×0.25 + D3×0.20 + D4×0.20 + D5×0.15`

### How are recommendations determined?

| ICS Score | Recommendation | Meaning |
|-----------|----------------|---------|
| 75-100 | **GO** | Proceed with investment |
| 50-74 | **CLARIFY** | Address gaps before proceeding |
| 0-49 | **NO-GO** | Do not proceed at this time |

### Can the recommendation be overridden?

The system applies **gate rules** that can override the ICS-based recommendation:

- **G1:** Any dimension < 50 → Forces CLARIFY
- **G2:** Critical flag triggered → Forces NO-GO
- **G3:** Process dimension < 50 (Full kit) → Forces CLARIFY
- **G4:** Fewer than 2 roles responded → Forces CLARIFY

### What are flags?

Flags detect **thinking maturity issues** - patterns that indicate unclear thinking or misalignment:

| Flag | Name | Severity |
|------|------|----------|
| TM-1 | Within-Role Contradiction | Warning |
| TM-2 | Narrative Inflation | Warning |
| TM-3 | Overconfidence | Critical |
| TM-4 | Cross-Role Mismatch | Warning |
| TM-5 | Ownership Diffusion | Warning |
| TM-6 | Capacity Illusion | Warning |
| TM-7 | Complexity Denial | Warning |
| TM-8 | Open-Text Risk Keywords | Info |

---

## Privacy & Security

### Can participants see each other's answers?

**No.** Each participant only sees:
- The decision context (title, description, framing)
- Their own questions
- Confirmation of submission

Participants **cannot** see:
- Other participants' answers
- The ICS score
- Flags or recommendations
- Weights or scoring formulas

### Can participants see the final recommendation?

**No.** Only the assessment initiator can view results. This prevents bias and ensures honest input.

### Is data secure?

- All traffic uses HTTPS
- Survey links use unique, unguessable tokens
- No passwords stored for participants
- Protected documentation requires authentication

---

## For Initiators

### How do I create an assessment?

1. Go to https://elvait.brnz.live/create
2. Select your kit variant
3. Fill in the decision context:
   - Decision title
   - Investment type
   - Description
   - Impacted areas
   - Time horizon
4. Answer the 4 framing questions
5. Click "Create Assessment"

### How do I invite participants?

1. From your assessment page, click "+ Add" for each role
2. Enter participant name (optional: email)
3. Copy the unique survey link
4. Share the link with the participant via email/chat

### When can I see results?

Results are available once at least one participant completes their survey. However, for reliable results:
- **Quick Check:** 1 Executive response
- **Core:** At least 2-3 role responses
- **Full:** Responses from all key roles

### Can I edit an assessment after creating it?

- **Before first response:** Yes, all fields editable
- **After first response:** Decision title becomes locked (immutable)

### Can I delete an assessment?

Only if no responses have been submitted yet.

---

## For Participants

### How long does the survey take?

5-10 minutes depending on your role and the kit variant.

### What kind of questions will I answer?

- **Likert scale (1-5):** Rate your agreement with statements
- **Single select:** Choose one option
- **Open text:** Brief explanations (optional)

### Can I save and continue later?

Currently, surveys should be completed in one session. Progress is not saved if you close the browser.

### Will I see the results?

No. Only the assessment initiator can view results. This ensures your answers remain confidential and unbiased.

---

## Technical

### What browsers are supported?

ELVAIT works on all modern browsers:
- Chrome (recommended)
- Firefox
- Safari
- Edge

### Does it work on mobile?

Yes, the interface is responsive and works on phones and tablets.

### Is there an API?

Yes, ELVAIT has a REST API:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/cases` | POST | Create assessment |
| `/api/cases` | GET | List assessments |
| `/api/cases/[id]` | GET | Get assessment details |
| `/api/cases/[id]/participants` | POST | Add participant |
| `/api/cases/[id]/results` | GET | Get scoring results |
| `/api/survey/[token]` | GET | Get survey questions |
| `/api/survey/[token]/responses` | POST | Submit answers |

### Where is data stored?

Currently SQLite (in-container). PostgreSQL migration planned for production persistence.

---

## Troubleshooting

### Survey link shows "Invalid token"

The token may have expired or been entered incorrectly. Ask the initiator to:
1. Check the assessment still exists
2. Generate a new participant link if needed

### "Failed to load assessment" error

Try:
1. Refresh the page
2. Clear browser cache
3. Try a different browser

### Results not showing after survey completion

Results appear once surveys are submitted. If still not showing:
1. Confirm the participant clicked "Submit"
2. Refresh the results page
3. Check that the assessment status is not still "Draft"

---

## Contact & Support

### How do I report a bug?

Contact the ELVAIT team via:
- Discord: #elvait channel
- GitHub: Open an issue

### How do I request a feature?

Submit feature requests via GitHub issues or Discord discussion.

---

## About

### Who built ELVAIT?

ELVAIT was developed by the BRNZ team as a decision-support tool for AI/automation investments.

### Is ELVAIT open source?

Contact the team for licensing information.

### What's the technology stack?

- **Frontend:** Next.js 14, React, Tailwind CSS, Radix UI
- **Backend:** Next.js API routes, Prisma ORM
- **Database:** SQLite (PostgreSQL planned)
- **Hosting:** Google Cloud Run
- **CI/CD:** GitHub Actions

---

*FAQ last updated: 2026-02-13*
