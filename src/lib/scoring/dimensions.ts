/**
 * Dimension Scoring
 * 
 * Calculates dimension scores at role and case level.
 * 
 * Scoring flow:
 * 1. Normalise each Likert answer (with reverse scoring)
 * 2. Calculate role dimension score = AVG of normalised scores in that dimension
 * 3. If multiple participants per role, average their dimension scores
 * 4. Calculate case dimension score = weighted sum of role scores per variant
 */

import { normalise, averageOf, roundScore } from './normalise';
import { QUESTION_MAP } from '../questions/registry';
import { Dimension, Role, CORE_DIMENSIONS } from '../questions/types';
import { KitVariant } from '../variants/types';
import { getVariantConfig, getIcsRoles } from '../variants/config';

// =============================================================================
// TYPES
// =============================================================================

export interface Answer {
  questionId: string;
  rawValue: number | string;
  participantId: string;
  role: Role;
}

export interface RoleDimensionScores {
  [dimension: string]: number | null;
}

export interface CaseDimensionScores {
  D1: number | null;
  D2: number | null;
  D3: number | null;
  D4: number | null;
  D5: number | null;
  P: number | null;
}

export interface RoleScoresMap {
  [role: string]: RoleDimensionScores;
}

// =============================================================================
// ROLE DIMENSION SCORE
// =============================================================================

/**
 * Calculate dimension score for a single participant.
 * Only includes Likert questions in the calculation.
 * 
 * @param answers - All answers from this participant
 * @param dimension - Dimension to calculate score for
 * @returns Score 0-100 or null if no Likert questions in dimension
 */
export function calculateParticipantDimScore(
  answers: Answer[],
  dimension: Dimension
): number | null {
  // Filter answers to Likert questions in this dimension
  const dimAnswers = answers.filter(a => {
    const q = QUESTION_MAP.get(a.questionId);
    return q && 
           q.dimension === dimension && 
           q.answer_type === 'LIKERT' &&
           typeof a.rawValue === 'number';
  });
  
  if (dimAnswers.length === 0) {
    return null;
  }
  
  // Normalise each answer and collect scores
  const scores: number[] = [];
  
  for (const answer of dimAnswers) {
    const q = QUESTION_MAP.get(answer.questionId);
    if (!q) continue;
    
    const raw = typeof answer.rawValue === 'number' 
      ? answer.rawValue 
      : parseInt(answer.rawValue as string, 10);
    
    if (isNaN(raw) || raw < 1 || raw > 5) continue;
    
    const normalised = normalise(raw, q.is_reverse);
    scores.push(normalised.score_0_100);
  }
  
  return averageOf(scores);
}

/**
 * Calculate dimension scores for all dimensions for a single participant.
 */
export function calculateParticipantAllDimScores(
  answers: Answer[]
): RoleDimensionScores {
  const scores: RoleDimensionScores = {};
  
  const dimensions: Dimension[] = [...CORE_DIMENSIONS, 'P'];
  
  for (const dim of dimensions) {
    scores[dim] = calculateParticipantDimScore(answers, dim);
  }
  
  return scores;
}

/**
 * Calculate role dimension score when multiple participants have the same role.
 * Averages individual participant dimension scores.
 * 
 * @param participantScores - Array of dimension scores from each participant
 * @param dimension - Dimension to calculate
 * @returns Averaged score or null
 */
export function calculateRoleDimScore(
  participantScores: RoleDimensionScores[],
  dimension: Dimension
): number | null {
  const validScores = participantScores
    .map(ps => ps[dimension])
    .filter((s): s is number => s !== null);
  
  return averageOf(validScores);
}

/**
 * Calculate all dimension scores for a role group (handling multiple participants).
 */
export function calculateRoleAllDimScores(
  participantScores: RoleDimensionScores[]
): RoleDimensionScores {
  const scores: RoleDimensionScores = {};
  
  const dimensions: Dimension[] = [...CORE_DIMENSIONS, 'P'];
  
  for (const dim of dimensions) {
    scores[dim] = calculateRoleDimScore(participantScores, dim);
  }
  
  return scores;
}

// =============================================================================
// CASE DIMENSION SCORE
// =============================================================================

/**
 * Calculate case-level dimension score.
 * Applies variant weights to role scores.
 * 
 * @param roleScores - Map of role -> dimension scores
 * @param dimension - Dimension to calculate
 * @param variant - Kit variant for weight configuration
 * @returns Weighted average score or null
 */
