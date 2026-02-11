/**
 * Recommendation Engine
 * 
 * CRITICAL: This engine produces GO/CLARIFY/NO_GO recommendations.
 * The recommendation is ALWAYS rule-derived.
 * AI NEVER decides GO/CLARIFY/NO_GO - AI is only for narratives.
 * 
 * Decision Rules:
 * 1. PROCESS_STANDALONE → no recommendation (null)
 * 2. ICS < 55 OR any CRITICAL flag → NO_GO
 * 3. Any gate triggered → CLARIFY
 * 4. 55 ≤ ICS < 75 → CLARIFY
 * 5. ICS ≥ 75, no CRITICAL flags, no gates → GO
 */

import { Recommendation, Flag } from '../questions/types';
import { IcsResult } from '../scoring/ics';
import { KitVariant } from '../variants/types';
import { shouldComputeIcs } from '../variants/config';
import { FlagEngineResult } from '../flags/engine';
import { GateEvaluationResult } from '../gates/rules';

// =============================================================================
// THRESHOLDS
// =============================================================================

const ICS_NO_GO_THRESHOLD = 55;  // Below this → NO_GO
const ICS_GO_THRESHOLD = 75;     // At or above this (with no flags/gates) → GO

// =============================================================================
// TYPES
// =============================================================================

export interface RecommendationResult {
  /** The recommendation: GO, CLARIFY, NO_GO, or null */
  recommendation: Recommendation | null;
  
  /** Why this recommendation was made */
  reason: string;
  
  /** Primary factor driving the recommendation */
  primaryFactor: 'ICS_LOW' | 'ICS_MID' | 'ICS_HIGH' | 'CRITICAL_FLAG' | 'GATE_TRIGGERED' | 'NOT_COMPUTED';
  
  /** All factors that influenced the decision */
  factors: string[];
  
  /** Whether AI can override (always false) */
  aiCanOverride: false;
}

// =============================================================================
// RECOMMENDATION ENGINE
// =============================================================================

/**
 * Compute the final recommendation.
 * 
 * BLOCKER: AI NEVER touches this function.
 * AI only generates text AFTER recommendation is set.
 * 
 * @param icsResult - ICS calculation result
 * @param flagResult - Flag engine result
 * @param gateResult - Gate evaluation result
 * @param variant - Kit variant
 * @returns RecommendationResult
 */
