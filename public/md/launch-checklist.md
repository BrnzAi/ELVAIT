# ELVAIT Launch Checklist

**Date:** 2026-02-13  
**Status:** In Progress  
**Production URL:** https://elvait.brnz.live  
**Dev URL:** https://elvait-dev-{hash}.europe-west1.run.app (TBD)

---

## 🔴 BLOCKING: Pre-Launch Requirements

### 1. Development Environment Setup

Before launching, we need a separate dev environment:

```
□ Create dev Cloud SQL instance (elvait-db-dev)
□ Create dev Cloud Run service (elvait-dev)
□ Set up GitHub branch protection (main = production)
□ Create 'develop' branch for dev deployments
□ Configure CI/CD for branch-based deployment:
    - push to 'develop' → deploy to elvait-dev
    - push to 'main' → deploy to elvait (production)
□ Document dev workflow in README
```

### 2. Add DATABASE_URL Secret to GitHub

**Required for deployment to work!**

Go to: https://github.com/BrnzAi/ELVAIT/settings/secrets/actions

Add secret:
- **Name:** `DATABASE_URL`
- **Value:** `postgresql://elvait_user:Elv41t2026SecureDB!@104.155.70.144:5432/elvait`

```
□ DATABASE_URL secret added to GitHub
□ Trigger a deployment to verify
```

### 3. Database Persistence ✅

| Item | Status |
|------|--------|
| Cloud SQL instance | ✅ elvait-db (RUNNABLE) |
| Database | ✅ elvait |
| User | ✅ elvait_user |
| IP | ✅ 104.155.70.144 |

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

### Technical Infrastructure

| Item | Status | Details |
|------|--------|---------|
| Production URL | ✅ | https://elvait.brnz.live |
| SSL/HTTPS | ✅ | Valid certificate |
| Database | ✅ | PostgreSQL (Cloud SQL) |
| CI/CD | ✅ | GitHub Actions + Cloud Run |
| Auto-scaling | ✅ | 0-10 instances |
| Tests | ✅ | 437 passing |
| Dev environment | ⏳ | Needs setup |

---

## Development Workflow (After Setup)

### Making Changes

```
1. Create feature branch from 'develop'
   git checkout develop
   git checkout -b feature/my-feature

2. Make changes and commit
   git add -A
   git commit -m "feat: description"

3. Push to feature branch
   git push origin feature/my-feature

4. Create PR to 'develop' branch
   - CI runs tests
   - Review code

5. Merge to 'develop'
   - Auto-deploys to elvait-dev
   - Test on dev environment

6. Create PR from 'develop' to 'main'
   - Final review
   - Merge to deploy to production
```

### Environment URLs

| Environment | Branch | URL | Database |
|-------------|--------|-----|----------|
| Production | main | elvait.brnz.live | elvait-db |
| Development | develop | elvait-dev.*.run.app | elvait-db-dev |

---

## Launch Day Actions

### 1. Complete Pre-Launch Requirements

```
□ DATABASE_URL secret added to GitHub
□ Dev environment set up
□ Test deployment to dev
□ Test deployment to production
```

### 2. Final Smoke Test (15 min)

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

### 3. Verify Demo System

```
□ Visit /demo - wizard works
□ Login as Admin - dashboard loads
□ Login as Executive - assessments visible
□ View demo results - all components render
```

### 4. Documentation Access

```
□ /md/prd.md - loads with auth (dev/fjemba71)
□ /md/cases.md - loads with auth
□ /md/tests.md - loads with auth
```

---

## Browser & Device Testing

```
□ Chrome (desktop)
□ Firefox (desktop)
□ Safari (desktop)
□ Edge (desktop)
□ Mobile iOS Safari
□ Mobile Android Chrome
□ Tablet view
```

---

## Security Checklist

```
□ HTTPS enforced
□ Auth on /md/* routes working
□ No secrets in code
□ Database credentials secure
□ Survey tokens unguessable
□ Participant isolation (can't see others' answers)
```

---

## Known Limitations (Document for Users)

| Limitation | Workaround |
|------------|------------|
| No email notifications | Share survey links manually |
| No PDF export | Screenshot or copy results |
| No user accounts | Token-based access only |

---

## Rollback Plan

If critical issues arise:

1. **Revert code:**
   ```bash
   git revert HEAD
   git push origin main
   ```

2. **Rollback in Cloud Run:**
   - GCP Console → Cloud Run → elvait
   - Click "Revisions" → Route to previous

---

## Post-Launch Monitoring

### First 24 Hours
```
□ Monitor Cloud Run logs for errors
□ Check database connections stable
□ Verify survey links work
□ Confirm results calculate correctly
```

### First Week
```
□ Gather user feedback
□ Track error patterns
□ Note feature requests
□ Plan iteration priorities
```

---

## Launch Approval

| Role | Name | Approved |
|------|------|----------|
| Product Owner | __________ | □ |
| Dev Lead | __________ | □ |

**Launch Date:** ____________

---

## Quick Commands

```bash
# Check production status
curl -s https://elvait.brnz.live/api/cases | head -c 100

# View Cloud Run logs
gcloud run services logs read elvait --region=europe-west1 --limit=50

# View Cloud SQL status
gcloud sql instances describe elvait-db --project=githubgcdeploy

# Run tests locally
npm test

# Connect to database (requires Cloud SQL proxy)
psql "postgresql://elvait_user:PASSWORD@104.155.70.144:5432/elvait"
```

---

## Summary

**Status: Almost Ready**

- ✅ 437 automated tests passing
- ✅ Cloud SQL database created
- ✅ All critical flows verified
- ✅ Production URL working
- ⏳ DATABASE_URL secret needs adding to GitHub
- ⏳ Dev environment needs setup

**Next Steps:**
1. Add DATABASE_URL secret to GitHub
2. Set up dev environment
3. Run final smoke test
4. Launch! 🚀

---

*Checklist updated: 2026-02-13*  
*ELVAIT v1.1 (PostgreSQL)*
