/**
 * Investment Clarity Score (ICS) Calculation
 * 
 * BLOCKER RULE:
 * ICS = D1*0.20 + D2*0.25 + D3*0.20 + D4*0.20 + D5*0.15
 * 
 * Process dimension (P) NEVER enters ICS formula - it's a gate only.
 * ICS is only computed for variants where computeIcs = true.
 */

import { CaseDimensionScores } from './dimensions';
import { roundScore, getIcsLabel, getIcsLabelShort } from './normalise';
import { KitVariant } from '../variants/types';
import { shouldComputeIcs } from '../variants/config';

// =============================================================================
// ICS WEIGHTS (IMMUTABLE)
// =============================================================================

/**
 * ICS dimension weights.
 * BLOCKER: These weights must be exactly as specified in the PRD.
 */
export const ICS_WEIGHTS = {
  D1: 0.20,
  D2: 0.25,
  D3: 0.20,
  D4: 0.20,
  D5: 0.15
} as const;

// Validate weights sum to 1.0
const WEIGHT_SUM = Object.values(ICS_WEIGHTS).reduce((a, b) => a + b, 0);
if (Math.abs(WEIGHT_SUM - 1.0) > 0.001) {
  throw new Error(`ICS weights must sum to 1.0, got ${WEIGHT_SUM}`);
}

// =============================================================================
// ICS CALCULATION
// =============================================================================

export interface IcsResult {
  /** ICS value (0-100) or null if cannot be computed */
  ics: number | null;
  
  /** Human-readable label */
  label: string | null;
  
  /** Short label */
  labelShort: string | null;
  
  /** Whether ICS was computed (false for PROCESS_STANDALONE) */
  computed: boolean;
  
  /** Breakdown of dimension contributions */
  breakdown: {
    D1: { score: number | null; weight: number; contribution: number | null };
    D2: { score: number | null; weight: number; contribution: number | null };
    D3: { score: number | null; weight: number; contribution: number | null };
    D4: { score: number | null; weight: number; contribution: number | null };
    D5: { score: number | null; weight: number; contribution: number | null };
  };
}

/**
 * Calculate Investment Clarity Score (ICS).
 * 
 * BLOCKER FORMULA:
 * ICS = D1*0.20 + D2*0.25 + D3*0.20 + D4*0.20 + D5*0.15
 * 
 * @param caseDimScores - Dimension scores for the case
 * @param variant - Kit variant
 * @returns ICS result with value, label, and breakdown
 */
export function computeIcs(
  caseDimScores: CaseDimensionScores,
  variant: KitVariant
): IcsResult {
  // Check if ICS should be computed for this variant
  if (!shouldComputeIcs(variant)) {
    return {
      ics: null,
      label: null,
      labelShort: null,
      computed: false,
      breakdown: {
        D1: { score: caseDimScores.D1, weight: ICS_WEIGHTS.D1, contribution: null },
        D2: { score: caseDimScores.D2, weight: ICS_WEIGHTS.D2, contribution: null },
        D3: { score: caseDimScores.D3, weight: ICS_WEIGHTS.D3, contribution: null },
        D4: { score: caseDimScores.D4, weight: ICS_WEIGHTS.D4, contribution: null },
        D5: { score: caseDimScores.D5, weight: ICS_WEIGHTS.D5, contribution: null }
      }
    };
  }
  
  // Calculate contributions for each dimension
  const d1Contrib = caseDimScores.D1 !== null ? caseDimScores.D1 * ICS_WEIGHTS.D1 : null;
  const d2Contrib = caseDimScores.D2 !== null ? caseDimScores.D2 * ICS_WEIGHTS.D2 : null;
  const d3Contrib = caseDimScores.D3 !== null ? caseDimScores.D3 * ICS_WEIGHTS.D3 : null;
  const d4Contrib = caseDimScores.D4 !== null ? caseDimScores.D4 * ICS_WEIGHTS.D4 : null;
  const d5Contrib = caseDimScores.D5 !== null ? caseDimScores.D5 * ICS_WEIGHTS.D5 : null;
  
  // Build breakdown
  const breakdown = {
    D1: { score: caseDimScores.D1, weight: ICS_WEIGHTS.D1, contribution: d1Contrib },
    D2: { score: caseDimScores.D2, weight: ICS_WEIGHTS.D2, contribution: d2Contrib },
    D3: { score: caseDimScores.D3, weight: ICS_WEIGHTS.D3, contribution: d3Contrib },
    D4: { score: caseDimScores.D4, weight: ICS_WEIGHTS.D4, contribution: d4Contrib },
    D5: { score: caseDimScores.D5, weight: ICS_WEIGHTS.D5, contribution: d5Contrib }
  };
  
  // Check if we have enough data to compute ICS
  const contributions = [d1Contrib, d2Contrib, d3Contrib, d4Contrib, d5Contrib];
  const validContributions = contributions.filter(c => c !== null) as number[];
  
  // If no valid contributions, return null
  if (validContributions.length === 0) {
    return {
      ics: null,
      label: null,
      labelShort: null,
      computed: true,
      breakdown
    };
  }
  
  // Calculate ICS
  // Note: If some dimensions are missing, we still compute with available data
  // but this should be flagged as incomplete
  const ics = contributions.reduce<number>((sum, c) => sum + (c ?? 0), 0);
  
  // Round to 1 decimal place
  const roundedIcs = roundScore(ics, 1);
  
  return {
    ics: roundedIcs,
    label: getIcsLabel(roundedIcs),
    labelShort: getIcsLabelShort(roundedIcs),
    computed: true,
    breakdown
  };
}

/**
 * Get ICS bucket for learning/anonymization.
 * Used in DecisionPatternRecord (no PII).
 */
export function getIcsBucket(ics: number | null): string {
  if (ics === null) return 'N/A';
  if (ics < 55) return '0-55';
  if (ics < 75) return '55-75';
  return '75-100';
}

/**
 * Check if ICS meets threshold for GO recommendation.
 * (Before considering flags and gates)
 */
export function icsAllowsGo(ics: number | null): boolean {
  return ics !== null && ics >= 75;
}

/**
 * Check if ICS is in CLARIFY range.
 */
export function icsInClarifyRange(ics: number | null): boolean {
  return ics !== null && ics >= 55 && ics < 75;
}

/**
 * Check if ICS triggers NO_GO.
 */
export function icsTriggersNoGo(ics: number | null): boolean {
  return ics !== null && ics < 55;
}

// =============================================================================
// PROCESS SCORE (SEPARATE FROM ICS)
// =============================================================================

/**
 * Calculate Process Readiness Score.
 * This is separate from ICS and acts as a gate in Full variant.
 * 
 * @param caseDimScores - Dimension scores (P dimension)
 * @returns Process score (0-100) or null
 */
export function computeProcessScore(
  caseDimScores: CaseDimensionScores
): number | null {
  return caseDimScores.P;
}

/**
 * Get process readiness classification.
 */
export function getProcessReadinessClass(
  processScore: number | null
): 'Automate' | 'Improve first' | 'Clarify ownership' | 'Defer' | null {
  if (processScore === null) return null;
  
  if (processScore >= 75) return 'Automate';
  if (processScore >= 60) return 'Improve first';
  if (processScore >= 45) return 'Clarify ownership';
  return 'Defer';
}

export default computeIcs;
