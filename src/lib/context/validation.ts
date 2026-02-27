/**
 * Decision Context Validation
 * 
 * Validates decision context input and enforces immutability rules.
 */

import { KitVariant, ALL_VARIANTS } from '../variants/types';

// =============================================================================
// TYPES
// =============================================================================

export interface ProcessInput {
  name: string;
  description?: string;
  weight?: number;
}

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
  processes?: ProcessInput[];
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

// Process validation constants
export const MAX_PROCESS_NAME_LENGTH = 80;
export const MAX_PROCESS_DESCRIPTION_LENGTH = 200;
export const MIN_PROCESSES = 1;
export const MAX_PROCESSES = 5;

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
    errors.push({ field: 'variant', message: 'Please select a valid assessment type' });
  }
  
  // Investment Type (required)
  if (!input.investmentType) {
    errors.push({ field: 'investmentType', message: 'Investment type is required' });
  } else if (!INVESTMENT_TYPES.includes(input.investmentType as any)) {
    errors.push({ field: 'investmentType', message: 'Please select a valid investment type' });
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
    errors.push({ field: 'timeHorizon', message: 'Please select a valid time horizon' });
  }
  
  // Estimated Investment (optional, but if provided must be valid)
  if (input.estimatedInvestment && !ESTIMATED_INVESTMENTS.includes(input.estimatedInvestment as any)) {
    errors.push({ field: 'estimatedInvestment', message: 'Please select a valid estimated investment range' });
  }
  
  // D-CTX-1 through D-CTX-4 (all required)
  if (!input.dCtx1) {
    errors.push({ field: 'dCtx1', message: 'Please answer: What decision are we actually trying to make?' });
  } else if (input.dCtx1.length > MAX_DCTX_LENGTH) {
    errors.push({ field: 'dCtx1', message: `Answer to 'What decision are we trying to make?' must be ${MAX_DCTX_LENGTH} characters or less` });
  }
  
  if (!input.dCtx2) {
    errors.push({ field: 'dCtx2', message: 'Please answer: What will be different if this decision succeeds?' });
  } else if (input.dCtx2.length > MAX_DCTX_LENGTH) {
    errors.push({ field: 'dCtx2', message: `Answer to 'What will be different?' must be ${MAX_DCTX_LENGTH} characters or less` });
  }
  
  if (!input.dCtx3) {
    errors.push({ field: 'dCtx3', message: 'Please answer: What happens if we do nothing?' });
  } else if (input.dCtx3.length > MAX_DCTX_LENGTH) {
    errors.push({ field: 'dCtx3', message: `Answer to 'What happens if we do nothing?' must be ${MAX_DCTX_LENGTH} characters or less` });
  }
  
  if (!input.dCtx4) {
    errors.push({ field: 'dCtx4', message: 'Please answer: What would make this decision a mistake in hindsight?' });
  } else if (input.dCtx4.length > MAX_DCTX_LENGTH) {
    errors.push({ field: 'dCtx4', message: `Answer to 'What would make this a mistake?' must be ${MAX_DCTX_LENGTH} characters or less` });
  }
  
  // Validate processes (if variant supports it)
  if (input.variant) {
    const processValidation = validateProcesses(input.processes, input.variant);
    errors.push(...processValidation.errors);
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

/**
 * Validate processes array for variants that support process naming.
 */
export function validateProcesses(processes: ProcessInput[] | undefined, variant: KitVariant): ValidationResult {
  const errors: ValidationError[] = [];
  
  // Check if variant supports process naming
  const supportsProcessNaming = variant === 'FULL' || variant === 'PROCESS_STANDALONE';
  
  if (!supportsProcessNaming) {
    // For variants that don't support process naming, silently ignore any processes
    return { valid: true, errors: [] };
  }
  
  // If no processes provided for supported variants, we'll auto-create a default one
  if (!processes || processes.length === 0) {
    return { valid: true, errors: [] };
  }
  
  // Validate process count
  if (processes.length < MIN_PROCESSES) {
    errors.push({ 
      field: 'processes', 
      message: `At least ${MIN_PROCESSES} process is required` 
    });
  }
  
  if (processes.length > MAX_PROCESSES) {
    errors.push({ 
      field: 'processes', 
      message: `Maximum ${MAX_PROCESSES} processes allowed` 
    });
  }
  
  // Track process names for uniqueness check
  const processNames = new Set<string>();
  let totalWeight = 0;
  
  // Validate each process
  processes.forEach((process, index) => {
    const prefix = `processes[${index}]`;
    
    // Validate name
    if (!process.name) {
      errors.push({ 
        field: `${prefix}.name`, 
        message: 'Process name is required' 
      });
    } else {
      // Check length
      if (process.name.length > MAX_PROCESS_NAME_LENGTH) {
        errors.push({ 
          field: `${prefix}.name`, 
          message: `Process name must be ${MAX_PROCESS_NAME_LENGTH} characters or less` 
        });
      }
      
      // Check uniqueness
      const lowercaseName = process.name.toLowerCase();
      if (processNames.has(lowercaseName)) {
        errors.push({ 
          field: `${prefix}.name`, 
          message: 'Process names must be unique within the case' 
        });
      } else {
        processNames.add(lowercaseName);
      }
    }
    
    // Validate description (optional)
    if (process.description && process.description.length > MAX_PROCESS_DESCRIPTION_LENGTH) {
      errors.push({ 
        field: `${prefix}.description`, 
        message: `Process description must be ${MAX_PROCESS_DESCRIPTION_LENGTH} characters or less` 
      });
    }
    
    // Validate weight (optional, defaults to equal distribution)
    if (process.weight !== undefined) {
      if (typeof process.weight !== 'number' || process.weight < 1 || process.weight > 100) {
        errors.push({ 
          field: `${prefix}.weight`, 
          message: 'Process weight must be a number between 1 and 100' 
        });
      } else {
        totalWeight += process.weight;
      }
    }
  });
  
  // If any weights are provided, validate they sum to 100
  const hasWeights = processes.some(p => p.weight !== undefined);
  if (hasWeights) {
    // Check if all processes have weights
    const allHaveWeights = processes.every(p => p.weight !== undefined);
    if (!allHaveWeights) {
      errors.push({ 
        field: 'processes', 
        message: 'If any process has a weight, all processes must have weights' 
      });
    } else if (totalWeight !== 100) {
      errors.push({ 
        field: 'processes', 
        message: `Process weights must sum to 100 (currently: ${totalWeight})` 
      });
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Normalize processes array - auto-distribute weights if not provided.
 */
export function normalizeProcesses(processes: ProcessInput[] | undefined, variant: KitVariant): ProcessInput[] {
  const supportsProcessNaming = variant === 'FULL' || variant === 'PROCESS_STANDALONE';
  
  if (!supportsProcessNaming) {
    return [];
  }
  
  // If no processes provided, create default
  if (!processes || processes.length === 0) {
    return [{
      name: 'Main Process',
      weight: 100
    }];
  }
  
  // If no weights provided, distribute equally
  const hasWeights = processes.some(p => p.weight !== undefined);
  if (!hasWeights) {
    const equalWeight = Math.floor(100 / processes.length);
    const remainder = 100 - (equalWeight * processes.length);
    
    return processes.map((process, index) => ({
      ...process,
      weight: index === 0 ? equalWeight + remainder : equalWeight
    }));
  }
  
  return processes;
}

export default validateCreateCase;