export function computeRecommendation(
  icsResult: IcsResult,
  flagResult: FlagEngineResult,
  gateResult: GateEvaluationResult,
  variant: KitVariant
): RecommendationResult {
  const factors: string[] = [];
  
  // Rule 1: PROCESS_STANDALONE never produces ICS or recommendation
  if (!shouldComputeIcs(variant)) {
    return {
      recommendation: null,
      reason: 'Process Standalone variant does not produce an ICS or recommendation. Only Process Readiness Score is generated.',
      primaryFactor: 'NOT_COMPUTED',
      factors: ['Variant is PROCESS_STANDALONE'],
      aiCanOverride: false
    };
  }
  
  // Check if ICS was computed
  if (icsResult.ics === null) {
    return {
      recommendation: null,
      reason: 'Insufficient data to compute ICS. More responses needed.',
      primaryFactor: 'NOT_COMPUTED',
      factors: ['ICS could not be computed due to missing data'],
      aiCanOverride: false
    };
  }
  
  const ics = icsResult.ics;
  
  // Rule 2: CRITICAL flag OR ICS < 55 → NO_GO
  if (flagResult.hasCritical) {
    const criticalFlags = flagResult.flags
      .filter(f => f.severity === 'CRITICAL')
      .map(f => f.flag_id);
    
    factors.push(`CRITICAL flags detected: ${criticalFlags.join(', ')}`);
    factors.push(`ICS = ${ics.toFixed(1)}`);
    
    return {
      recommendation: 'NO_GO',
      reason: `CRITICAL flag(s) detected: ${criticalFlags.join(', ')}. Recommendation is NO_GO regardless of ICS (${ics.toFixed(1)}).`,
      primaryFactor: 'CRITICAL_FLAG',
      factors,
      aiCanOverride: false
    };
  }
  
  if (ics < ICS_NO_GO_THRESHOLD) {
    factors.push(`ICS = ${ics.toFixed(1)} (below ${ICS_NO_GO_THRESHOLD} threshold)`);
    
    return {
      recommendation: 'NO_GO',
      reason: `ICS (${ics.toFixed(1)}) is below the ${ICS_NO_GO_THRESHOLD} threshold. Investment clarity is insufficient.`,
      primaryFactor: 'ICS_LOW',
      factors,
      aiCanOverride: false
    };
  }
  
  // Rule 3: Any gate triggered → CLARIFY
  if (gateResult.hasGates) {
    const gateIds = Array.from(gateResult.gateIds);
    const gateDetails = gateResult.gates.map(g => g.flag ?? g.gate);
    
    factors.push(`Gates triggered: ${gateIds.join(', ')}`);
    factors.push(`ICS = ${ics.toFixed(1)}`);
    
    return {
      recommendation: 'CLARIFY',
      reason: `Gate(s) triggered: ${gateDetails.join(', ')}. Clarification needed before proceeding.`,
      primaryFactor: 'GATE_TRIGGERED',
      factors,
      aiCanOverride: false
    };
  }
  
  // Rule 4: ICS in 55-74 → CLARIFY
  if (ics < ICS_GO_THRESHOLD) {
    factors.push(`ICS = ${ics.toFixed(1)} (in CLARIFY range ${ICS_NO_GO_THRESHOLD}-${ICS_GO_THRESHOLD})`);
    
    if (flagResult.counts.warn > 0) {
      factors.push(`${flagResult.counts.warn} WARNING flag(s) detected`);
    }
    
    return {
      recommendation: 'CLARIFY',
      reason: `ICS (${ics.toFixed(1)}) indicates partial clarity. Further clarification recommended before investment.`,
      primaryFactor: 'ICS_MID',
      factors,
      aiCanOverride: false
    };
  }
  
  // Rule 5: ICS ≥ 75, no CRITICAL flags, no gates → GO
  factors.push(`ICS = ${ics.toFixed(1)} (at or above ${ICS_GO_THRESHOLD} threshold)`);
  factors.push('No CRITICAL flags');
  factors.push('No gates triggered');
  
  if (flagResult.counts.warn > 0) {
    factors.push(`${flagResult.counts.warn} WARNING flag(s) present (non-blocking)`);
  }
  
  return {
    recommendation: 'GO',
    reason: `ICS (${ics.toFixed(1)}) indicates high clarity. No critical flags or gates. Ready to proceed.`,
    primaryFactor: 'ICS_HIGH',
    factors,
    aiCanOverride: false
  };
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Get recommendation color for UI.
 */
export function getRecommendationColor(recommendation: Recommendation | null): string {
  switch (recommendation) {
    case 'GO': return 'green';
    case 'CLARIFY': return 'amber';
    case 'NO_GO': return 'red';
    default: return 'gray';
  }
}

/**
 * Get recommendation emoji.
 */
export function getRecommendationEmoji(recommendation: Recommendation | null): string {
  switch (recommendation) {
    case 'GO': return '🟢';
    case 'CLARIFY': return '🟡';
    case 'NO_GO': return '🔴';
    default: return '⚪';
  }
}

/**
 * Get recommendation display text.
 */
export function getRecommendationDisplay(recommendation: Recommendation | null): string {
  switch (recommendation) {
    case 'GO': return 'GO — Ready to Proceed';
    case 'CLARIFY': return 'CLARIFY — Action Required';
    case 'NO_GO': return 'NO-GO — Do Not Proceed';
    default: return 'Not Applicable';
  }
}

/**
 * Check if recommendation allows proceeding.
 */
export function canProceed(recommendation: Recommendation | null): boolean {
  return recommendation === 'GO';
}

/**
 * Check if recommendation requires clarification.
 */
export function needsClarification(recommendation: Recommendation | null): boolean {
  return recommendation === 'CLARIFY';
}

/**
 * Check if recommendation blocks proceeding.
 */
export function isBlocked(recommendation: Recommendation | null): boolean {
  return recommendation === 'NO_GO';
}

export default computeRecommendation;
