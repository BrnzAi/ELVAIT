# Results Gate — Product Specification
**Clarity Kit / ELVAIT** · v1.1 · February 2026

---

## 1. Concept

Users complete the assessment **without registration** — zero entry barrier.  
The gate activates **after completion**, on the results page.  
By this point the user has invested ~15 minutes → motivation to see the full result is at its peak.

```
Assessment (free, no auth)
        ↓
Results Page — Preview (free, no auth)
        ↓ [Register to unlock]
Results Page — Full (free account)
        ↓ [Upgrade]
Full Platform (paid plan)
```

---

## 2. Access Tiers

### Tier 0 — Anonymous (no registration)

**What the user sees:**
- Final verdict: GO / FIX FIRST / NO-GO with color and icon
- ICS (Investment Clarity Score) — single number, e.g. "67/100"
- 2 top flags from the full list (remaining flags behind blur overlay)
- One-paragraph text summary — generic, no role-level detail

**What is locked (blur + lock icon):**
- Role breakdown (Executive / Business Owner / Tech Owner / End User)
- Flag detail with explanations and action items
- Contradiction map — where roles disagree with each other
- Download report (PDF)
- Save / return to case later

**CTA on the page:**
> **"Unlock full analysis — it's free"**  
> Register to see role breakdowns, all flags, and contradiction map

Button: `Create free account` (primary, blue)  
Secondary link: `See what's included →` (opens pricing modal)

---

### Tier 1 — Registered (free account)

**What gets unlocked:**
- Full role breakdown with scores
- All flags with explanations
- Contradiction map
- Case saved to "My Assessments"
- History (last 3 cases)

**What is locked (soft lock — visible with upgrade prompt):**
- Download PDF report
- Cross-case comparison
- Role and question customization
- Creating a new assessment (limit: **1 active case** on free plan)

**CTA when attempting to create a second assessment:**
> **"You've used your free assessment"**  
> Upgrade to run multiple decisions and unlock full reporting

Button: `See Plans` (links to pricing)

---

### Tier 2 — Starter Plan (€49–99 / decision or €29/month)

**What gets unlocked:**
- Download PDF report
- Up to 3 active cases
- Up to 25 respondents per decision
- Standard roles (no customization)

---

### Tier 3 — Professional Plan (€149–299/month)

**What gets unlocked:**
- Unlimited cases
- Up to 100 respondents
- Add / edit questions (limited)
- Role customization (limited — up to +2 additional roles)
- Cross-case analytics

---

### Tier 4 — Enterprise (€3k–15k/year)

**What gets unlocked:**
- Everything above + unlimited customization
- API access
- Governance / portfolio view
- Custom branding in reports
- SLA and enterprise security

---

## 3. UI — Results Page

### Page Structure (top → bottom)

```
┌─────────────────────────────────────────────────────┐
│  HEADER: Assessment Name · Date · [Save] (locked)   │
├─────────────────────────────────────────────────────┤
│                                                     │
│   ██████  FIX FIRST                                 │
│   ICS: 67/100                                       │
│                                                     │
│   "Significant gaps detected in process clarity     │
│    and stakeholder alignment. Address before        │
│    committing to automation investment."            │
│                                                     │
├─────────────────────────────────────────────────────┤
│  TOP FLAGS (2 visible, rest blurred)                │
│  ✓ Flag 1: Process documentation incomplete         │
│  ✓ Flag 2: Executive / Tech misalignment on ROI     │
│  ░░░░░░░░░░░░░░ [locked] ░░░░░░░░░░░░░░░░░          │
│  ░░░░░░░░░░░░░░ [locked] ░░░░░░░░░░░░░░░░░          │
│                                                     │
│  🔒  Register free to see all 5 flags               │
├─────────────────────────────────────────────────────┤
│  ROLE BREAKDOWN (fully blurred for anonymous user)  │
│                                                     │
│  ░░ Executive: ██/100  ░░░░░░░░░░░░░░░░░░░░░░░░░   │
│  ░░ Biz Owner: ██/100  ░░░░░░░░░░░░░░░░░░░░░░░░░   │
│  ░░ Tech:      ██/100  ░░░░░░░░░░░░░░░░░░░░░░░░░   │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │  🔓 Unlock full analysis — it's free         │  │
│  │  See role scores, all flags & contradictions │  │
│  │  [Create free account]   [See plans →]       │  │
│  └──────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────┤
│  NEXT STEPS (always visible, but generic)           │
│  • Address process documentation gaps               │
│  • Align stakeholders on ROI expectations           │
│  • Re-assess after fixes                            │
│                                                     │
│  [Download PDF Report] ← locked → shows modal      │
│  [Start New Assessment] ← ok for anon; for free    │
│                           account → upgrade prompt  │
└─────────────────────────────────────────────────────┘
```

---

## 4. Blur + Lock Mechanics

### Visual
- Locked content: CSS `filter: blur(4px)` + `pointer-events: none`
- On top: semi-transparent overlay with a lock icon and short label
- Do **not** hide content entirely — the user should see that something **is there**

