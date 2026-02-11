/**
 * TM-4: Cross-Role Contradiction Traps
 * 
 * Detects when the same fact is perceived differently across roles,
 * indicating misalignment or hidden assumptions.
 * 
 * Flag: CROSS_ROLE_MISMATCH
 * - CRITICAL: DATA_READINESS group with gap >= 1.2 (1-5 scale) or >= 30 (0-100)
 * - WARN: Other groups with same gap threshold
 */

import { Flag, Role, ContradictionGroup } from '../questions/types';
import { getContradictionGroup, QUESTION_MAP } from '../questions/registry';
import { normalise, averageOf } from '../scoring/normalise';

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
// CRITICAL GROUPS
// =============================================================================

/**
 * Groups where mismatch severity is CRITICAL instead of WARN.
 */
const CRITICAL_GROUPS: ContradictionGroup[] = [
  'DATA_READINESS'
];

// =============================================================================
// GAP THRESHOLDS
// =============================================================================

const GAP_THRESHOLD_1_5 = 1.2;  // On 1-5 adjusted scale
const GAP_THRESHOLD_0_100 = 30; // On 0-100 score scale

// =============================================================================
// TM-4 DETECTION
// =============================================================================

/**
 * Calculate average adjusted score for a role within a contradiction group.
 */
function getRoleAverageInGroup(
  answers: AnswerLookup,
  groupQuestions: Array<{ question_id: string; is_reverse: boolean; answer_type: string }>,
  role: Role
): { adjusted: number | null; score: number | null } {
  const roleAnswers = groupQuestions.filter(q => {
    const question = QUESTION_MAP.get(q.question_id);
    return question?.role === role && question?.answer_type === 'LIKERT';
  });
  
  const adjustedValues: number[] = [];
  const scoreValues: number[] = [];
  
  for (const q of roleAnswers) {
    const answer = answers[q.question_id];
    if (!answer || typeof answer.rawValue !== 'number') continue;
    
    const norm = normalise(answer.rawValue, q.is_reverse);
    adjustedValues.push(norm.adjusted);
    scoreValues.push(norm.score_0_100);
  }
  
  return {
    adjusted: averageOf(adjustedValues),
    score: averageOf(scoreValues)
  };
}

/**
 * Detect cross-role contradictions within a contradiction group.
 */
export function detectCrossRoleMismatch(
  answers: AnswerLookup,
  groupId: ContradictionGroup
): Flag[] {
  const flags: Flag[] = [];
  
  // Get questions in this group
  const groupQuestions = getContradictionGroup(groupId);
  
  if (groupQuestions.length < 2) {
    return flags;
  }
  
  // Get unique roles in this group
  const rolesInGroup = new Set(groupQuestions.map(q => q.role));
  const roles = Array.from(rolesInGroup);
  
  if (roles.length < 2) {
    return flags;
  }
  
  // Calculate average for each role
  const roleAverages: Map<Role, { adjusted: number | null; score: number | null }> = new Map();
  
  for (const role of roles) {
    const avg = getRoleAverageInGroup(answers, groupQuestions, role);
    if (avg.adjusted !== null) {
      roleAverages.set(role, avg);
    }
  }
  
  // Compare all pairs of roles
  const rolesList = Array.from(roleAverages.keys());
  
  for (let i = 0; i < rolesList.length; i++) {
    for (let j = i + 1; j < rolesList.length; j++) {
      const roleA = rolesList[i];
      const roleB = rolesList[j];
      
      const avgA = roleAverages.get(roleA)!;
      const avgB = roleAverages.get(roleB)!;
      
      const gap1_5 = Math.abs(avgA.adjusted! - avgB.adjusted!);
      const gap0_100 = Math.abs(avgA.score! - avgB.score!);
      
      // Check if gap exceeds threshold
      if (gap1_5 >= GAP_THRESHOLD_1_5 || gap0_100 >= GAP_THRESHOLD_0_100) {
        const isCriticalGroup = CRITICAL_GROUPS.includes(groupId);
        
        // Get question IDs involved
        const involvedQuestionIds = groupQuestions
          .filter(q => q.role === roleA || q.role === roleB)
          .map(q => q.question_id);
        
        flags.push({
          flag_id: 'CROSS_ROLE_MISMATCH',
          severity: isCriticalGroup ? 'CRITICAL' : 'WARN',
          evidence: {
            question_ids: involvedQuestionIds,
            raw_values: {
              [`${roleA}_adjusted`]: avgA.adjusted ?? 0,
              [`${roleB}_adjusted`]: avgB.adjusted ?? 0,
              [`${roleA}_score`]: avgA.score ?? 0,
              [`${roleB}_score`]: avgB.score ?? 0,
              gap_1_5: gap1_5,
              gap_0_100: gap0_100
            },
            roles: [roleA, roleB],
            group: groupId,
            gap: gap0_100,
            description: `${groupId}: ${roleA} (${avgA.score?.toFixed(1)}) vs ${roleB} (${avgB.score?.toFixed(1)}) — gap of ${gap0_100.toFixed(1)} points.`
          }
        });
      }
    }
  }
  
  return flags;
}

/**
 * Detect all TM-4 cross-role mismatches across all contradiction groups.
 */
export function detectAllTm4Flags(answers: AnswerLookup): Flag[] {
  const flags: Flag[] = [];
  
  // Get all unique contradiction groups
  const groups = new Set<ContradictionGroup>();
  for (const q of QUESTION_MAP.values()) {
    if (q.contradiction_group) {
      groups.add(q.contradiction_group);
    }
  }
  
  // Check each group
  for (const group of groups) {
    const groupFlags = detectCrossRoleMismatch(answers, group);
    flags.push(...groupFlags);
  }
  
  return flags;
}

/**
 * Get top mismatches sorted by gap size.
 */
export function getTopMismatches(flags: Flag[], limit: number = 5): Flag[] {
  return flags
    .filter(f => f.flag_id === 'CROSS_ROLE_MISMATCH')
    .sort((a, b) => (b.evidence.gap ?? 0) - (a.evidence.gap ?? 0))
    .slice(0, limit);
}

export default detectAllTm4Flags;
