/**
 * Decision Context Validation
 * 
 * Validates decision context input and enforces immutability rules.
 */

import { KitVariant, ALL_VARIANTS } from '../variants/types';

// =============================================================================
// TYPES
// =============================================================================

export interface CreateCaseInput {
  decisionTitle: string;
  variant: KitVariant;
  investmentType: string;
  decisionDescription: string;
  impactedAreas: string[];
  timeHorizon: string;
  estimatedInvestment?: string;
  dCtx1: string;
  dCtx2: string;
  dCtx3: string;
  dCtx4: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

// =============================================================================
// CONSTANTS
// =============================================================================

export const MAX_TITLE_LENGTH = 120;
export const MAX_DESCRIPTION_LENGTH = 500;
export const MAX_DCTX_LENGTH = 1000;

export const INVESTMENT_TYPES = [
  'AI solution / automation',
  'Software / digital tool',
  'External consultancy / system integrator'
] as const;

export const TIME_HORIZONS = [
  'Immediate',
  '3-6 months',
  '>6 months'
] as const;

export const ESTIMATED_INVESTMENTS = [
  '<€100k',
  '€100k-€500k',
  '€500k-€1m',
  '>€1m'
] as const;

// =============================================================================
// VALIDATION FUNCTIONS
// =============================================================================

/**
 * Validate case creation input.
 */
export function validateCreateCase(input: Partial<CreateCaseInput>): ValidationResult {
  const errors: ValidationError[] = [];
  
  // Decision Title (required, max 120 chars)
  if (!input.decisionTitle) {
    errors.push({ field: 'decisionTitle', message: 'Decision title is required' });
  } else if (input.decisionTitle.length > MAX_TITLE_LENGTH) {
    errors.push({ 
      field: 'decisionTitle', 
      message: `Decision title must be ${MAX_TITLE_LENGTH} characters or less` 
    });
  }
  
  // Variant (required, must be valid)
  if (!input.variant) {
    errors.push({ field: 'variant', message: 'Kit variant is required' });
  } else if (!ALL_VARIANTS.includes(input.variant)) {
    errors.push({ field: 'variant', message: 'Invalid kit variant' });
  }
  
  // Investment Type (required)
  if (!input.investmentType) {
    errors.push({ field: 'investmentType', message: 'Investment type is required' });
  } else if (!INVESTMENT_TYPES.includes(input.investmentType as any)) {
    errors.push({ field: 'investmentType', message: 'Invalid investment type' });
  }
  
  // Decision Description (required, max 500 chars)
  if (!input.decisionDescription) {
    errors.push({ field: 'decisionDescription', message: 'Decision description is required' });
  } else if (input.decisionDescription.length > MAX_DESCRIPTION_LENGTH) {
    errors.push({ 
      field: 'decisionDescription', 
      message: `Decision description must be ${MAX_DESCRIPTION_LENGTH} characters or less` 
    });
  }
  
  // Impacted Areas (required, array)
  if (!input.impactedAreas || !Array.isArray(input.impactedAreas) || input.impactedAreas.length === 0) {
    errors.push({ field: 'impactedAreas', message: 'At least one impacted area is required' });
  }
  
  // Time Horizon (required)
  if (!input.timeHorizon) {
    errors.push({ field: 'timeHorizon', message: 'Time horizon is required' });
  } else if (!TIME_HORIZONS.includes(input.timeHorizon as any)) {
    errors.push({ field: 'timeHorizon', message: 'Invalid time horizon' });
  }
  
  // Estimated Investment (optional, but if provided must be valid)
  if (input.estimatedInvestment && !ESTIMATED_INVESTMENTS.includes(input.estimatedInvestment as any)) {
    errors.push({ field: 'estimatedInvestment', message: 'Invalid estimated investment' });
  }
  
  // D-CTX-1 through D-CTX-4 (all required)
  if (!input.dCtx1) {
    errors.push({ field: 'dCtx1', message: 'D-CTX-1 is required: What decision are we actually trying to make?' });
  } else if (input.dCtx1.length > MAX_DCTX_LENGTH) {
    errors.push({ field: 'dCtx1', message: `D-CTX-1 must be ${MAX_DCTX_LENGTH} characters or less` });
  }
  
  if (!input.dCtx2) {
    errors.push({ field: 'dCtx2', message: 'D-CTX-2 is required: What will be different if this decision succeeds?' });
  } else if (input.dCtx2.length > MAX_DCTX_LENGTH) {
    errors.push({ field: 'dCtx2', message: `D-CTX-2 must be ${MAX_DCTX_LENGTH} characters or less` });
  }
  
  if (!input.dCtx3) {
    errors.push({ field: 'dCtx3', message: 'D-CTX-3 is required: What happens if we do nothing?' });
  } else if (input.dCtx3.length > MAX_DCTX_LENGTH) {
    errors.push({ field: 'dCtx3', message: `D-CTX-3 must be ${MAX_DCTX_LENGTH} characters or less` });
  }
  
  if (!input.dCtx4) {
    errors.push({ field: 'dCtx4', message: 'D-CTX-4 is required: What would make this decision a mistake in hindsight?' });
  } else if (input.dCtx4.length > MAX_DCTX_LENGTH) {
    errors.push({ field: 'dCtx4', message: `D-CTX-4 must be ${MAX_DCTX_LENGTH} characters or less` });
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Check if decision title can be modified.
 * Returns false if first response has been submitted.
 */
export function canModifyTitle(firstResponseAt: Date | null): boolean {
  return firstResponseAt === null;
}

/**
 * Check if variant can be changed.
 * Returns false if first response has been submitted.
 */
export function canChangeVariant(firstResponseAt: Date | null): boolean {
  return firstResponseAt === null;
}

/**
 * Validate title modification attempt.
 */
export function validateTitleModification(
  currentTitle: string,
  newTitle: string,
  firstResponseAt: Date | null
): ValidationResult {
  const errors: ValidationError[] = [];
  
  // Check immutability
  if (!canModifyTitle(firstResponseAt)) {
    errors.push({
      field: 'decisionTitle',
      message: 'Decision title cannot be modified after the first participant response'
    });
    return { valid: false, errors };
  }
  
  // Validate new title
  if (!newTitle) {
    errors.push({ field: 'decisionTitle', message: 'Decision title is required' });
  } else if (newTitle.length > MAX_TITLE_LENGTH) {
    errors.push({
      field: 'decisionTitle',
      message: `Decision title must be ${MAX_TITLE_LENGTH} characters or less`
    });
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

export default validateCreateCase;
