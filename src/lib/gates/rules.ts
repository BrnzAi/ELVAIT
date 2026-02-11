/**
 * Gating Rules (G1-G4)
 * 
 * Gates can override ICS-based recommendations.
 * Applied AFTER flag computation, BEFORE final recommendation.
 * 
 * G1: Any dimension below floor (50) → CLARIFY
 * G2: Process score < 50 (Full Kit only) → CLARIFY
 * G3: High user friction + high exec readiness → CLARIFY (adoption risk)
 * G4: OWNERSHIP_DIFFUSION CRITICAL → minimum CLARIFY
 */

import { GateResult, GateId, Dimension, Flag } from '../questions/types';
import { CaseDimensionScores } from '../scoring/dimensions';
import { KitVariant } from '../variants/types';
import { isProcessGate } from '../variants/config';
import { FlagEngineResult, hasOwnershipDiffusion } from '../flags/engine';
import { CORE_DIMENSIONS } from '../questions/types';

// =============================================================================
// TYPES
// =============================================================================

export interface GateEvaluationResult {
  /** All triggered gates */
  gates: GateResult[];
  
  /** Whether any gate was triggered */
  hasGates: boolean;
  
  /** Gate IDs triggered */
  gateIds: Set<GateId>;
}

// =============================================================================
// THRESHOLDS
// =============================================================================

const DIMENSION_FLOOR = 50;      // G1: Any dimension below this → CLARIFY
const PROCESS_FLOOR = 50;        // G2: Process score below this → CLARIFY
const USER_FRICTION_HIGH = 60;   // G3: User friction above this is "high"
const EXEC_READINESS_HIGH = 70;  // G3: Exec readiness above this is "high"

// =============================================================================
// GATE G1: Dimension Floor
// =============================================================================

/**
 * G1: Check if any dimension score is below the floor (50).
 * Triggers CLARIFY for each dimension below floor.
 */
export function evaluateG1(caseDimScores: CaseDimensionScores): GateResult[] {
  const gates: GateResult[] = [];
  
  for (const dim of CORE_DIMENSIONS) {
    const score = caseDimScores[dim];
    
    if (score !== null && score < DIMENSION_FLOOR) {
      gates.push({
        gate: 'G1',
        action: 'CLARIFY',
        flag: `LOW_DIMENSION_SCORE_${dim}`,
        dimension: dim,
        details: `Dimension ${dim} score (${score.toFixed(1)}) is below floor of ${DIMENSION_FLOOR}`
      });
    }
  }
  
  return gates;
}

// =============================================================================
// GATE G2: Process Readiness (Full Kit Only)
// =============================================================================

/**
 * G2: Check if process score is below floor.
 * Only applies to Full Kit variant where process is a gate.
 */
export function evaluateG2(
  caseDimScores: CaseDimensionScores,
  variant: KitVariant
): GateResult[] {
  const gates: GateResult[] = [];
  
  // Only applies if process is a gate for this variant
  if (!isProcessGate(variant)) {
    return gates;
  }
  
  const processScore = caseDimScores.P;
  
  if (processScore !== null && processScore < PROCESS_FLOOR) {
    gates.push({
      gate: 'G2',
      action: 'CLARIFY',
      flag: 'AUTOMATION_PREMATURITY',
      dimension: 'P',
      details: `Process score (${processScore.toFixed(1)}) is below floor of ${PROCESS_FLOOR}. Process improvements needed before automation.`
    });
  }
  
  return gates;
}

// =============================================================================
// GATE G3: Adoption Risk
// =============================================================================

/**
 * G3: Check for adoption risk.
 * Triggered when user friction is high but exec readiness is also high,
 * indicating a disconnect between management perception and ground reality.
 */
export function evaluateG3(
  userFrictionScore: number | null,
  execReadinessScore: number | null
): GateResult[] {
  const gates: GateResult[] = [];
  
  // Need both scores to evaluate
  if (userFrictionScore === null || execReadinessScore === null) {
    return gates;
  }
  
  // Check for adoption risk pattern
  if (userFrictionScore > USER_FRICTION_HIGH && execReadinessScore > EXEC_READINESS_HIGH) {
    gates.push({
      gate: 'G3',
      action: 'CLARIFY',
      flag: 'ADOPTION_RISK',
      details: `High user friction (${userFrictionScore.toFixed(1)}) combined with high exec readiness (${execReadinessScore.toFixed(1)}) indicates adoption risk.`
    });
  }
  
  return gates;
}

// =============================================================================
// GATE G4: Ownership Diffusion
// =============================================================================

/**
 * G4: Check for ownership diffusion.
 * If OWNERSHIP_DIFFUSION CRITICAL flag is triggered, minimum recommendation is CLARIFY.
 */
export function evaluateG4(flagResult: FlagEngineResult): GateResult[] {
  const gates: GateResult[] = [];
  
  if (hasOwnershipDiffusion(flagResult)) {
    gates.push({
      gate: 'G4',
      action: 'CLARIFY',
      flag: 'OWNERSHIP_DIFFUSION',
      details: 'Ownership is unclear or diffused across roles. Clarification needed before proceeding.'
    });
  }
  
  return gates;
}

// =============================================================================
// GATE AGGREGATOR
// =============================================================================

export interface GateEvaluationInput {
  caseDimScores: CaseDimensionScores;
  variant: KitVariant;
  flagResult: FlagEngineResult;
  userFrictionScore?: number | null;
  execReadinessScore?: number | null;
}

/**
 * Evaluate all gates for a case.
 */
export function evaluateAllGates(input: GateEvaluationInput): GateEvaluationResult {
  const allGates: GateResult[] = [];
  
  // G1: Dimension floor
  const g1 = evaluateG1(input.caseDimScores);
  allGates.push(...g1);
  
  // G2: Process readiness
  const g2 = evaluateG2(input.caseDimScores, input.variant);
  allGates.push(...g2);
  
  // G3: Adoption risk
  const g3 = evaluateG3(
    input.userFrictionScore ?? null,
    input.execReadinessScore ?? null
  );
  allGates.push(...g3);
  
  // G4: Ownership diffusion
  const g4 = evaluateG4(input.flagResult);
  allGates.push(...g4);
  
  return {
    gates: allGates,
    hasGates: allGates.length > 0,
    gateIds: new Set(allGates.map(g => g.gate))
  };
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Check if a specific gate was triggered.
 */
export function hasGate(result: GateEvaluationResult, gateId: GateId): boolean {
  return result.gateIds.has(gateId);
}

/**
 * Get gates that triggered CLARIFY action.
 */
export function getClarifyGates(result: GateEvaluationResult): GateResult[] {
  return result.gates.filter(g => g.action === 'CLARIFY');
}

/**
 * Get gate summary text.
 */
export function getGateSummary(result: GateEvaluationResult): string {
  if (!result.hasGates) {
    return 'No gates triggered.';
  }
  
  const lines = result.gates.map(g => 
    `⚠️ ${g.gate}: ${g.flag ?? 'Triggered'} → ${g.action}`
  );
  
  return lines.join('\n');
}

/**
 * Get dimension gates (G1) for reporting.
 */
export function getDimensionGates(result: GateEvaluationResult): GateResult[] {
  return result.gates.filter(g => g.gate === 'G1');
}

/**
 * Get low dimensions from G1 gates.
 */
export function getLowDimensions(result: GateEvaluationResult): Dimension[] {
  return result.gates
    .filter(g => g.gate === 'G1' && g.dimension)
    .map(g => g.dimension as Dimension);
}

export default evaluateAllGates;
