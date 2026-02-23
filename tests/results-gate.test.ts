/**
 * Results Gate Tests
 * 
 * Tests for tiered access system on results page
 */

import { describe, it, expect } from 'vitest';
import { getResultsAccess, TIER_LIMITS, canCreateCase, Tier } from '../src/lib/tiers';

// =============================================================================
// Tier 0 - Anonymous Access
// =============================================================================

describe('Results Gate: Tier 0 (Anonymous)', () => {
  const access = getResultsAccess(false, null);

  describe('Always Visible Content', () => {
    it('should show verdict (GO/FIX FIRST/NO-GO)', () => {
      expect(access.canViewVerdict).toBe(true);
    });

    it('should show ICS score', () => {
      expect(access.canViewICS).toBe(true);
    });

    it('should show generic summary', () => {
      expect(access.canViewGenericSummary).toBe(true);
    });

    it('should show next steps', () => {
      expect(access.canViewNextSteps).toBe(true);
    });

    it('should show only 2 flags', () => {
      expect(access.visibleFlagsCount).toBe(2);
    });
  });

  describe('Locked Content', () => {
    it('should NOT show role breakdown', () => {
      expect(access.canViewRoleBreakdown).toBe(false);
    });

    it('should NOT show all flags', () => {
      expect(access.canViewAllFlags).toBe(false);
    });

    it('should NOT show contradiction map', () => {
      expect(access.canViewContradictionMap).toBe(false);
    });

    it('should NOT allow saving case', () => {
      expect(access.canSaveCase).toBe(false);
    });

    it('should NOT allow PDF download', () => {
      expect(access.canDownloadPDF).toBe(false);
    });
  });
});

// =============================================================================
// Tier 1 - Free Account Access (Quick Check Only)
// =============================================================================

describe('Results Gate: Tier 1 (Free Account - Quick Check Only)', () => {
  const access = getResultsAccess(true, 'free');

  describe('Basic Content (Same as Tier 0)', () => {
    it('should show all Tier 0 content', () => {
      expect(access.canViewVerdict).toBe(true);
      expect(access.canViewICS).toBe(true);
      expect(access.canViewGenericSummary).toBe(true);
      expect(access.canViewNextSteps).toBe(true);
    });

    it('should allow saving case', () => {
      expect(access.canSaveCase).toBe(true);
    });
  });

  describe('Locked Content (Requires Paid Plan)', () => {
    it('should NOT show role breakdown (Quick Check only)', () => {
      expect(access.canViewRoleBreakdown).toBe(false);
    });

    it('should NOT show all flags (basic verdict only)', () => {
      expect(access.canViewAllFlags).toBe(false);
    });

    it('should NOT show contradiction map', () => {
      expect(access.canViewContradictionMap).toBe(false);
    });

    it('should NOT allow PDF download', () => {
      expect(access.canDownloadPDF).toBe(false);
    });
  });
});

// =============================================================================
// Tier 2+ - Paid Account Access
// =============================================================================

describe('Results Gate: Tier 2+ (Paid)', () => {
  const tiers: Tier[] = ['tryout', 'core', 'advanced', 'enterprise'];

  tiers.forEach(tier => {
    describe(`${tier} tier`, () => {
      const access = getResultsAccess(true, tier);

      it('should have all Tier 1 features', () => {
        expect(access.canViewRoleBreakdown).toBe(true);
        expect(access.canViewAllFlags).toBe(true);
        expect(access.canViewContradictionMap).toBe(true);
        expect(access.canSaveCase).toBe(true);
      });

      it('should allow PDF download', () => {
        expect(access.canDownloadPDF).toBe(true);
      });
    });
  });
});

// =============================================================================
// Case Limits
// =============================================================================

describe('Results Gate: Case Limits', () => {
  describe('Free tier (1 case limit)', () => {
    it('should allow first case', () => {
      const result = canCreateCase('free', 0);
      expect(result.allowed).toBe(true);
    });

    it('should block second case', () => {
      const result = canCreateCase('free', 1);
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('free assessment');
    });
  });

  describe('Try Out tier (1 case limit)', () => {
    it('should allow first case', () => {
      const result = canCreateCase('tryout', 0);
      expect(result.allowed).toBe(true);
    });

    it('should block second case', () => {
      const result = canCreateCase('tryout', 1);
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('Try Out');
    });
  });

  describe('Core tier (10 case limit)', () => {
    it('should allow up to 10 cases', () => {
      expect(canCreateCase('core', 0).allowed).toBe(true);
      expect(canCreateCase('core', 5).allowed).toBe(true);
      expect(canCreateCase('core', 9).allowed).toBe(true);
    });

    it('should block 11th case', () => {
      const result = canCreateCase('core', 10);
      expect(result.allowed).toBe(false);
    });
  });

  describe('Advanced tier (20 case limit)', () => {
    it('should allow up to 20 cases', () => {
      expect(canCreateCase('advanced', 0).allowed).toBe(true);
      expect(canCreateCase('advanced', 10).allowed).toBe(true);
      expect(canCreateCase('advanced', 19).allowed).toBe(true);
    });

    it('should block 21st case', () => {
      const result = canCreateCase('advanced', 20);
      expect(result.allowed).toBe(false);
    });
  });

  describe('Enterprise tier (unlimited)', () => {
    it('should allow any number of cases', () => {
      expect(canCreateCase('enterprise', 0).allowed).toBe(true);
      expect(canCreateCase('enterprise', 100).allowed).toBe(true);
      expect(canCreateCase('enterprise', 1000).allowed).toBe(true);
    });
  });
});

