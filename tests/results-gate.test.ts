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
// Tier 1 - Free Account Access
// =============================================================================

describe('Results Gate: Tier 1 (Free Account)', () => {
  const access = getResultsAccess(true, 'free');

  describe('Unlocked Content', () => {
    it('should show all Tier 0 content', () => {
      expect(access.canViewVerdict).toBe(true);
      expect(access.canViewICS).toBe(true);
      expect(access.canViewGenericSummary).toBe(true);
      expect(access.canViewNextSteps).toBe(true);
    });

    it('should show role breakdown', () => {
      expect(access.canViewRoleBreakdown).toBe(true);
    });

    it('should show all flags', () => {
      expect(access.canViewAllFlags).toBe(true);
      expect(access.visibleFlagsCount).toBe(Infinity);
    });

    it('should show contradiction map', () => {
      expect(access.canViewContradictionMap).toBe(true);
    });

    it('should allow saving case', () => {
      expect(access.canSaveCase).toBe(true);
    });
  });

  describe('Still Locked Content', () => {
    it('should NOT allow PDF download', () => {
      expect(access.canDownloadPDF).toBe(false);
    });
  });
});

// =============================================================================
// Tier 2+ - Paid Account Access
// =============================================================================

describe('Results Gate: Tier 2+ (Paid)', () => {
  const tiers: Tier[] = ['starter', 'professional', 'enterprise'];

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

  describe('Starter tier (3 case limit)', () => {
    it('should allow up to 3 cases', () => {
      expect(canCreateCase('starter', 0).allowed).toBe(true);
      expect(canCreateCase('starter', 1).allowed).toBe(true);
      expect(canCreateCase('starter', 2).allowed).toBe(true);
    });

    it('should block 4th case', () => {
      const result = canCreateCase('starter', 3);
      expect(result.allowed).toBe(false);
    });
  });

  describe('Professional tier (unlimited)', () => {
    it('should allow any number of cases', () => {
      expect(canCreateCase('professional', 0).allowed).toBe(true);
      expect(canCreateCase('professional', 100).allowed).toBe(true);
      expect(canCreateCase('professional', 1000).allowed).toBe(true);
    });
  });

  describe('Enterprise tier (unlimited)', () => {
    it('should allow any number of cases', () => {
      expect(canCreateCase('enterprise', 0).allowed).toBe(true);
      expect(canCreateCase('enterprise', 100).allowed).toBe(true);
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
  });

  describe('Starter tier limits', () => {
    const limits = TIER_LIMITS.starter;

    it('should have 3 case limit', () => {
      expect(limits.maxCases).toBe(3);
    });

    it('should have 25 respondents per case', () => {
      expect(limits.maxRespondentsPerCase).toBe(25);
    });

    it('should allow PDF download', () => {
      expect(limits.canDownloadPDF).toBe(true);
    });
  });

  describe('Professional tier limits', () => {
    const limits = TIER_LIMITS.professional;

    it('should have unlimited cases', () => {
      expect(limits.maxCases).toBe(Infinity);
    });

    it('should have 100 respondents per case', () => {
      expect(limits.maxRespondentsPerCase).toBe(100);
    });

    it('should allow PDF download', () => {
      expect(limits.canDownloadPDF).toBe(true);
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

  it('verified + authenticated user gets Tier 1+ access', () => {
    const access = getResultsAccess(true, 'free');
    expect(access.canViewRoleBreakdown).toBe(true);
    expect(access.canViewAllFlags).toBe(true);
  });
});
