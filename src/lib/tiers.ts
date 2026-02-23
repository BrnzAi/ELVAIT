/**
 * Subscription Tier System
 * 
 * Tiers (as of 2026-02-23):
 * - free: 1 case, 10 respondents, Quick Check only, basic verdict
 * - tryout: 1 case, 50 respondents, Full Standard, €199/3mo (credited to Core)
 * - core: 10 cases, 150 respondents, PDF reports, €1,900/yr
 * - advanced: 20 cases, 250 respondents, AI insights, €3,500/yr
 * - enterprise: Unlimited, API, full customization, Custom pricing
 */

export type Tier = 'free' | 'tryout' | 'core' | 'advanced' | 'enterprise';

export interface TierLimits {
  maxCases: number;
  maxRespondentsPerCase: number;
  canDownloadPDF: boolean;
  canViewFullResults: boolean;
  canCustomizeRoles: boolean;
  maxCustomRoles: number;
  canCustomizeQuestions: boolean;
  canViewCrossAnalytics: boolean;
  canUseAPI: boolean;
  canCustomBranding: boolean;
  hasAIInsights: boolean;
}

export const TIER_LIMITS: Record<Tier, TierLimits> = {
  free: {
    maxCases: 1,
    maxRespondentsPerCase: 10,
    canDownloadPDF: false,
    canViewFullResults: false, // Quick Check only, basic verdict
    canCustomizeRoles: false,
    maxCustomRoles: 0,
    canCustomizeQuestions: false,
    canViewCrossAnalytics: false,
    canUseAPI: false,
    canCustomBranding: false,
    hasAIInsights: false,
  },
  tryout: {
    maxCases: 1,
    maxRespondentsPerCase: 50,
    canDownloadPDF: true,
    canViewFullResults: true, // Full Standard assessment
    canCustomizeRoles: false,
    maxCustomRoles: 0,
    canCustomizeQuestions: false,
    canViewCrossAnalytics: false,
    canUseAPI: false,
    canCustomBranding: false,
    hasAIInsights: false,
  },
  core: {
    maxCases: 10,
    maxRespondentsPerCase: 150,
    canDownloadPDF: true,
    canViewFullResults: true,
    canCustomizeRoles: false,
    maxCustomRoles: 0,
    canCustomizeQuestions: false,
    canViewCrossAnalytics: false,
    canUseAPI: false,
    canCustomBranding: false,
    hasAIInsights: false,
  },
  advanced: {
    maxCases: 20,
    maxRespondentsPerCase: 250,
    canDownloadPDF: true,
    canViewFullResults: true,
    canCustomizeRoles: true,
    maxCustomRoles: 2,
    canCustomizeQuestions: true,
    canViewCrossAnalytics: true,
    canUseAPI: false,
    canCustomBranding: false,
    hasAIInsights: true, // AI clarity narrative, blind spot analysis
  },
  enterprise: {
    maxCases: Infinity,
    maxRespondentsPerCase: Infinity,
    canDownloadPDF: true,
    canViewFullResults: true,
    canCustomizeRoles: true,
    maxCustomRoles: Infinity,
    canCustomizeQuestions: true,
    canViewCrossAnalytics: true,
    canUseAPI: true,
    canCustomBranding: true,
    hasAIInsights: true,
  },
};

export const TIER_PRICES: Record<Tier, string> = {
  free: '€0',
  tryout: '€199/3 months',
  core: '€1,900/year',
  advanced: '€3,500/year',
  enterprise: 'Custom',
};

export const TIER_NAMES: Record<Tier, string> = {
  free: 'Free',
  tryout: 'Try Out',
  core: 'Core',
  advanced: 'Advanced',
  enterprise: 'Enterprise',
};

/**
 * Check if a user can create a new case
 */
export function canCreateCase(tier: Tier, currentCaseCount: number): { allowed: boolean; reason?: string } {
  const limits = TIER_LIMITS[tier];
  
  if (currentCaseCount >= limits.maxCases) {
    if (tier === 'free') {
      return {
        allowed: false,
        reason: "You've used your free assessment. Upgrade to Try Out (€199) or Core (€1,900/year) to create more.",
      };
    }
    if (tier === 'tryout') {
      return {
        allowed: false,
        reason: "Try Out includes 1 assessment. Upgrade to Core (€1,900/year) for up to 10 assessments.",
      };
    }
    return {
      allowed: false,
      reason: `You've reached your limit of ${limits.maxCases} assessments. Contact us to upgrade.`,
    };
  }
  
  return { allowed: true };
}

