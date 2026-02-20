/**
 * Subscription Tier System
 * 
 * Tiers:
 * - free: 1 case, basic results
 * - starter: 3 cases, PDF export, 25 respondents
 * - professional: Unlimited cases, 100 respondents, limited customization
 * - enterprise: Everything + API + custom branding
 */

export type Tier = 'free' | 'starter' | 'professional' | 'enterprise';

export interface TierLimits {
  maxCases: number;
  maxRespondentsPerCase: number;
  canDownloadPDF: boolean;
  canCustomizeRoles: boolean;
  maxCustomRoles: number;
  canCustomizeQuestions: boolean;
  canViewCrossAnalytics: boolean;
  canUseAPI: boolean;
  canCustomBranding: boolean;
}

export const TIER_LIMITS: Record<Tier, TierLimits> = {
  free: {
    maxCases: 1,
    maxRespondentsPerCase: 10,
    canDownloadPDF: false,
    canCustomizeRoles: false,
    maxCustomRoles: 0,
    canCustomizeQuestions: false,
    canViewCrossAnalytics: false,
    canUseAPI: false,
    canCustomBranding: false,
  },
  starter: {
    maxCases: 3,
    maxRespondentsPerCase: 25,
    canDownloadPDF: true,
    canCustomizeRoles: false,
    maxCustomRoles: 0,
    canCustomizeQuestions: false,
    canViewCrossAnalytics: false,
    canUseAPI: false,
    canCustomBranding: false,
  },
  professional: {
    maxCases: Infinity,
    maxRespondentsPerCase: 100,
    canDownloadPDF: true,
    canCustomizeRoles: true,
    maxCustomRoles: 2,
    canCustomizeQuestions: true,
    canViewCrossAnalytics: true,
    canUseAPI: false,
    canCustomBranding: false,
  },
  enterprise: {
    maxCases: Infinity,
    maxRespondentsPerCase: Infinity,
    canDownloadPDF: true,
    canCustomizeRoles: true,
    maxCustomRoles: Infinity,
    canCustomizeQuestions: true,
    canViewCrossAnalytics: true,
    canUseAPI: true,
    canCustomBranding: true,
  },
};

export const TIER_PRICES: Record<Tier, string> = {
  free: 'Free',
  starter: '€79/decision',
  professional: '€149–299/month',
  enterprise: 'Custom',
};

export const TIER_NAMES: Record<Tier, string> = {
  free: 'Free',
  starter: 'Starter',
  professional: 'Professional',
  enterprise: 'Enterprise',
};

/**
 * Check if a user can create a new case
 */
export function canCreateCase(tier: Tier, currentCaseCount: number): { allowed: boolean; reason?: string } {
  const limits = TIER_LIMITS[tier];
  
  if (currentCaseCount >= limits.maxCases) {
    return {
      allowed: false,
      reason: tier === 'free' 
        ? "You've used your free assessment. Upgrade to create more."
        : `You've reached your limit of ${limits.maxCases} cases. Upgrade to create more.`,
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
      reason: `You've reached your limit of ${limits.maxRespondentsPerCase} respondents per case.`,
    };
  }
  
  return { allowed: true };
}

/**
 * Get the tier required for a specific feature
 */
export function getRequiredTierForFeature(feature: keyof TierLimits): Tier {
  const tiers: Tier[] = ['free', 'starter', 'professional', 'enterprise'];
  
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
 */
export interface ResultsAccess {
  // Tier 0 - Anonymous (always visible)
  canViewVerdict: boolean;
  canViewICS: boolean;
  visibleFlagsCount: number;
  canViewGenericSummary: boolean;
  canViewNextSteps: boolean;
  
  // Tier 1 - Free account
  canViewRoleBreakdown: boolean;
  canViewAllFlags: boolean;
  canViewContradictionMap: boolean;
  canSaveCase: boolean;
  
  // Tier 2+ - Paid
  canDownloadPDF: boolean;
}

/**
 * Get results page access based on auth state and tier
 */
export function getResultsAccess(isAuthenticated: boolean, tier: Tier | null): ResultsAccess {
  // Tier 0 - Anonymous
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
  
  // Tier 1 - Free account
  const tier1Access: ResultsAccess = {
    ...tier0Access,
    visibleFlagsCount: Infinity,
    canViewRoleBreakdown: true,
    canViewAllFlags: true,
    canViewContradictionMap: true,
    canSaveCase: true,
    canDownloadPDF: false,
  };
  
  if (tier === 'free') {
    return tier1Access;
  }
  
  // Tier 2+ - Paid
  return {
    ...tier1Access,
    canDownloadPDF: true,
  };
}
