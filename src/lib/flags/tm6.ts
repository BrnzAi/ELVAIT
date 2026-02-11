/**
 * TM-6: Forced Trade-offs
 * 
 * Detects capacity illusion when stakeholders claim nothing
 * will be deprioritized or impacted.
 * 
 * Flags:
 * - CAPACITY_ILLUSION_BUSINESS (WARN): B9 = "Nothing will be deprioritized"
 * - CAPACITY_ILLUSION_TECH (WARN): T6 = "Nothing critical will be impacted"
 * - CAPACITY_ILLUSION_CONFIRMED (CRITICAL): Both BUSINESS + TECH triggered
 */

import { Flag, Role } from '../questions/types';
import { getTradeOffQuestions } from '../questions/registry';

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
// NOTHING VALUES
// =============================================================================

const NOTHING_VALUES = [
  'Nothing will be deprioritized',
  'Nothing critical will be impacted',
  'Nothing'
];

// =============================================================================
// TM-6 DETECTION
// =============================================================================

/**
 * Detect TM-6 forced trade-off flags.
 * 
 * @param answers - Map of questionId -> answer data
 * @returns Array of flags detected
 */
export function detectTm6Flags(answers: AnswerLookup): Flag[] {
  const flags: Flag[] = [];
  
  // Track which illusions are triggered
  let businessIllusion = false;
  let techIllusion = false;
  let userIllusion = false;
  
  const businessAnswer: { questionId: string; value: string; role: Role } | null = null;
  const techAnswer: { questionId: string; value: string; role: Role } | null = null;
  
  // Get all trade-off questions (TM-6 tagged)
  const tradeOffQuestions = getTradeOffQuestions();
  
  // Check each trade-off question
  for (const q of tradeOffQuestions) {
    const answer = answers[q.question_id];
    if (!answer) continue;
    
    const value = String(answer.rawValue);
    const isNothing = NOTHING_VALUES.some(v =>
      value.toLowerCase().includes(v.toLowerCase())
    );
    
    if (!isNothing) continue;
    
    // Categorize by role
    switch (answer.role) {
      case 'BUSINESS_OWNER':
        businessIllusion = true;
        flags.push({
          flag_id: 'CAPACITY_ILLUSION_BUSINESS',
          severity: 'WARN',
          evidence: {
            question_ids: [q.question_id],
            raw_values: { [q.question_id]: value },
            roles: [answer.role],
            description: `Business claims nothing will be deprioritized: "${value}"`
          }
        });
        break;
        
      case 'TECH_OWNER':
        techIllusion = true;
        flags.push({
          flag_id: 'CAPACITY_ILLUSION_TECH',
          severity: 'WARN',
          evidence: {
            question_ids: [q.question_id],
            raw_values: { [q.question_id]: value },
            roles: [answer.role],
            description: `Technical team claims nothing critical will be impacted: "${value}"`
          }
        });
        break;
        
      case 'USER':
        userIllusion = true;
        // User "Nothing" contributes to friction score but not standalone flag
        break;
    }
  }
  
  // Check for confirmed capacity illusion (both business AND tech)
  if (businessIllusion && techIllusion) {
    // Find the specific question IDs for evidence
    const businessQs = tradeOffQuestions.filter(q => {
      const a = answers[q.question_id];
      return a?.role === 'BUSINESS_OWNER';
    });
    const techQs = tradeOffQuestions.filter(q => {
      const a = answers[q.question_id];
      return a?.role === 'TECH_OWNER';
    });
    
    const questionIds = [
      ...businessQs.map(q => q.question_id),
      ...techQs.map(q => q.question_id)
    ];
    
    const rawValues: Record<string, string | number> = {};
    for (const qId of questionIds) {
      const a = answers[qId];
      if (a) rawValues[qId] = a.rawValue;
    }
    
    flags.push({
      flag_id: 'CAPACITY_ILLUSION_CONFIRMED',
      severity: 'CRITICAL',
      evidence: {
        question_ids: questionIds,
        raw_values: rawValues,
        roles: ['BUSINESS_OWNER', 'TECH_OWNER'],
        description: 'Both Business and Technical owners claim nothing will be impacted — indicating unrealistic capacity assumptions.'
      }
    });
  }
  
  return flags;
}

/**
 * Check if a specific answer triggers capacity illusion.
 */
export function isCapacityIllusion(value: string): boolean {
  return NOTHING_VALUES.some(v =>
    value.toLowerCase().includes(v.toLowerCase())
  );
}

/**
 * Get capacity illusion summary for reporting.
 */
export function getCapacityIllusionSummary(answers: AnswerLookup): {
  business: boolean;
  tech: boolean;
  user: boolean;
  confirmed: boolean;
  answers: Array<{ questionId: string; role: Role; value: string }>;
} {
  const tradeOffQuestions = getTradeOffQuestions();
  
  let business = false;
  let tech = false;
  let user = false;
  
  const illusionAnswers: Array<{ questionId: string; role: Role; value: string }> = [];
  
  for (const q of tradeOffQuestions) {
    const answer = answers[q.question_id];
    if (!answer) continue;
    
    const value = String(answer.rawValue);
    if (!isCapacityIllusion(value)) continue;
    
    illusionAnswers.push({
      questionId: q.question_id,
      role: answer.role,
      value
    });
    
    switch (answer.role) {
      case 'BUSINESS_OWNER': business = true; break;
      case 'TECH_OWNER': tech = true; break;
      case 'USER': user = true; break;
    }
  }
  
  return {
    business,
    tech,
    user,
    confirmed: business && tech,
    answers: illusionAnswers
  };
}

export default detectTm6Flags;