/**
 * Check if a user can add more respondents to a case
 */
export function canAddRespondent(tier: Tier, currentRespondentCount: number): { allowed: boolean; reason?: string } {
  const limits = TIER_LIMITS[tier];
  
  if (currentRespondentCount >= limits.maxRespondentsPerCase) {
    return {
      allowed: false,
      reason: `You've reached your limit of ${limits.maxRespondentsPerCase} respondents per assessment. Upgrade for more.`,
    };
  }
  
  return { allowed: true };
}

/**
 * Get the tier required for a specific feature
 */
export function getRequiredTierForFeature(feature: keyof TierLimits): Tier {
  const tiers: Tier[] = ['free', 'tryout', 'core', 'advanced', 'enterprise'];
  
  for (const tier of tiers) {
    const limits = TIER_LIMITS[tier];
    const value = limits[feature];
    
    if (typeof value === 'boolean' && value === true) {
      return tier;
    }
    if (typeof value === 'number' && value > 0) {
      return tier;
    }
  }
  
  return 'enterprise';
}

/**
 * Check if a tier includes a specific feature
 */
export function tierHasFeature(tier: Tier, feature: keyof TierLimits): boolean {
  const limits = TIER_LIMITS[tier];
  const value = limits[feature];
  
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'number') {
    return value > 0;
  }
  
  return false;
}

/**
 * Results page access levels
 * 
 * Tier 0 (Anonymous): Basic verdict, ICS, 2 flags
 * Tier 1 (Free verified): Still basic - Quick Check only
 * Tier 2+ (Paid): Full results, PDF, etc.
 */
export interface ResultsAccess {
  // Tier 0 - Anonymous (always visible)
  canViewVerdict: boolean;
  canViewICS: boolean;
  visibleFlagsCount: number;
  canViewGenericSummary: boolean;
  canViewNextSteps: boolean;
  
  // Tier 1+ - Authenticated with paid plan
  canViewRoleBreakdown: boolean;
  canViewAllFlags: boolean;
  canViewContradictionMap: boolean;
  canSaveCase: boolean;
  
  // Tier 2+ - Paid (tryout and above)
  canDownloadPDF: boolean;
}

/**
 * Get results page access based on auth state and tier
 * 
 * Note: Free tier only gets Quick Check with basic verdict.
 * Full results require Try Out (€199) or higher.
 */
export function getResultsAccess(isAuthenticated: boolean, tier: Tier | null): ResultsAccess {
  // Tier 0 - Anonymous (basic verdict only)
  const tier0Access: ResultsAccess = {
    canViewVerdict: true,
    canViewICS: true,
    visibleFlagsCount: 2,
    canViewGenericSummary: true,
    canViewNextSteps: true,
    canViewRoleBreakdown: false,
    canViewAllFlags: false,
    canViewContradictionMap: false,
    canSaveCase: false,
    canDownloadPDF: false,
  };
  
  if (!isAuthenticated || !tier) {
    return tier0Access;
  }
  
  // Free tier - still basic (Quick Check only)
  // Can save case but doesn't get full results
  if (tier === 'free') {
    return {
      ...tier0Access,
      canSaveCase: true, // Can save their assessment
    };
  }
  
  // Paid tiers (tryout, core, advanced, enterprise) - full results
  const paidAccess: ResultsAccess = {
    canViewVerdict: true,
    canViewICS: true,
    visibleFlagsCount: Infinity,
    canViewGenericSummary: true,
    canViewNextSteps: true,
    canViewRoleBreakdown: true,
    canViewAllFlags: true,
    canViewContradictionMap: true,
    canSaveCase: true,
    canDownloadPDF: true,
  };
  
  return paidAccess;
}

/**
 * Legacy tier mapping for backward compatibility
 * Maps old tier names to new ones
 */
export function normalizeTier(tier: string | null | undefined): Tier {
  if (!tier) return 'free';
  
  const lowerTier = tier.toLowerCase();
  
  // Map old tier names to new ones
  const legacyMap: Record<string, Tier> = {
    'free': 'free',
    'starter': 'tryout', // Old starter → Try Out
    'professional': 'core', // Old professional → Core (closest match)
    'enterprise': 'enterprise',
    // New tier names
    'tryout': 'tryout',
    'core': 'core',
    'advanced': 'advanced',
  };
  
  return legacyMap[lowerTier] || 'free';
}
