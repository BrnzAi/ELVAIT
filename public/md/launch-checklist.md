# ELVAIT Launch Checklist

**Date:** 2026-02-13  
**Status:** Ready for Launch  
**URL:** https://elvait.brnz.live

---

## Pre-Launch Verification

### ✅ Core Functionality

| Item | Status | Verified |
|------|--------|----------|
| Create assessment wizard | Working | ✅ |
| Add participants | Working | ✅ |
| Survey link generation | Working | ✅ |
| Survey URL uses production domain | Working | ✅ |
| Survey submission | Working | ✅ |
| ICS calculation | Working | ✅ |
| Flag detection | Working | ✅ |
| Gate rules | Working | ✅ |
| Results dashboard | Working | ✅ |
| Recommendation display | Working | ✅ |

### ✅ All Kit Variants

| Variant | Roles | Tested |
|---------|-------|--------|
| Quick Check | Executive | ✅ |
| Core | Exec + Business + Tech | ✅ |
| Full | All 4 + Process | ✅ |
| Process Standalone | Process Owner | ✅ |

### ✅ Technical Infrastructure

| Item | Status | Details |
|------|--------|---------|
| Production URL | ✅ | https://elvait.brnz.live |
| SSL/HTTPS | ✅ | Valid certificate |
| Database | ✅ | SQLite (in-container) |
| CI/CD | ✅ | GitHub Actions + Cloud Run |
| Auto-scaling | ✅ | 0-10 instances |
| Tests | ✅ | 437 passing |

### ⚠️ Known Limitation: Database Persistence

SQLite data resets on container restart/redeploy. For MVP testing this is acceptable.

**Post-launch migration to PostgreSQL:**
- Cloud SQL instance ready: `elvait-db` (104.155.70.144)
- Database created: `elvait`
- User created: `elvait_user`
- Migration: Update schema + add DATABASE_URL secret

---

## Launch Day Actions

### 1. Final Smoke Test (15 min)

```
□ Go to https://elvait.brnz.live
□ Create a test assessment (Quick Check)
□ Add a participant
□ Copy survey link - verify it's NOT localhost
□ Open survey link in incognito
□ Complete the survey
□ View results - verify ICS and recommendation
□ Delete test assessment
```

### 2. Verify Demo System

```
□ Visit /demo - wizard works
□ Login as Admin - dashboard loads
□ Login as Executive - assessments visible
□ Login as other roles - survey view works
□ View demo results - all components render
```

### 3. Documentation Access

```
□ /md/prd.md - loads with auth (dev/fjemba71)
□ /md/cases.md - loads with auth
□ /md/tests.md - loads with auth
□ /md/2026-02-12-report.md - loads with auth
```

### 4. Monitoring Setup (Optional)

```
□ Check Cloud Run logs accessible
□ Set up uptime monitoring (e.g., UptimeRobot)
□ Configure error alerting
```

---

## User Onboarding Guide

### For First-Time Users

1. **Visit:** https://elvait.brnz.live
2. **Explore Demo:** Click "Try Demo" to see the platform
3. **Create Assessment:** Click "Start Assessment" when ready
4. **Follow Wizard:**
   - Step 1: Choose kit variant
   - Step 2: Enter decision details
   - Step 3: Answer framing questions
5. **Invite Participants:** Add people by role
6. **Share Links:** Copy unique survey URLs
7. **Wait for Responses:** Track progress on case page
8. **View Results:** See ICS, recommendation, flags

### For Survey Participants

