# Results Gate — Implementation Plan

## Overview
Implement tiered access system with results gating to convert anonymous users to registered accounts.

---

## Task Breakdown

### Phase 1: Database Schema Updates

**Task 1.1: Add subscription tier to User model**
```prisma
model User {
  // ... existing fields
  tier        String   @default("free")  // free | starter | professional | enterprise
  company     String?
  caseLimit   Int      @default(1)       // Derived from tier, but can be overridden
}
```

**Task 1.2: Add ownership tracking to DecisionCase**
```prisma
model DecisionCase {
  // ... existing fields
  userId      String?   // Already exists from auth update
  claimedAt   DateTime? // When anonymous case was claimed
}
```

---

### Phase 2: Results Page Gating

**Task 2.1: Create LockedOverlay component**
- CSS blur(4px) + pointer-events: none
- Lock icon + label overlay
- onClick opens unlock modal

**Task 2.2: Create UnlockModal component**
- For Tier 1 features: "Free with account" messaging
- For Tier 2+ features: Pricing info + "See all plans"
- Sign in / Sign up buttons

**Task 2.3: Update Results page with tiered content**
- Always visible (Tier 0):
  - Verdict (GO / FIX FIRST / NO-GO)
  - ICS score
  - 2 top flags (rest blurred)
  - Generic summary
  - Next steps (generic)
- Tier 1+ (blurred for anonymous):
  - Role breakdown
  - All flags with details
  - Contradiction map
- Tier 2+ (locked for free):
  - Download PDF button

**Task 2.4: Create results access hook**
```typescript
useResultsAccess(caseId: string) {
  // Returns: { tier, canViewRoles, canViewAllFlags, canDownloadPDF, ... }
}
```

---

### Phase 3: Registration Flow Updates

**Task 3.1: Update sign-up to skip email verification for results unlock**
- Add `returnTo` query param support
- After signup, redirect back to results page
- Auto-claim the case being viewed

**Task 3.2: Add Google OAuth**
- NextAuth Google provider
- Same flow: redirect back to results after auth

**Task 3.3: Instant results unlock after registration**
- No email verification required for Tier 1 access
- Case automatically linked to account
- Toast: "Results saved to your account"

---

### Phase 4: Case Limits & Upgrade Prompts

**Task 4.1: Implement case limit checking**
```typescript
canCreateCase(userId: string): { allowed: boolean; reason?: string }
```

**Task 4.2: Update /create page**
- Check case limit before allowing creation
- Show upgrade modal if limit reached

**Task 4.3: Update Dashboard**
- Show case count vs limit
- "New Assessment" button → upgrade prompt if at limit

---

### Phase 5: Pricing Page / Modal

**Task 5.1: Create /pricing page**
- Comparison table (Free / Starter / Professional / Enterprise)
- "Contact us" CTA for all paid plans
- Link to contact form

**Task 5.2: Create PricingModal component**
- Same content as page, in modal form
- Used when clicking locked features

**Task 5.3: Create contact form**
- Fields: Name, Email, Company, Desired Plan, Message
- Sends email notification to team
- Or: simple mailto link

---

### Phase 6: Admin Panel Updates

**Task 6.1: Add user tier management**
- `/admin/users` page (extend existing demo admin)
- View/edit user tier
- View user's cases

**Task 6.2: Real admin auth**
- Admin role check middleware
- Separate from demo admin

---

## File Changes Summary

```
src/
├── app/
│   ├── (auth)/
│   │   └── signup/page.tsx          # Update: returnTo support
│   ├── api/auth/
│   │   └── [...nextauth]/route.ts   # Update: Google OAuth
│   ├── cases/[id]/results/
│   │   └── page.tsx                 # Update: tiered content
│   ├── pricing/
│   │   └── page.tsx                 # New: pricing page
│   ├── contact/
│   │   └── page.tsx                 # New: contact form
│   └── admin/
│       └── users/
│           └── page.tsx             # New: real admin
├── components/
│   ├── results/
│   │   ├── LockedOverlay.tsx        # New
│   │   ├── UnlockModal.tsx          # New
│   │   ├── RoleBreakdown.tsx        # New (extracted)
│   │   ├── FlagsList.tsx            # New (extracted)
│   │   └── ContradictionMap.tsx     # New
│   └── pricing/
│       ├── PricingTable.tsx         # New
│       └── PricingModal.tsx         # New
├── hooks/
│   └── useResultsAccess.ts          # New
└── lib/
    └── tiers.ts                     # New: tier logic
```

---

## Implementation Order

1. **Database** — Add tier field to User
2. **Tier logic** — Create lib/tiers.ts with permissions
3. **LockedOverlay** — Reusable blur component
4. **UnlockModal** — Registration prompt modal
5. **Results page** — Integrate gating
6. **Sign-up flow** — returnTo + auto-claim
7. **Case limits** — Check on create
8. **Pricing page** — Static for now
9. **Contact form** — Email notification
10. **Admin** — Tier management

---

## Acceptance Criteria

- [ ] Anonymous user sees Tier 0 results (verdict, ICS, 2 flags, generic summary)
- [ ] Role breakdown and extra flags are blurred with lock overlay
- [ ] Clicking locked content opens modal with sign-up CTA
- [ ] After registration, user returns to same results page, now unlocked
- [ ] Case is auto-saved to user's account
- [ ] Free user limited to 1 active case
- [ ] Attempting to create 2nd case shows upgrade prompt
- [ ] Pricing page shows all tiers with "Contact us" CTA
- [ ] Admin can manually change user tier
- [ ] Download PDF locked for free tier

---

*Estimated effort: 2-3 days*
