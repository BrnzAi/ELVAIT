/**
 * TM-3: Confidence vs Evidence Mismatch
 * 
 * Detects overconfidence when high confidence is expressed
 * but supporting evidence is weak or absent.
 * 
 * Flag: OVERCONFIDENCE
 * - CRITICAL: confidence >= 4 AND evidence_score = 1
 * - WARN: confidence >= 4 AND evidence_score = 2
 */

import { Flag, Role, EVIDENCE_SCORE_MAP } from '../questions/types';
import { QUESTION_MAP, getConfidenceQuestions } from '../questions/registry';
import { normalise } from '../scoring/normalise';

// =============================================================================
// TYPES
// =============================================================================

export interface AnswerLookup {
  [questionId: string]: {
    rawValue: number | string;
    participantId: string;
    role: Role;
  };
}

// =============================================================================
// EVIDENCE SCORING
// =============================================================================

/**
 * Get evidence score from a proof answer value.
 * Returns 0 if not a recognized evidence value.
 */
export function getEvidenceScore(value: string): number {
  // Try exact match first
  if (EVIDENCE_SCORE_MAP[value] !== undefined) {
    return EVIDENCE_SCORE_MAP[value];
  }
  
  // Try case-insensitive partial match
  const lowerValue = value.toLowerCase();
  
  if (lowerValue.includes('documented') && lowerValue.includes('baseline')) {
    return 5;
  }
  if (lowerValue.includes('pilot') || lowerValue.includes('measured')) {
    return 4;
  }
  if (lowerValue.includes('assumptions only')) {
    return 2;
  }
  if (lowerValue.includes('no') && (lowerValue.includes('documentation') || lowerValue.includes('formal'))) {
    return 1;
  }
  
  // Default to middle-ground if unclear
  return 3;
}

// =============================================================================
// CONFIDENCE-EVIDENCE PAIRS
// =============================================================================

/**
 * Map of confidence questions to their evidence questions.
 * Based on PRD section on TM-3.
 */
const CONFIDENCE_EVIDENCE_PAIRS: Record<string, string> = {
  'E24': 'B2',  // Exec confidence → Business proof
  'B12': 'B2',  // Business confidence → Business proof
  'T13': 'B2',  // Tech confidence → Business proof (uses same value baseline)
  'P9': 'B2'    // Process confidence → Business proof (uses same value baseline)
};

// =============================================================================
// TM-3 DETECTION
// =============================================================================

/**
 * Detect TM-3 overconfidence flags.
 * 
 * @param answers - Map of questionId -> answer data
 * @returns Array of flags detected
 */
export function detectTm3Flags(answers: AnswerLookup): Flag[] {
  const flags: Flag[] = [];
  
  // Get all confidence questions
  const confidenceQuestions = getConfidenceQuestions();
  
  for (const confQ of confidenceQuestions) {
    const confAnswer = answers[confQ.question_id];
    if (!confAnswer) continue;
    
    // Confidence must be Likert
    if (confQ.answer_type !== 'LIKERT' || typeof confAnswer.rawValue !== 'number') {
      continue;
    }
    
    // Get adjusted confidence score
    const confNorm = normalise(confAnswer.rawValue, confQ.is_reverse);
    
    // Only flag if confidence is high (>= 4)
    if (confNorm.adjusted < 4) continue;
    
    // Find the evidence question
    const evidenceQId = CONFIDENCE_EVIDENCE_PAIRS[confQ.question_id];
    if (!evidenceQId) continue;
    
    const evidenceAnswer = answers[evidenceQId];
    if (!evidenceAnswer) continue;
    
    // Get evidence score
    const evidenceValue = String(evidenceAnswer.rawValue);
    const evidenceScore = getEvidenceScore(evidenceValue);
    
    // Check for overconfidence
    if (evidenceScore <= 2) {
      const severity = evidenceScore === 1 ? 'CRITICAL' : 'WARN';
      
      flags.push({
        flag_id: 'OVERCONFIDENCE',
        severity,
        evidence: {
          question_ids: [confQ.question_id, evidenceQId],
          raw_values: {
            [confQ.question_id]: confAnswer.rawValue,
            [evidenceQId]: evidenceAnswer.rawValue,
            confidence_adjusted: confNorm.adjusted,
            evidence_score: evidenceScore
          },
          roles: [confAnswer.role],
          description: `High confidence (${confQ.question_id}=${confNorm.adjusted}) but weak evidence (${evidenceQId}="${evidenceValue}", score=${evidenceScore}).`
        }
      });
    }
  }
  
  return flags;
}

/**
 * Check if a specific confidence-evidence pair triggers overconfidence.
 */
export function checkOverconfidence(
  confidenceValue: number,
  evidenceValue: string,
  isReverse: boolean = false
): { triggered: boolean; severity: 'WARN' | 'CRITICAL' | null } {
  const adjusted = isReverse ? (6 - confidenceValue) : confidenceValue;
  const evidenceScore = getEvidenceScore(evidenceValue);
  
  if (adjusted >= 4 && evidenceScore <= 2) {
    return {
      triggered: true,
      severity: evidenceScore === 1 ? 'CRITICAL' : 'WARN'
    };
  }
  
  return { triggered: false, severity: null };
}

export default detectTm3Flags;
