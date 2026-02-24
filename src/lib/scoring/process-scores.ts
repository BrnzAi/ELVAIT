/**
 * Per-Process Scoring
 * 
 * Implements scoring for cases with multiple AssessmentProcess records.
 * Calculates separate scores for each process and weighted aggregates.
 */

import { normalise, averageOf, roundScore } from './normalise';
import { QUESTION_MAP } from '../questions/registry';
import { Dimension, Role, CORE_DIMENSIONS } from '../questions/types';
import { KitVariant } from '../variants/types';
import { getVariantConfig, getIcsRoles } from '../variants/config';
import { Answer } from './dimensions';

// =============================================================================
// TYPES
// =============================================================================

export interface ProcessScore {
  processId: string;
  processName: string;
  score: number;  // 0-100
  weight: number; // percentage
}

export interface ProcessScoresResult {
  processScores: ProcessScore[];
  aggregateProcessScore: number;
  lowestProcessScore: ProcessScore | null;
}

// =============================================================================
// PER-PROCESS SCORING
// =============================================================================

/**
 * Calculate dimension score for a specific process.
 * Only includes responses linked to that processId.
 * 
 * @param answers - All answers for the case
 * @param processId - Target process ID
 * @param dimension - Dimension to calculate
 * @returns Score 0-100 or null if no applicable answers
 */
export function calculateProcessDimScore(
  answers: Answer[],
  processId: string,
  dimension: Dimension
): number | null {
  // Filter answers to this process and dimension
  const processAnswers = answers.filter(a => {
    const q = QUESTION_MAP.get(a.questionId);
    return q && 
           q.dimension === dimension && 
           q.answer_type === 'LIKERT' &&
           typeof a.rawValue === 'number';
  });

  // For process-specific responses, we'd need to check a.processId
  // But since the current Answer interface doesn't have processId,
  // we'll need to extend it or use SurveyResponse directly
  // For now, let's filter by role and assume process assignment logic
  
  if (processAnswers.length === 0) {
    return null;
  }

  const scores: number[] = [];
  
  for (const answer of processAnswers) {
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
 * Calculate Process Readiness Score for a specific process.
 * This is the main function for per-process scoring.
 */
export function calculateProcessScore(
  responses: any[], // SurveyResponse[]
  processId: string
): number | null {
  // Filter responses to this process and P dimension questions
  const processResponses = responses.filter(r => 
    r.processId === processId && 
    r.answerType === 'LIKERT'
  );

  if (processResponses.length === 0) {
    return null;
  }

  const scores: number[] = [];
  
  for (const response of processResponses) {
    const q = QUESTION_MAP.get(response.questionId);
    if (!q || q.dimension !== 'P') continue;
    
    const raw = parseInt(response.rawValue, 10);
    if (isNaN(raw) || raw < 1 || raw > 5) continue;
    
    const normalised = normalise(raw, q.is_reverse);
    scores.push(normalised.score_0_100);
  }
  
  return averageOf(scores);
}

/**
 * Calculate scores for all processes in a case.
 * 
 * @param responses - All survey responses for the case
 * @param processes - AssessmentProcess records for the case
 * @returns Array of process scores with metadata
 */
export function calculateProcessScores(
  responses: any[], // SurveyResponse[]
  processes: any[]  // AssessmentProcess[]
): ProcessScore[] {
  const processScores: ProcessScore[] = [];
  
  for (const process of processes) {
    const score = calculateProcessScore(responses, process.id);
    
    if (score !== null) {
      processScores.push({
        processId: process.id,
        processName: process.name,
        score: roundScore(score, 1),
        weight: process.weight
      });
    }
  }
  
  return processScores;
}

/**
 * Calculate weighted aggregate process score.
 * 
 * @param processScores - Individual process scores
 * @returns Weighted average score 0-100
 */
export function calculateAggregateProcessScore(processScores: ProcessScore[]): number {
  if (processScores.length === 0) {
    return 0;
  }
  
  let weightedSum = 0;
  let totalWeight = 0;
  
  for (const ps of processScores) {
    weightedSum += ps.score * (ps.weight / 100);
    totalWeight += ps.weight / 100;
  }
  
  if (totalWeight === 0) {
    return 0;
  }
  
  return roundScore(weightedSum / totalWeight, 1);
}

/**
 * Find the lowest scoring process (weakest link).
 * 
 * @param processScores - Individual process scores
 * @returns Process with lowest score or null if empty
 */
export function findLowestProcessScore(processScores: ProcessScore[]): ProcessScore | null {
  if (processScores.length === 0) {
    return null;
  }
  
  return processScores.reduce((lowest, current) => 
    current.score < lowest.score ? current : lowest
  );
}

/**
 * Calculate complete per-process scoring for a case.
 * Returns null if case has no AssessmentProcess records (legacy cases).
 * 
 * @param responses - All survey responses
 * @param processes - AssessmentProcess records (empty for legacy cases)
 * @returns Complete process scoring result or null for legacy cases
 */
export function calculateCompleteProcessScores(
  responses: any[], // SurveyResponse[]
  processes: any[]  // AssessmentProcess[]
): ProcessScoresResult | null {
  // Legacy case: no processes defined
  if (processes.length === 0) {
    return null;
  }
  
  const processScores = calculateProcessScores(responses, processes);
  const aggregateProcessScore = calculateAggregateProcessScore(processScores);
  const lowestProcessScore = findLowestProcessScore(processScores);
  
  return {
    processScores,
    aggregateProcessScore,
    lowestProcessScore
  };
}

/**
 * Get the process score to use for gating (weakest link principle).
 * For multi-process cases, returns the lowest individual process score.
 * For legacy cases, returns the single P dimension score.
 * 
 * @param caseProcessScore - Single P dimension score (legacy)
 * @param processScoring - Per-process scoring result
 * @returns Score to use for gate evaluation
 */
export function getGateProcessScore(
  caseProcessScore: number | null,
  processScoring: ProcessScoresResult | null
): number | null {
  if (processScoring === null) {
    // Legacy case: use original P dimension score
    return caseProcessScore;
  }
  
  // Multi-process case: use lowest individual process score
  return processScoring.lowestProcessScore?.score ?? null;
}

export default calculateCompleteProcessScores;