# Authentication Implementation Plan

## Overview
Implement user authentication for ELVAIT with the following flow:
- **Anonymous users** can start assessments and see results
- **Authenticated users** can save results, track history, and manage assessments
- Prompt to sign up/sign in when trying to save or on results page

## Tech Stack
- **NextAuth.js** (next-auth v5) - Industry standard for Next.js auth
- **Credentials provider** - Email/password authentication
- **Prisma adapter** - User storage in PostgreSQL
- **bcrypt** - Password hashing
- **Email service** - Already implemented (nodemailer)

---

## Database Changes

### New Models (Prisma)

```prisma
model User {
  id              String    @id @default(cuid())
  email           String    @unique
  emailVerified   DateTime?
  passwordHash    String
  name            String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  // Relations
  cases           DecisionCase[]
  sessions        Session[]
  verificationTokens VerificationToken[]
  passwordResetTokens PasswordResetToken[]
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expires      DateTime
}

model VerificationToken {
  id         String   @id @default(cuid())
  token      String   @unique
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expires    DateTime
  createdAt  DateTime @default(now())
}

model PasswordResetToken {
  id         String   @id @default(cuid())
  token      String   @unique
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expires    DateTime
  createdAt  DateTime @default(now())
}
```

### Update DecisionCase
```prisma
model DecisionCase {
  // ... existing fields ...
  userId    String?  // Optional - null for anonymous
  user      User?    @relation(fields: [userId], references: [id])
}
```

---

## Implementation Tasks

### Task 1: Database Schema
- [ ] Add User, Session, VerificationToken, PasswordResetToken models
- [ ] Add userId to DecisionCase
- [ ] Run prisma migrate

### Task 2: Install Dependencies
- [ ] next-auth (v5 beta for app router)
- [ ] bcryptjs + @types/bcryptjs

### Task 3: Auth Configuration
- [ ] Create `src/lib/auth/config.ts` - NextAuth config
- [ ] Create `src/lib/auth/providers.ts` - Credentials provider
- [ ] Create `src/app/api/auth/[...nextauth]/route.ts` - API route

### Task 4: Auth Utilities
- [ ] `src/lib/auth/password.ts` - Hash/verify passwords
- [ ] `src/lib/auth/tokens.ts` - Generate/verify tokens
- [ ] `src/lib/auth/session.ts` - Get current user helper

### Task 5: Sign Up Flow
- [ ] `src/app/(auth)/signup/page.tsx` - Sign up form
- [ ] `src/app/api/auth/signup/route.ts` - Create user API
- [ ] Send verification email
- [ ] `src/app/(auth)/verify-email/page.tsx` - Email verification

### Task 6: Sign In Flow
- [ ] `src/app/(auth)/signin/page.tsx` - Sign in form
- [ ] Handle credentials validation
- [ ] Redirect after login

### Task 7: Password Recovery
- [ ] `src/app/(auth)/forgot-password/page.tsx` - Request reset
- [ ] `src/app/api/auth/forgot-password/route.ts` - Send reset email
- [ ] `src/app/(auth)/reset-password/page.tsx` - Set new password
- [ ] `src/app/api/auth/reset-password/route.ts` - Update password

### Task 8: Auth UI Components
- [ ] `src/components/auth/SignInForm.tsx`
- [ ] `src/components/auth/SignUpForm.tsx`
- [ ] `src/components/auth/UserMenu.tsx` - Header dropdown
- [ ] `src/components/auth/AuthPrompt.tsx` - Save results prompt

### Task 9: Integrate with Results
- [ ] On results page, show "Save your results" prompt if not logged in
- [ ] Allow claiming anonymous assessment after sign up
- [ ] Update DecisionCase with userId when claimed

### Task 10: Protected Routes
- [ ] Update middleware for protected routes
- [ ] Add auth check to API routes that need it

---

## Email Templates

### Verification Email
```
Subject: Verify your ELVAIT account

Hi {name},

Please verify your email by clicking the link below:
{verifyUrl}

This link expires in 24 hours.

— ELVAIT Team
```

### Password Reset Email
```
Subject: Reset your ELVAIT password

Hi {name},

Click the link below to reset your password:
{resetUrl}

This link expires in 1 hour.

If you didn't request this, ignore this email.

— ELVAIT Team
```

---

## UI Flow

### Anonymous User Journey
1. User visits `/create` → creates assessment
2. Completes survey
3. Sees results page
4. **Prompt: "Sign up to save your results"**
5. Signs up → assessment linked to account

### Returning User Journey
1. User signs in
2. Dashboard shows their assessments
3. Can create new or view past results

---

## File Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── signin/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── verify-email/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   └── api/auth/
│       ├── [...nextauth]/route.ts
│       ├── signup/route.ts
│       ├── forgot-password/route.ts
│       └── reset-password/route.ts
├── components/auth/
│   ├── SignInForm.tsx
│   ├── SignUpForm.tsx
│   ├── UserMenu.tsx
│   └── AuthPrompt.tsx
└── lib/auth/
    ├── config.ts
    ├── password.ts
    ├── tokens.ts
    └── session.ts
```

---

## Security Considerations

- Passwords hashed with bcrypt (cost factor 12)
- Tokens are random 32-byte hex strings
- Reset tokens expire in 1 hour
- Verification tokens expire in 24 hours
- Rate limiting on auth endpoints (future)
- CSRF protection via NextAuth

---

## Acceptance Criteria

1. ✅ User can sign up with email/password
2. ✅ User receives verification email
3. ✅ User can sign in after verification
4. ✅ User can reset password via email
5. ✅ Anonymous assessments work without auth
6. ✅ Results page prompts to save if not logged in
7. ✅ Assessment linked to user after sign up
8. ✅ Header shows user menu when logged in