### On click of a locked element
Opens a **bottom sheet / modal** (not a separate page):

**For Tier 1 features (role breakdown, flags, contradictions):**
```
┌─────────────────────────────────────┐
│  🔓 Unlock Role Breakdown           │
│                                     │
│  See how each stakeholder group     │
│  scored and where they disagree.    │
│                                     │
│  ✓ Free with account                │
│  ✓ Takes 30 seconds to register     │
│                                     │
│  [Create free account]              │
│  [Already have account? Sign in]    │
└─────────────────────────────────────┘
```

**For Tier 2+ features (PDF, multiple cases):**
```
┌─────────────────────────────────────┐
│  📄 Download Full PDF Report        │
│                                     │
│  Available on Starter and above.    │
│                                     │
│  Starter — €79/decision             │
│  Professional — from €149/month     │
│                                     │
│  [See all plans]                    │
│  [Contact us to get started]        │
└─────────────────────────────────────┘
```

---

## 5. Registration — Flow Requirements

**Principles:**
- Minimum friction: Email + Password (Google OAuth planned)
- **Require email verification** before sign-in — users must verify email to unlock Tier 1 results
- After registration: show "Check your email" message with verification link
- After verification: user can sign in and results unlock

**Fields:**
```
Name (optional) ______
Email ________________
Password _____________
Confirm Password _____
[Create account]

By registering you agree to Terms · Privacy Policy
```

**After registration:**
- User sees "Check your email" confirmation screen
- Verification email sent with magic link
- User clicks link → email verified → can now sign in
- After sign in: results unlock (Tier 1), case saved to "My Assessments"

**Sign-in error handling:**
- If user tries to sign in before verifying: "Please verify your email before signing in"

---

## 6. "My Assessments" — MVP Scope

Page in nav (already present in the header per the current design).

**Free account view:**
```
My Assessments

[+ New Assessment]  ← on click → upgrade modal if 1 case already exists

┌──────────────────────────────────────────────────┐
│  ERP Implementation Decision · FIX FIRST · 67   │
│  Feb 20, 2026 · 12 respondents                  │
│  [View Results]  [Download PDF 🔒]               │
└──────────────────────────────────────────────────┘
```

---

## 7. Pricing Modal / Page

Accessible via "See plans" from any locked state.  
Minimum structure for launch:

| | Starter | Professional | Enterprise |
|---|---|---|---|
| **Price** | €79/decision | €149–299/mo | Custom |
| Active cases | 1 | Unlimited | Unlimited |
| Respondents | 25 | 100 | Unlimited |
| PDF Reports | ✓ | ✓ | ✓ |
| Custom roles | — | Limited (+2) | Full |
| Custom questions | — | Limited | Full |
| Cross-case analytics | — | ✓ | ✓ |
| API | — | — | ✓ |

**CTA for all plans: `Get Started → Contact us`**

Button leads to a short form (name, email, company, plan) or a mailto link.  
No automated payment at this stage — contact collection only.  
The rest of the process is handled manually: outreach → invoice → bank transfer → access granted.

---

## 8. Technical Requirements (MVP for Launch)

### Must Have
- [x] Results page renders Tier 0 content without auth
- [x] Blur + lock overlay on Tier 1+ content
- [x] Click on locked element → modal with CTA
- [x] Registration (email/password) with email verification
- [x] Email verification required before sign-in
- [x] After sign-in — results unlock on the same page
- [x] "My Assessments" — list of saved cases (Dashboard)
- [x] 1-case limit for free account (upgrade prompt on second attempt)
- [x] Pricing page with "Contact us" button
- [x] Contact form with email notification
- [x] **Admin panel:** `/admin/users` with tier management (restricted to @brnz.ai, @elvait.ai)

### Manual Client Onboarding Process (no payment system required)

Until Stripe or another payment processor is connected, the entire flow is handled manually:

```
Client clicks "Get Started" on the site
        ↓
Fills in a form: name, email, company, desired plan
        ↓
Team receives a notification (email / Slack)
        ↓
Team sends an invoice manually (Invoice Ninja / Zoho Invoice / PDF template)
        ↓
Client pays via bank transfer
        ↓
Team manually updates the account role in the admin panel
        ↓
Client receives an email: "Access granted — here's your login"
```

Time per onboarding: ~15 minutes. Sustainable up to ~20 clients/month.

### Nice to Have (after first sales)
- [ ] Stripe integration (automated payment + role assignment)
- [ ] Email notifications (results ready, respondent invitations)
- [ ] PDF generation (WeasyPrint or Puppeteer)
- [ ] Coupon / access codes for private clients

### Not Needed Now
- Stripe or any payment integration
- API
- Enterprise self-serve
- Custom branding
- SSO / SAML

---

## 9. Henkel Access — Interim Approach

Until full monetization is live, Henkel accesses the product via:
- A separate private URL (`/henkel/assessment`), or
- An account with Enterprise role manually assigned in the database

No development required — a feature flag or a role field in the user table is sufficient.

---

*This document is ready to be handed to a developer as part of the technical specification.*