export function calculateCaseDimScore(
  roleScores: RoleScoresMap,
  dimension: Dimension,
  variant: KitVariant
): number | null {
  const config = getVariantConfig(variant);
  
  // For Process dimension, only use Process Owner scores
  if (dimension === 'P') {
    const processScore = roleScores['PROCESS_OWNER']?.[dimension];
    return processScore ?? null;
  }
  
  // For D1-D5, use weighted average of ICS-contributing roles
  const icsRoles = getIcsRoles(variant);
  
  let weightedSum = 0;
  let totalWeight = 0;
  
  for (const role of icsRoles) {
    const score = roleScores[role]?.[dimension];
    const weight = config.weights[role] ?? 0;
    
    if (score !== null && score !== undefined) {
      weightedSum += weight * score;
      totalWeight += weight;
    }
  }
  
  if (totalWeight === 0) {
    return null;
  }
  
  // Normalize by total weight of participating roles
  return weightedSum / totalWeight;
}

/**
 * Calculate all case dimension scores.
 */
export function calculateAllCaseDimScores(
  roleScores: RoleScoresMap,
  variant: KitVariant
): CaseDimensionScores {
  return {
    D1: calculateCaseDimScore(roleScores, 'D1', variant),
    D2: calculateCaseDimScore(roleScores, 'D2', variant),
    D3: calculateCaseDimScore(roleScores, 'D3', variant),
    D4: calculateCaseDimScore(roleScores, 'D4', variant),
    D5: calculateCaseDimScore(roleScores, 'D5', variant),
    P: calculateCaseDimScore(roleScores, 'P', variant)
  };
}

// =============================================================================
// FULL SCORING PIPELINE
// =============================================================================

/**
 * Group answers by participant.
 */
export function groupAnswersByParticipant(
  answers: Answer[]
): Map<string, Answer[]> {
  const groups = new Map<string, Answer[]>();
  
  for (const answer of answers) {
    const existing = groups.get(answer.participantId) ?? [];
    existing.push(answer);
    groups.set(answer.participantId, existing);
  }
  
  return groups;
}

/**
 * Group answers by role.
 */
export function groupAnswersByRole(
  answers: Answer[]
): Map<Role, Answer[]> {
  const groups = new Map<Role, Answer[]>();
  
  for (const answer of answers) {
    const existing = groups.get(answer.role) ?? [];
    existing.push(answer);
    groups.set(answer.role, existing);
  }
  
  return groups;
}

/**
 * Calculate complete dimension scores for a case.
 * 
 * @param answers - All answers for the case
 * @param variant - Kit variant
 * @returns Object with role scores and case scores
 */
export function calculateCaseScores(
  answers: Answer[],
  variant: KitVariant
): {
  roleScores: RoleScoresMap;
  caseScores: CaseDimensionScores;
} {
  // Group by participant first
  const byParticipant = groupAnswersByParticipant(answers);
  
  // Calculate per-participant dimension scores
  const participantScores: Map<string, { role: Role; scores: RoleDimensionScores }> = new Map();
  
  for (const [participantId, participantAnswers] of byParticipant) {
    if (participantAnswers.length === 0) continue;
    
    const role = participantAnswers[0].role;
    const scores = calculateParticipantAllDimScores(participantAnswers);
    participantScores.set(participantId, { role, scores });
  }
  
  // Group participant scores by role
  const scoresByRole = new Map<Role, RoleDimensionScores[]>();
  
  for (const [, data] of participantScores) {
    const existing = scoresByRole.get(data.role) ?? [];
    existing.push(data.scores);
    scoresByRole.set(data.role, existing);
  }
  
  // Calculate role-level scores (averaging multiple participants)
  const roleScores: RoleScoresMap = {};
  
  for (const [role, scores] of scoresByRole) {
    roleScores[role] = calculateRoleAllDimScores(scores);
  }
  
  // Calculate case-level scores
  const caseScores = calculateAllCaseDimScores(roleScores, variant);
  
  return { roleScores, caseScores };
}

/**
 * Round all scores in a case scores object.
 */
export function roundCaseScores(
  scores: CaseDimensionScores,
  decimals: number = 1
): CaseDimensionScores {
  return {
    D1: scores.D1 !== null ? roundScore(scores.D1, decimals) : null,
    D2: scores.D2 !== null ? roundScore(scores.D2, decimals) : null,
    D3: scores.D3 !== null ? roundScore(scores.D3, decimals) : null,
    D4: scores.D4 !== null ? roundScore(scores.D4, decimals) : null,
    D5: scores.D5 !== null ? roundScore(scores.D5, decimals) : null,
    P: scores.P !== null ? roundScore(scores.P, decimals) : null
  };
}

export default calculateCaseScores;
