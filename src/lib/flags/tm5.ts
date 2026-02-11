/**
 * TM-5: Ownership Diffusion Detection
 * 
 * Detects when ownership/accountability is unclear across roles,
 * indicating potential governance issues.
 * 
 * Flag: OWNERSHIP_DIFFUSION (CRITICAL)
 * Triggers:
 * - >= 3 unique ownership answers across roles
 * - OR any answer = "Not clearly defined" / "No clear owner"
 */

import { Flag, Role } from '../questions/types';
import { getOwnershipQuestions } from '../questions/registry';

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
// UNCLEAR OWNERSHIP VALUES
// =============================================================================

const UNCLEAR_OWNERSHIP_VALUES = [
  'Not clearly defined',
  'No clear owner',
  'Not defined',
  'Unclear'
];

// =============================================================================
// TM-5 DETECTION
// =============================================================================

/**
 * Detect ownership diffusion.
 * 
 * @param answers - Map of questionId -> answer data
 * @returns Array of flags detected (0 or 1)
 */
export function detectTm5Flags(answers: AnswerLookup): Flag[] {
  const flags: Flag[] = [];
  
  // Get all ownership questions (TM-5 tagged)
  const ownershipQuestions = getOwnershipQuestions();
  
  // Collect all ownership answers
  const ownershipAnswers: Array<{
    questionId: string;
    value: string;
    role: Role;
  }> = [];
  
  for (const q of ownershipQuestions) {
    const answer = answers[q.question_id];
    if (!answer) continue;
    
    ownershipAnswers.push({
      questionId: q.question_id,
      value: String(answer.rawValue),
      role: answer.role
    });
  }
  
  if (ownershipAnswers.length === 0) {
    return flags;
  }
  
  // Check for unclear ownership
  const hasUnclearOwnership = ownershipAnswers.some(a =>
    UNCLEAR_OWNERSHIP_VALUES.some(v =>
      a.value.toLowerCase().includes(v.toLowerCase())
    )
  );
  
  // Count unique ownership answers
  const uniqueAnswers = new Set(
    ownershipAnswers.map(a => normalizeOwnershipValue(a.value))
  );
  
  // Trigger conditions
  const hasDiffusion = uniqueAnswers.size >= 3 || hasUnclearOwnership;
  
  if (hasDiffusion) {
    const questionIds = ownershipAnswers.map(a => a.questionId);
    const rawValues: Record<string, string | number> = {};
    const roles = new Set<Role>();
    
    for (const a of ownershipAnswers) {
      rawValues[a.questionId] = a.value;
      roles.add(a.role);
    }
    
    let description: string;
    if (hasUnclearOwnership && uniqueAnswers.size >= 3) {
      description = `Ownership is both unclear and fragmented: ${uniqueAnswers.size} different answers including "Not clearly defined".`;
    } else if (hasUnclearOwnership) {
      description = `At least one role indicates ownership is "Not clearly defined".`;
    } else {
      description = `${uniqueAnswers.size} different ownership answers across roles: ${Array.from(uniqueAnswers).join(', ')}.`;
    }
    
    flags.push({
      flag_id: 'OWNERSHIP_DIFFUSION',
      severity: 'CRITICAL',
      evidence: {
        question_ids: questionIds,
        raw_values: rawValues,
        roles: Array.from(roles),
        description
      }
    });
  }
  
  return flags;
}

/**
 * Normalize ownership value for comparison.
 * Handles minor variations in wording.
 */
function normalizeOwnershipValue(value: string): string {
  const lower = value.toLowerCase().trim();
  
  // Normalize common variations
  if (lower.includes('business owner')) return 'Business Owner';
  if (lower.includes('executive')) return 'Executive Sponsor';
  if (lower.includes('it') || lower.includes('technical')) return 'IT / Technical Team';
  if (lower.includes('joint')) return 'Joint responsibility';
  if (lower.includes('not') && (lower.includes('defined') || lower.includes('clear'))) {
    return 'Not clearly defined';
  }
  if (lower.includes('clearly defined role')) return 'A clearly defined role';
  if (lower.includes('multiple') || lower.includes('shared')) return 'Multiple shared roles';
  if (lower.includes('no clear')) return 'No clear owner';
  
  return value;
}

/**
 * Get ownership summary for reporting.
 */
export function getOwnershipSummary(answers: AnswerLookup): {
  answers: Array<{ role: Role; questionId: string; value: string }>;
  uniqueCount: number;
  hasUnclear: boolean;
  isDiffused: boolean;
} {
  const ownershipQuestions = getOwnershipQuestions();
  
  const ownershipAnswers: Array<{
    role: Role;
    questionId: string;
    value: string;
  }> = [];
  
  for (const q of ownershipQuestions) {
    const answer = answers[q.question_id];
    if (!answer) continue;
    
    ownershipAnswers.push({
      role: answer.role,
      questionId: q.question_id,
      value: String(answer.rawValue)
    });
  }
  
  const uniqueAnswers = new Set(
    ownershipAnswers.map(a => normalizeOwnershipValue(a.value))
  );
  
  const hasUnclear = ownershipAnswers.some(a =>
    UNCLEAR_OWNERSHIP_VALUES.some(v =>
      a.value.toLowerCase().includes(v.toLowerCase())
    )
  );
  
  return {
    answers: ownershipAnswers,
    uniqueCount: uniqueAnswers.size,
    hasUnclear,
    isDiffused: uniqueAnswers.size >= 3 || hasUnclear
  };
}

export default detectTm5Flags;
