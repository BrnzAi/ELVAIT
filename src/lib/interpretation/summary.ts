/**
 * Interpretation Pipeline - Case Summary
 * 
 * Generates the structured case_summary.json that feeds all outputs.
 * Contains ICS, recommendation, dimension scores, flags, and mismatches.
 */

import { Flag, Role, Dimension, Recommendation } from '../questions/types';
import { CaseDimensionScores, RoleScoresMap } from '../scoring/dimensions';
import { IcsResult } from '../scoring/ics';
import { FlagEngineResult, getTopFlags } from '../flags/engine';
import { GateEvaluationResult } from '../gates/rules';
import { RecommendationResult } from '../recommendation/engine';
import { KitVariant } from '../variants/types';

// =============================================================================
// TYPES
// =============================================================================

export interface CrossRoleMismatch {
  group: string;
  roleA: Role;
  roleB: Role;
  scoreA: number;
  scoreB: number;
  gap: number;
  severity: 'CRITICAL' | 'WARN';
}

export interface CaseSummary {
  /** Investment Clarity Score (null for PROCESS_STANDALONE) */
  ics: number | null;
  
  /** ICS label */
  icsLabel: string | null;
  
  /** Recommendation (GO/CLARIFY/NO_GO or null) */
  recommendation: Recommendation | null;
  
  /** Why this recommendation */
  recommendationReason: string;
  
  /** Dimension scores (D1-D5 + P) */
  dimScores: CaseDimensionScores;
  
  /** Role-level dimension scores */
  roleDimScores: RoleScoresMap;
  
  /** All flags sorted by severity */
  flags: Flag[];
  
  /** Gate results */
  gates: GateEvaluationResult;
  
  /** Top cross-role mismatches */
  topMismatches: CrossRoleMismatch[];
  
  /** Process score (separate from ICS) */
  processScore: number | null;
  
  /** Process readiness classification */
  processReadiness: string | null;
  
  /** Kit variant used */
  variant: KitVariant;
  
  /** Generation timestamp */
  generatedAt: Date;
}

// =============================================================================
// MISMATCH EXTRACTION
// =============================================================================

/**
 * Extract top cross-role mismatches from flags.
 */
export function extractTopMismatches(flags: Flag[], limit: number = 5): CrossRoleMismatch[] {
  const mismatches: CrossRoleMismatch[] = [];
  
  for (const flag of flags) {
    if (flag.flag_id !== 'CROSS_ROLE_MISMATCH') continue;
    
    const evidence = flag.evidence;
    const roles = evidence.roles ?? [];
    
    if (roles.length < 2) continue;
    
    const roleA = roles[0];
    const roleB = roles[1];
    
    const scoreA = evidence.raw_values[`${roleA}_score`] as number ?? 0;
    const scoreB = evidence.raw_values[`${roleB}_score`] as number ?? 0;
    const gap = evidence.gap ?? Math.abs(scoreA - scoreB);
    
    mismatches.push({
      group: evidence.group ?? 'Unknown',
      roleA,
      roleB,
      scoreA,
      scoreB,
      gap,
      severity: flag.severity as 'CRITICAL' | 'WARN'
    });
  }
  
  // Sort by gap (largest first) and limit
  return mismatches
    .sort((a, b) => b.gap - a.gap)
    .slice(0, limit);
}

// =============================================================================
// PROCESS READINESS
// =============================================================================

/**
 * Classify process readiness based on score.
 */
export function classifyProcessReadiness(
  processScore: number | null
): string | null {
  if (processScore === null) return null;
  
  if (processScore >= 75) return 'Automate';
  if (processScore >= 60) return 'Improve first';
  if (processScore >= 45) return 'Clarify ownership';
  return 'Defer';
}

// =============================================================================
// CASE SUMMARY GENERATION
// =============================================================================

export interface GenerateSummaryInput {
  icsResult: IcsResult;
  recommendationResult: RecommendationResult;
  dimScores: CaseDimensionScores;
  roleDimScores: RoleScoresMap;
  flagResult: FlagEngineResult;
  gateResult: GateEvaluationResult;
  variant: KitVariant;
}

/**
 * Generate complete case summary.
 */
export function generateCaseSummary(input: GenerateSummaryInput): CaseSummary {
  const {
    icsResult,
    recommendationResult,
    dimScores,
    roleDimScores,
    flagResult,
    gateResult,
    variant
  } = input;
  
  // Extract top mismatches from flags
  const topMismatches = extractTopMismatches(flagResult.flags);
  
  // Get process score and classification
  const processScore = dimScores.P;
  const processReadiness = classifyProcessReadiness(processScore);
  
  return {
    ics: icsResult.ics,
    icsLabel: icsResult.label,
    recommendation: recommendationResult.recommendation,
    recommendationReason: recommendationResult.reason,
    dimScores,
    roleDimScores,
    flags: flagResult.flags,
    gates: gateResult,
    topMismatches,
    processScore,
    processReadiness,
    variant,
    generatedAt: new Date()
  };
}

// =============================================================================
// SERIALIZATION
// =============================================================================

/**
 * Convert summary to JSON-serializable format.
 */
export function serializeSummary(summary: CaseSummary): string {
  return JSON.stringify({
    ...summary,
    generatedAt: summary.generatedAt.toISOString(),
    gates: {
      gates: summary.gates.gates,
      hasGates: summary.gates.hasGates,
      gateIds: Array.from(summary.gates.gateIds)
    }
  }, null, 2);
}

/**
 * Parse serialized summary back to object.
 */
export function deserializeSummary(json: string): CaseSummary {
  const parsed = JSON.parse(json);
  return {
    ...parsed,
    generatedAt: new Date(parsed.generatedAt),
    gates: {
      ...parsed.gates,
      gateIds: new Set(parsed.gates.gateIds)
    }
  };
}

export default generateCaseSummary;