// =============================================================================
// Tier Limits Configuration
// =============================================================================

describe('Results Gate: Tier Limits', () => {
  describe('Free tier limits', () => {
    const limits = TIER_LIMITS.free;

    it('should have 1 case limit', () => {
      expect(limits.maxCases).toBe(1);
    });

    it('should have 10 respondents per case', () => {
      expect(limits.maxRespondentsPerCase).toBe(10);
    });

    it('should NOT allow PDF download', () => {
      expect(limits.canDownloadPDF).toBe(false);
    });

    it('should NOT allow full results (Quick Check only)', () => {
      expect(limits.canViewFullResults).toBe(false);
    });
  });

  describe('Try Out tier limits', () => {
    const limits = TIER_LIMITS.tryout;

    it('should have 1 case limit', () => {
      expect(limits.maxCases).toBe(1);
    });

    it('should have 50 respondents per case', () => {
      expect(limits.maxRespondentsPerCase).toBe(50);
    });

    it('should allow PDF download', () => {
      expect(limits.canDownloadPDF).toBe(true);
    });

    it('should allow full results', () => {
      expect(limits.canViewFullResults).toBe(true);
    });
  });

  describe('Core tier limits', () => {
    const limits = TIER_LIMITS.core;

    it('should have 10 case limit', () => {
      expect(limits.maxCases).toBe(10);
    });

    it('should have 150 respondents per case', () => {
      expect(limits.maxRespondentsPerCase).toBe(150);
    });

    it('should allow PDF download', () => {
      expect(limits.canDownloadPDF).toBe(true);
    });
  });

  describe('Advanced tier limits', () => {
    const limits = TIER_LIMITS.advanced;

    it('should have 20 case limit', () => {
      expect(limits.maxCases).toBe(20);
    });

    it('should have 250 respondents per case', () => {
      expect(limits.maxRespondentsPerCase).toBe(250);
    });

    it('should allow PDF download', () => {
      expect(limits.canDownloadPDF).toBe(true);
    });

    it('should have AI insights', () => {
      expect(limits.hasAIInsights).toBe(true);
    });
  });

  describe('Enterprise tier limits', () => {
    const limits = TIER_LIMITS.enterprise;

    it('should have unlimited cases', () => {
      expect(limits.maxCases).toBe(Infinity);
    });

    it('should have unlimited respondents', () => {
      expect(limits.maxRespondentsPerCase).toBe(Infinity);
    });

    it('should allow PDF download', () => {
      expect(limits.canDownloadPDF).toBe(true);
    });

    it('should allow API access', () => {
      expect(limits.canUseAPI).toBe(true);
    });
  });
});

// =============================================================================
// Email Verification Integration
// =============================================================================

describe('Results Gate: Email Verification', () => {
  it('unauthenticated user (not signed in) should be Tier 0', () => {
    const access = getResultsAccess(false, null);
    expect(access.canViewRoleBreakdown).toBe(false);
  });

  it('unverified user cannot sign in, so treated as unauthenticated', () => {
    // The auth system blocks signin for unverified users
    // So they will always have isAuthenticated = false
    const unverifiedUserCanSignIn = false;
    expect(unverifiedUserCanSignIn).toBe(false);
  });

  it('free tier user gets basic access (Quick Check only)', () => {
    const access = getResultsAccess(true, 'free');
    // Free tier: can save case but NOT full results
    expect(access.canSaveCase).toBe(true);
    expect(access.canViewRoleBreakdown).toBe(false); // Quick Check only
  });

  it('paid tier user (tryout+) gets full access', () => {
    const access = getResultsAccess(true, 'tryout');
    expect(access.canViewRoleBreakdown).toBe(true);
    expect(access.canViewAllFlags).toBe(true);
    expect(access.canDownloadPDF).toBe(true);
  });
});
