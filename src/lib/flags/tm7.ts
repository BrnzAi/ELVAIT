/**
 * TM-7: Time-Separated Consistency
 * 
 * Detects complexity denial when respondents claim both simplification
 * (early question) AND complexity/dependencies (late question).
 * 
 * Flag: COMPLEXITY_DENIAL (WARN)
 * Triggers:
 * - Business: B10 >= 4 AND B11 >= 4
 * - Tech: T11 >= 4 AND T12 >= 4
 */

import { Flag, Role } from '../questions/types';
import { getTimePair, QUESTION_MAP } from '../questions/registry';
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
// TIME PAIR GROUPS
// =============================================================================

const TIME_PAIR_GROUPS = [
  'BIZ_COMPLEXITY',   // B10 (early) + B11 (late)
  'TECH_COMPLEXITY'   // T11 (early) + T12 (late)
];

// =============================================================================
// TM-7 DETECTION
// =============================================================================

/**
 * Detect TM-7 time-separated consistency flags.
 * 
 * @param answers - Map of questionId -> answer data
 * @returns Array of flags detected
 */
export function detectTm7Flags(answers: AnswerLookup): Flag[] {
  const flags: Flag[] = [];
  
  for (const groupId of TIME_PAIR_GROUPS) {
    const pair = getTimePair(groupId);
    
    if (!pair.early || !pair.late) continue;
    
    const earlyAnswer = answers[pair.early.question_id];
    const lateAnswer = answers[pair.late.question_id];
    
    // Need both answers
    if (!earlyAnswer || !lateAnswer) continue;
    
    // Both must be Likert
    if (pair.early.answer_type !== 'LIKERT' || pair.late.answer_type !== 'LIKERT') {
      continue;
    }
    
    if (typeof earlyAnswer.rawValue !== 'number' || typeof lateAnswer.rawValue !== 'number') {
      continue;
    }
    
    // Get adjusted scores
    const earlyNorm = normalise(earlyAnswer.rawValue, pair.early.is_reverse);
    const lateNorm = normalise(lateAnswer.rawValue, pair.late.is_reverse);
    
    // Check for complexity denial: both >= 4
    // This means they claim it will simplify things (early) 
    // but also acknowledge new complexity (late)
    if (earlyNorm.adjusted >= 4 && lateNorm.adjusted >= 4) {
      const role = earlyAnswer.role;
      const roleLabel = role === 'BUSINESS_OWNER' ? 'Business' : 'Tech';
      
      flags.push({
        flag_id: 'COMPLEXITY_DENIAL',
        severity: 'WARN',
        evidence: {
          question_ids: [pair.early.question_id, pair.late.question_id],
          raw_values: {
            [pair.early.question_id]: earlyAnswer.rawValue,
            [pair.late.question_id]: lateAnswer.rawValue,
            early_adjusted: earlyNorm.adjusted,
            late_adjusted: lateNorm.adjusted
          },
          roles: [role],
          group: groupId,
          description: `${roleLabel} claims initiative will simplify operations (${pair.early.question_id}=${earlyNorm.adjusted}) while also acknowledging new complexity (${pair.late.question_id}=${lateNorm.adjusted}).`
        }
      });
    }
  }
  
  return flags;
}

/**
 * Check a specific time pair for complexity denial.
 */
export function checkTimePairConsistency(
  earlyValue: number,
  lateValue: number,
  earlyIsReverse: boolean = false,
  lateIsReverse: boolean = false
): { consistent: boolean; earlyAdjusted: number; lateAdjusted: number } {
  const earlyAdjusted = earlyIsReverse ? (6 - earlyValue) : earlyValue;
  const lateAdjusted = lateIsReverse ? (6 - lateValue) : lateValue;
  
  // Inconsistent if both are high (claiming both simplification and complexity)
  const consistent = !(earlyAdjusted >= 4 && lateAdjusted >= 4);
  
  return { consistent, earlyAdjusted, lateAdjusted };
}

/**
 * Get complexity denial summary for reporting.
 */
export function getComplexityDenialSummary(answers: AnswerLookup): {
  pairs: Array<{
    groupId: string;
    role: Role;
    earlyQuestion: string;
    lateQuestion: string;
    earlyAdjusted: number;
    lateAdjusted: number;
    isDenial: boolean;
  }>;
  hasDenial: boolean;
} {
  const pairs: Array<{
    groupId: string;
    role: Role;
    earlyQuestion: string;
    lateQuestion: string;
    earlyAdjusted: number;
    lateAdjusted: number;
    isDenial: boolean;
  }> = [];
  
  let hasDenial = false;
  
  for (const groupId of TIME_PAIR_GROUPS) {
    const pair = getTimePair(groupId);
    
    if (!pair.early || !pair.late) continue;
    
    const earlyAnswer = answers[pair.early.question_id];
    const lateAnswer = answers[pair.late.question_id];
    
    if (!earlyAnswer || !lateAnswer) continue;
    if (typeof earlyAnswer.rawValue !== 'number' || typeof lateAnswer.rawValue !== 'number') {
      continue;
    }
    
    const earlyNorm = normalise(earlyAnswer.rawValue, pair.early.is_reverse);
    const lateNorm = normalise(lateAnswer.rawValue, pair.late.is_reverse);
    
    const isDenial = earlyNorm.adjusted >= 4 && lateNorm.adjusted >= 4;
    if (isDenial) hasDenial = true;
    
    pairs.push({
      groupId,
      role: earlyAnswer.role,
      earlyQuestion: pair.early.question_id,
      lateQuestion: pair.late.question_id,
      earlyAdjusted: earlyNorm.adjusted,
      lateAdjusted: lateNorm.adjusted,
      isDenial
    });
  }
  
  return { pairs, hasDenial };
}

export default detectTm7Flags;
