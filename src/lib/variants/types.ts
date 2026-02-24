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
    description: 'Rapid executive clarity signal focused on strategic intent',
    estimatedTime: '15 minutes',
    purpose: 'Tests whether the initiative is conceptually sound before involving the wider organization.'
  },
  CORE: {
    name: 'Decision Clarity',
    description: 'Cross-functional alignment assessment',
    estimatedTime: '45 minutes total',
    purpose: 'Identifies contradictions between intent, value expectations, and implementation reality — before investment commitment.'
  },
  FULL: {
    name: 'Full Assessment',
    description: 'The 360° Clarity Before Automation assessment',
    estimatedTime: '60+ minutes total',
    purpose: 'Evaluates strategic intent, value logic, technical feasibility, process stability, and operational reality — detecting structural risks before automation amplifies them.'
  },
  PROCESS_STANDALONE: {
    name: 'Process Readiness Scan',
    description: 'Process maturity and operational stability assessment',
    estimatedTime: '20 minutes',
    purpose: 'Ensures automation will not institutionalize inefficiencies or unclear ownership.'
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
