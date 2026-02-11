/**
 * Kit Variant Configuration
 * 
 * Defines the exact configuration for each kit variant including:
 * - Which roles are active
 * - Weight coefficients for ICS calculation
 * - Whether ICS is computed
 * - Whether process acts as a gate
 */

import { Role } from '../questions/types';
import { KitVariant, VariantConfig } from './types';

// =============================================================================
// VARIANT CONFIGURATIONS
// =============================================================================

export const VARIANT_CONFIG: Record<KitVariant, VariantConfig> = {
  /**
   * QUICK CHECK
   * - Executive only (100% weight)
   * - Fast signal, computes ICS
   */
  QUICK_CHECK: {
    activeRoles: ['EXEC'],
    weights: { EXEC: 1.0 },
    computeIcs: true,
    processIsGate: false,
    usersContributeSignals: false
  },

  /**
   * CORE (Decision Clarity)
   * - Executive (50%), Business (25%), Tech (25%)
   * - Investment-grade assessment
   */
  CORE: {
    activeRoles: ['EXEC', 'BUSINESS_OWNER', 'TECH_OWNER'],
    weights: { 
      EXEC: 0.50, 
      BUSINESS_OWNER: 0.25, 
      TECH_OWNER: 0.25 
    },
    computeIcs: true,
    processIsGate: false,
    usersContributeSignals: false
  },

  /**
   * FULL (Decision + Process Reality)
   * - Executive (40%), Business (20%), Tech (20%), Process (20%)
   * - Process score is a GATE, not an ICS term
   * - Users contribute signals to G3 (adoption risk) but not to ICS
   */
  FULL: {
    activeRoles: ['EXEC', 'BUSINESS_OWNER', 'TECH_OWNER', 'PROCESS_OWNER'],
    weights: { 
      EXEC: 0.40, 
      BUSINESS_OWNER: 0.20, 
      TECH_OWNER: 0.20, 
      PROCESS_OWNER: 0.20 
    },
    computeIcs: true,
    processIsGate: true,
    usersContributeSignals: true
  },

  /**
   * PROCESS STANDALONE
   * - Process Owner only (100%)
   * - Does NOT compute ICS
   * - Only produces Process Readiness Score
   */
  PROCESS_STANDALONE: {
    activeRoles: ['PROCESS_OWNER'],
    weights: { PROCESS_OWNER: 1.0 },
    computeIcs: false,
    processIsGate: false,
    usersContributeSignals: false
  }
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get the configuration for a kit variant
 */
export function getVariantConfig(variant: KitVariant): VariantConfig {
  return VARIANT_CONFIG[variant];
}

/**
 * Check if a role is active in a variant
 */
export function isRoleActive(variant: KitVariant, role: Role): boolean {
  return VARIANT_CONFIG[variant].activeRoles.includes(role);
}

/**
 * Get the weight for a role in a variant (0 if not active)
 */
export function getRoleWeight(variant: KitVariant, role: Role): number {
  return VARIANT_CONFIG[variant].weights[role] ?? 0;
}

/**
 * Get all active roles for a variant
 */
export function getActiveRoles(variant: KitVariant): Role[] {
  return VARIANT_CONFIG[variant].activeRoles;
}

/**
 * Check if ICS should be computed for a variant
 */
export function shouldComputeIcs(variant: KitVariant): boolean {
  return VARIANT_CONFIG[variant].computeIcs;
}

/**
 * Check if process score acts as a gate for a variant
 */
export function isProcessGate(variant: KitVariant): boolean {
  return VARIANT_CONFIG[variant].processIsGate;
}

/**
 * Validate that weights sum to 1.0 for active roles that contribute to ICS
 * (Process owner weight only applies to process score, not ICS)
 */
export function validateVariantWeights(variant: KitVariant): boolean {
  const config = VARIANT_CONFIG[variant];
  
  if (!config.computeIcs) {
    return true; // No ICS means no weight validation needed
  }
  
  // For FULL variant, process weight is for process score, not ICS
  // ICS is computed from EXEC, BUSINESS, TECH only
  const icsRoles: Role[] = variant === 'FULL' 
    ? ['EXEC', 'BUSINESS_OWNER', 'TECH_OWNER']
    : config.activeRoles.filter(r => r !== 'PROCESS_OWNER');
  
  const totalWeight = icsRoles.reduce(
    (sum, role) => sum + (config.weights[role] ?? 0), 
    0
  );
  
  // Allow small floating point tolerance
  return Math.abs(totalWeight - 1.0) < 0.001;
}

/**
 * Get ICS-contributing roles for a variant
 * Note: For FULL variant, ICS is still D1-D5 only (Process is a gate)
 */
export function getIcsRoles(variant: KitVariant): Role[] {
  const config = VARIANT_CONFIG[variant];
  
  if (!config.computeIcs) {
    return [];
  }
  
  // Process Owner contributes to Process Score (gate), not ICS
  return config.activeRoles.filter(r => r !== 'PROCESS_OWNER');
}

/**
 * Get ICS weights for a variant (excluding process)
 */
export function getIcsWeights(variant: KitVariant): Record<Role, number> {
  const config = VARIANT_CONFIG[variant];
  const icsRoles = getIcsRoles(variant);
  
  const weights: Partial<Record<Role, number>> = {};
  
  for (const role of icsRoles) {
    weights[role] = config.weights[role] ?? 0;
  }
  
  return weights as Record<Role, number>;
}

/**
 * Get display-friendly variant name
 */
export function getVariantDisplayName(variant: KitVariant): string {
  const names: Record<KitVariant, string> = {
    QUICK_CHECK: 'Quick Check',
    CORE: 'Decision Clarity (Core)',
    FULL: 'Decision + Process Reality (Full)',
    PROCESS_STANDALONE: 'Process Check (Standalone)'
  };
  return names[variant];
}

/**
 * Validate all variant configurations at startup
 */
export function validateAllVariants(): boolean {
  for (const variant of Object.keys(VARIANT_CONFIG) as KitVariant[]) {
    if (!validateVariantWeights(variant)) {
      console.error(`Invalid weights for variant ${variant}`);
      return false;
    }
  }
  return true;
}

export default VARIANT_CONFIG;
