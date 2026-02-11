/**
 * TM-2: Claim → Proof → Consequence Triads
 * 
 * Detects narrative inflation risk where high claims are made
 * without sufficient proof or owned consequences.
 * 
 * Flags:
 * - NARRATIVE_INFLATION_RISK (CRITICAL): claim>=4 + weak proof + unowned consequence
 * - PROOF_GAP (WARN): claim>=4 + weak proof + owned consequence
 * - CONSEQUENCE_UNOWNED (WARN): claim>=4 + unowned consequence (regardless of proof)
 */

import { Flag, Role } from '../questions/types';
import { getTriadGroup, QUESTION_MAP } from '../questions/registry';
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
// WEAK PROOF / UNOWNED CONSEQUENCE DEFINITIONS
// =============================================================================

const WEAK_PROOF_VALUES = [
  'Assumptions only',
  'No formal documentation',
  'No documentation'
];

const UNOWNED_CONSEQUENCE_VALUES = [
  'The initiative will continue anyway',
  'Continue anyway',
  'This has not been defined',
  'Not defined'
];

// =============================================================================
// TM-2 DETECTION
// =============================================================================

/**
 * Detect TM-2 triad flags for a specific triad group.
 * 
 * @param answers - Map of questionId -> answer data
 * @param triadGroupId - ID of the triad group to check
 * @returns Array of flags detected
 */
export function detectTriadFlags(
  answers: AnswerLookup,
  triadGroupId: string
): Flag[] {
  const flags: Flag[] = [];
  
  // Get questions in this triad
  const triadQuestions = getTriadGroup(triadGroupId);
  
  const claimQ = triadQuestions.find(q => q.triad_role === 'claim');
  const proofQ = triadQuestions.find(q => q.triad_role === 'proof');
  const consequenceQ = triadQuestions.find(q => q.triad_role === 'consequence');
  
  // Need all three parts
  if (!claimQ || !proofQ || !consequenceQ) {
    return flags;
  }
  
  // Get answers
  const claimAnswer = answers[claimQ.question_id];
  const proofAnswer = answers[proofQ.question_id];
  const consequenceAnswer = answers[consequenceQ.question_id];
  
  // Need all answers
  if (!claimAnswer || !proofAnswer || !consequenceAnswer) {
    return flags;
  }
  
  // Evaluate claim (must be Likert)
  let claimAdjusted: number;
  if (claimQ.answer_type === 'LIKERT' && typeof claimAnswer.rawValue === 'number') {
    const norm = normalise(claimAnswer.rawValue, claimQ.is_reverse);
    claimAdjusted = norm.adjusted;
  } else {
    // Can't evaluate non-Likert claim
    return flags;
  }
  
  // Only check if claim is high (>= 4)
  if (claimAdjusted < 4) {
    return flags;
  }
  
  // Evaluate proof
  const proofValue = String(proofAnswer.rawValue);
  const isWeakProof = WEAK_PROOF_VALUES.some(v => 
    proofValue.toLowerCase().includes(v.toLowerCase())
  );
  
  // Evaluate consequence
  const consequenceValue = String(consequenceAnswer.rawValue);
  const isUnownedConsequence = UNOWNED_CONSEQUENCE_VALUES.some(v =>
    consequenceValue.toLowerCase().includes(v.toLowerCase())
  );
  
  // Flag logic
  const questionIds = [claimQ.question_id, proofQ.question_id, consequenceQ.question_id];
  const rawValues: Record<string, string | number> = {
    [claimQ.question_id]: claimAnswer.rawValue,
    [proofQ.question_id]: proofAnswer.rawValue,
    [consequenceQ.question_id]: consequenceAnswer.rawValue
  };
  
  // NARRATIVE_INFLATION_RISK: weak proof AND unowned consequence
  if (isWeakProof && isUnownedConsequence) {
    flags.push({
      flag_id: 'NARRATIVE_INFLATION_RISK',
      severity: 'CRITICAL',
      evidence: {
        question_ids: questionIds,
        raw_values: rawValues,
        roles: [claimAnswer.role],
        group: triadGroupId,
        description: `High value claim (${claimQ.question_id}=${claimAdjusted}) backed by weak proof ("${proofValue}") with unowned consequence ("${consequenceValue}").`
      }
    });
  } else {
    // PROOF_GAP: weak proof but owned consequence
    if (isWeakProof) {
      flags.push({
        flag_id: 'PROOF_GAP',
        severity: 'WARN',
        evidence: {
          question_ids: [claimQ.question_id, proofQ.question_id],
          raw_values: {
            [claimQ.question_id]: claimAnswer.rawValue,
            [proofQ.question_id]: proofAnswer.rawValue
          },
          roles: [claimAnswer.role],
          group: triadGroupId,
          description: `High value claim (${claimQ.question_id}=${claimAdjusted}) backed only by weak proof ("${proofValue}").`
        }
      });
    }
    
    // CONSEQUENCE_UNOWNED: unowned consequence regardless of proof
    if (isUnownedConsequence) {
      flags.push({
        flag_id: 'CONSEQUENCE_UNOWNED',
        severity: 'WARN',
        evidence: {
          question_ids: [claimQ.question_id, consequenceQ.question_id],
          raw_values: {
            [claimQ.question_id]: claimAnswer.rawValue,
            [consequenceQ.question_id]: consequenceAnswer.rawValue
          },
          roles: [claimAnswer.role],
          group: triadGroupId,
          description: `High value claim (${claimQ.question_id}=${claimAdjusted}) has unowned consequence ("${consequenceValue}").`
        }
      });
    }
  }
  
  return flags;
}

/**
 * Detect all TM-2 flags across all triad groups.
 */
export function detectAllTm2Flags(answers: AnswerLookup): Flag[] {
  const flags: Flag[] = [];
  
  // Get all unique triad group IDs
  const triadGroupIds = new Set<string>();
  for (const q of QUESTION_MAP.values()) {
    if (q.triad_group_id) {
      triadGroupIds.add(q.triad_group_id);
    }
  }
  
  // Check each triad
  for (const groupId of triadGroupIds) {
    const groupFlags = detectTriadFlags(answers, groupId);
    flags.push(...groupFlags);
  }
  
  return flags;
}

export default detectAllTm2Flags;
