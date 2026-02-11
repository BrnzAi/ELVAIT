/**
 * Kit Variant Types
 * 
 * Type definitions for the four kit variants and their configurations.
 */

import { Role } from '../questions/types';

// =============================================================================
// KIT VARIANTS
// =============================================================================

export type KitVariant = 
  | 'QUICK_CHECK' 
  | 'CORE' 
  | 'FULL' 
  | 'PROCESS_STANDALONE';

export const ALL_VARIANTS: KitVariant[] = [
  'QUICK_CHECK',
  'CORE',
  'FULL',
  'PROCESS_STANDALONE'
];

// =============================================================================
// VARIANT DISPLAY INFO
// =============================================================================

export interface VariantDisplayInfo {
  name: string;
  description: string;
  estimatedTime: string;
  purpose: string;
}

export const VARIANT_DISPLAY: Record<KitVariant, VariantDisplayInfo> = {
  QUICK_CHECK: {
    name: 'Quick Check',
    description: 'Fast executive signal',
    estimatedTime: '15 minutes',
    purpose: 'Get a rapid assessment of decision clarity from executive perspective only.'
  },
  CORE: {
    name: 'Decision Clarity (Core)',
    description: 'Investment-grade assessment',
    estimatedTime: '45 minutes total',
    purpose: 'Comprehensive assessment with Executive, Business Owner, and Technical Owner perspectives.'
  },
  FULL: {
    name: 'Decision + Process Reality (Full)',
    description: 'Automation-safe assessment',
    estimatedTime: '60+ minutes total',
    purpose: 'Complete assessment including process readiness evaluation. Required for automation decisions.'
  },
  PROCESS_STANDALONE: {
    name: 'Process Check (Standalone)',
    description: 'Process readiness only',
    estimatedTime: '20 minutes',
    purpose: 'Assess process readiness independently. Does not produce ICS score.'
  }
};

// =============================================================================
// VARIANT CONFIGURATION
// =============================================================================

export interface VariantConfig {
  /** Roles that participate in this variant */
  activeRoles: Role[];
  
  /** Weight coefficients for ICS calculation (must sum to 1.0 for active roles) */
  weights: Partial<Record<Role, number>>;
  
  /** Whether this variant computes ICS */
  computeIcs: boolean;
  
  /** Whether process score acts as a gate (Full kit only) */
  processIsGate: boolean;
  
  /** Whether users contribute signals (not to ICS) */
  usersContributeSignals: boolean;
}

// =============================================================================
// ROLE WEIGHT TYPES
// =============================================================================

export interface RoleWeight {
  role: Role;
  weight: number;
}

// =============================================================================
// VARIANT SELECTION
// =============================================================================

export interface VariantSelection {
  variant: KitVariant;
  selectedAt: Date;
  lockedAt?: Date; // Set when first response is received
}