1. Open the survey link you received
2. Read the decision context
3. Answer all questions honestly (1-5 scale)
4. Submit your responses
5. Done! (You won't see scores - only the initiator does)

---

## Key URLs Reference

| Purpose | URL |
|---------|-----|
| Home | https://elvait.brnz.live |
| Create Assessment | https://elvait.brnz.live/create |
| Demo | https://elvait.brnz.live/demo |
| Demo Login | https://elvait.brnz.live/demo/login |
| Admin Panel | https://elvait.brnz.live/demo/admin |
| Documentation | https://elvait.brnz.live/md/prd.md |

---

## Known Limitations

| Limitation | Workaround |
|------------|------------|
| No email notifications | Share survey links manually |
| No PDF export | Screenshot or copy results |
| Single database | Suitable for MVP scale |
| No user accounts | Token-based access only |

---

## Support Contacts

| Issue | Action |
|-------|--------|
| Bug found | Report via Discord #elvait |
| Feature request | Add to roadmap discussion |
| Production down | Check Cloud Run console |

---

## Rollback Plan

If critical issues arise:

1. **Revert to previous version:**
   ```bash
   git revert HEAD
   git push origin main
   ```
   CI/CD will auto-deploy the reverted code.

2. **Manual rollback in Cloud Run:**
   - Go to GCP Console → Cloud Run → elvait
   - Click "Revisions"
   - Route traffic to previous revision

---

## ⚠️ Pre-Production Security Lockdown

**IMPORTANT:** Before going live with real client data, the following security hardening MUST be completed:

### Current State (Testing/Feedback Phase)
The system is currently open for testing and feedback. This means:
- Demo user accounts can access system data
- Demo login credentials are publicly documented
- No penetration testing completed yet

### Pre-Production Security Checklist

```
□ Remove all demo access endpoints:
    - /demo/login (remove or password-protect)
    - /demo/admin (remove entirely)
    - /demo/dashboard, /demo/survey, /demo/results
□ Remove or disable demo user accounts from code
□ Remove hardcoded demo credentials
□ Full security audit using Kensai (www.kensai.app):
    - Vulnerability scanning
    - Penetration testing
    - Authentication testing
    - Authorization testing
    - Data exposure testing
□ Implement proper user authentication system
□ Add rate limiting to all API endpoints
□ Enable audit logging for all data access
□ Review and restrict CORS settings
□ Ensure all sensitive data encrypted at rest
□ Security sign-off before production data allowed
```

### Timeline
| Phase | Status | Security Level |
|-------|--------|----------------|
| Current: Testing/Feedback | Active | Open (demo access) |
| Pre-production: Security Lockdown | Pending | Full audit required |
| Production: Go-Live | Pending | Hardened + Tested |

**Note for IT Reviews:** If IT security reviews the current system, they will find demo user accesses that can reach system data. This is intentional for the testing phase. Full security lockdown will be completed before the product goes live with real client data.

---

## Post-Launch Priority Tasks

### 1. Migrate to PostgreSQL (Data Persistence)

```
□ Add DATABASE_URL secret to GitHub:
  postgresql://elvait_user:Elv41t2026SecureDB!@104.155.70.144:5432/elvait
□ Update prisma/schema.prisma: provider = "postgresql"
□ Update Dockerfile: remove SQLite init, add migration at startup
□ Deploy and verify data persists across restarts
```

### 2. Development Environment Setup

Before making any changes to production, set up a dev environment:

### Required Setup
```
□ Create 'develop' branch for dev deployments
□ Set up branch-based CI/CD:
    - push to 'develop' → deploy to elvait-dev
    - push to 'main' → deploy to elvait (production)
□ Create dev database (elvait_dev)
□ Configure DATABASE_URL_DEV secret in GitHub
□ Document dev workflow in README
```

### Development Workflow (After Setup)
1. Create feature branch from `develop`
2. Make changes, commit, push
3. Create PR to `develop` → auto-deploy to dev
4. Test on dev environment
5. Create PR from `develop` to `main` → deploy to production

### Environment URLs (Planned)
| Environment | Branch | URL |
|-------------|--------|-----|
| Production | main | elvait.brnz.live |
| Development | develop | elvait-dev.*.run.app |

---

## Post-Launch Monitoring

### First 24 Hours

```
□ Monitor Cloud Run logs for errors
□ Check database size growth
□ Verify survey links work
□ Confirm results calculate correctly
```

### First Week

```
□ Gather user feedback
□ Track any error patterns
□ Note feature requests
□ Plan iteration priorities
```

---

## Launch Approval

| Role | Name | Approved |
|------|------|----------|
| Product Owner | __________ | □ |
| Tech Lead | __________ | □ |
| QA | __________ | □ |

**Launch Date:** ____________

**Launch Time:** ____________

---

## Quick Commands

```bash
# Check deployment status
curl -s https://elvait.brnz.live/api/cases | head -c 100

# View recent logs (requires gcloud auth)
gcloud run services logs read elvait --region=europe-west1 --limit=50

# Run tests locally
cd ELVAIT && npm test

# Manual deploy
gcloud run deploy elvait --source . --region europe-west1
```

---

## Summary

**ELVAIT is ready for production use.**

- ✅ 437 automated tests passing
- ✅ All critical flows verified
- ✅ Production URL working
- ✅ Survey links use correct domain
- ✅ Demo system functional
- ✅ Documentation complete

**Recommended:** Run the smoke test checklist above before announcing to users.

---

*Checklist prepared: 2026-02-13*  
*ELVAIT v1.0*
