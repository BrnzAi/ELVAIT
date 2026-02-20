# Results Gate — Implementation Plan

## Overview
Implement tiered access system with results gating to convert anonymous users to registered accounts.

---

## Task Breakdown

### Phase 1: Database Schema Updates ✅ COMPLETED

**Task 1.1: Add subscription tier to User model** ✅
- Added `tier` field to User model (free | starter | professional | enterprise)
- Migration: `20260220143000_add_user_tier`

**Task 1.2: Ownership tracking** ✅
- `userId` and `createdBy` fields already exist on DecisionCase

---

### Phase 2: Results Page Gating ✅ COMPLETED

**Task 2.1: Create LockedOverlay component** ✅
- `src/components/results/LockedOverlay.tsx`
- Blur + lock icon + click handler

**Task 2.2: Create UnlockModal component** ✅
- `src/components/results/UnlockModal.tsx`
- Separate content for Tier 1 (free registration) and Tier 2+ (upgrade)

**Task 2.3: Update Results page with tiered content** ✅
- Tier 0: Verdict, ICS score, 2 flags, generic summary
- Tier 1+: Role breakdown, all flags
- Tier 2+: PDF download button

**Task 2.4: Create tier access logic** ✅
- `src/lib/tiers.ts` with `getResultsAccess()` function

---

### Phase 3: Registration Flow Updates ✅ COMPLETED

**Task 3.1: Update sign-up with returnTo support** ✅
- `returnTo` query param support on `/signup` and `/signin`
- Auto sign-in after registration when returnTo is present
- Redirects back to results page
- Suspense boundaries added for SSR

**Task 3.2: Add Google OAuth** 
- Deferred — not required for MVP

**Task 3.3: Instant results unlock after registration** ✅
- No email verification required
- Toast notification possible via client-side

---

### Phase 4: Case Limits & Upgrade Prompts ✅ COMPLETED

**Task 4.1: Implement case limit checking** ✅
- `TIER_LIMITS` in `src/lib/tiers.ts`
- Backend enforcement in `POST /api/cases`

**Task 4.2: Update /create page** ✅
- Checks case limit before showing form
- Shows upgrade prompt if limit reached

**Task 4.3: Dashboard upgrade prompts**
- Future: Show case count vs limit on dashboard

---

### Phase 5: Pricing Page / Contact Form ✅ COMPLETED

**Task 5.1: Create /pricing page** ✅
- `src/app/pricing/page.tsx`
- Comparison table for all tiers

**Task 5.2: Create contact form** ✅
- `src/app/contact/page.tsx`
- `POST /api/contact` sends email notification
- Plan preselection via query param

---

### Phase 6: Admin Panel ✅ COMPLETED

**Task 6.1: Add user tier management** ✅
- `src/app/admin/users/page.tsx`
- View all users with tier/case count
- One-click tier change buttons

**Task 6.2: Admin auth** ✅
- Admin check via email domain (@brnz.ai, @elvait.ai)

---

## Acceptance Criteria

- [x] Anonymous user sees Tier 0 results (verdict, ICS, 2 flags, generic summary)
- [x] Role breakdown and extra flags are blurred with lock overlay
- [x] Clicking locked content opens modal with sign-up CTA
- [x] After registration, user returns to same results page, now unlocked
- [x] Case is auto-saved to user's account (via userId on create)
- [x] Free user limited to 1 active case
- [x] Attempting to create 2nd case shows upgrade prompt
- [x] Pricing page shows all tiers with "Contact us" CTA
- [x] Admin can manually change user tier
- [x] Download PDF locked for free tier

---

## Remaining / Future Work

1. **Case claim flow** — Allow users to claim anonymous cases they created before registering
2. **Dashboard enhancements** — Show case count/limit, upgrade prompts
3. **Google OAuth** — Optional social login
4. **PDF generation** — Actual PDF export functionality for Tier 2+
5. **Email verification** — Optional email verification flow

---

*Status: Core feature complete. All acceptance criteria met.*
