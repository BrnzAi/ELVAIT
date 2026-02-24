/**
 * TM-1: Reversed Logic Contradictions
 * 
 * Detects within-role contradictions where both a positive and its
 * reversed counterpart are scored high, indicating inconsistent responses.
 * 
 * Flag: WITHIN_ROLE_CONTRADICTION (WARN)
 * Trigger: adjusted(q_pos) >= 4 AND adjusted(q_rev) >= 4
 */

import { Flag, Role, QuestionConfig } from '../questions/types';
import { QUESTION_MAP, getReversedQuestions } from '../questions/registry';
import { normalise } from '../scoring/normalise';

// =============================================================================
// TYPES
// =============================================================================

export interface AnswerLookup {
  [questionId: string]: {
    rawValue: number;
    participantId: string;
    role: Role;
  };
}

// =============================================================================
// TM-1 DETECTION
// =============================================================================

/**
 * Detect TM-1 reversed logic contradictions.
 * 
 * For each reversed question pair:
 * - If both adjusted scores >= 4, flag WITHIN_ROLE_CONTRADICTION
 * 
 * @param answers - Map of questionId -> answer data
 * @returns Array of flags detected
 */
export function detectTm1Flags(answers: AnswerLookup): Flag[] {
  const flags: Flag[] = [];
  
  // Get all reversed questions
  const reversedQuestions = getReversedQuestions();
  
  for (const revQ of reversedQuestions) {
    // Skip if no reverse_of defined
    if (!revQ.reverse_of) continue;
    
    // Get the positive question
    const posQ = QUESTION_MAP.get(revQ.reverse_of);
    if (!posQ) continue;
    
    // Get answers for both questions
    const posAnswer = answers[posQ.question_id];
    const revAnswer = answers[revQ.question_id];
    
    // Skip if either answer is missing
    if (!posAnswer || !revAnswer) continue;
    
    // Skip if not same role (shouldn't happen, but validate)
    if (posAnswer.role !== revAnswer.role) continue;
    
    // Normalise both scores
    const posNorm = normalise(posAnswer.rawValue, posQ.is_reverse);
    const revNorm = normalise(revAnswer.rawValue, revQ.is_reverse);
    
    // Check for contradiction: both adjusted >= 4
    if (posNorm.adjusted >= 4 && revNorm.adjusted >= 4) {
      // Generate human-readable description using actual question text
      const posTextShort = posQ.text.length > 60 ? posQ.text.slice(0, 57) + '...' : posQ.text;
      const revTextShort = revQ.text.length > 60 ? revQ.text.slice(0, 57) + '...' : revQ.text;
      
      flags.push({
        flag_id: 'WITHIN_ROLE_CONTRADICTION',
        severity: 'WARN',
        evidence: {
          question_ids: [posQ.question_id, revQ.question_id],
          raw_values: {
            [posQ.question_id]: posAnswer.rawValue,
            [revQ.question_id]: revAnswer.rawValue
          },
          roles: [posAnswer.role],
          description: `The ${posAnswer.role.replace('_', ' ').toLowerCase()} strongly agreed with both "${posTextShort}" AND "${revTextShort}" — these statements contradict each other.`
        }
      });
    }
  }
  
  return flags;
}

/**
 * Detect contradictions within a contradiction group.
 * This handles cases where questions are linked by contradiction_group
 * rather than reverse_of.
 */
export function detectContradictionGroupFlags(
  answers: AnswerLookup,
  groupId: string
): Flag[] {
  const flags: Flag[] = [];
  
  // Get all questions in this contradiction group
  const groupQuestions = Array.from(QUESTION_MAP.values())
    .filter(q => q.contradiction_group === groupId);
  
  // Group by role
  const byRole = new Map<Role, typeof groupQuestions>();
  for (const q of groupQuestions) {
    const existing = byRole.get(q.role) ?? [];
    existing.push(q);
    byRole.set(q.role, existing);
  }
  
  // Check for contradictions within each role
  for (const [role, questions] of byRole) {
    if (questions.length < 2) continue;
    
    // Get reversed and non-reversed questions
    const reversed = questions.filter((q: QuestionConfig) => q.is_reverse);
    const nonReversed = questions.filter((q: QuestionConfig) => !q.is_reverse);
    
    // Check each pair
    for (const revQ of reversed) {
      for (const posQ of nonReversed) {
        const posAnswer = answers[posQ.question_id];
        const revAnswer = answers[revQ.question_id];
        
        if (!posAnswer || !revAnswer) continue;
        if (posAnswer.role !== role || revAnswer.role !== role) continue;
        
        const posNorm = normalise(posAnswer.rawValue, posQ.is_reverse);
        const revNorm = normalise(revAnswer.rawValue, revQ.is_reverse);
        
        if (posNorm.adjusted >= 4 && revNorm.adjusted >= 4) {
          // Generate human-readable description using actual question text
          const posTextShort = posQ.text.length > 60 ? posQ.text.slice(0, 57) + '...' : posQ.text;
          const revTextShort = revQ.text.length > 60 ? revQ.text.slice(0, 57) + '...' : revQ.text;
          
          flags.push({
            flag_id: 'WITHIN_ROLE_CONTRADICTION',
            severity: 'WARN',
            evidence: {
              question_ids: [posQ.question_id, revQ.question_id],
              raw_values: {
                [posQ.question_id]: posAnswer.rawValue,
                [revQ.question_id]: revAnswer.rawValue
              },
              roles: [role],
              group: groupId,
              description: `The ${role.replace('_', ' ').toLowerCase()} gave contradictory responses: agreed with both "${posTextShort}" AND "${revTextShort}".`
            }
          });
        }
      }
    }
  }
  
  return flags;
}

export default detectTm1Flags;
