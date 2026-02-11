/**
 * Forbidden Fields Middleware
 * 
 * BLOCKER: Participants must NEVER see these fields.
 * Enforced at API level (not just UI).
 * 
 * Forbidden fields:
 * - ics, recommendation, flags, dim_scores
 * - truth_mechanisms, contradiction_groups, pattern_categories
 * - weights, other_participant_answers, raw_open_text_from_others
 * - gate_status, flag_severity, triad_group_id, reverse_of
 */

// =============================================================================
// FORBIDDEN FIELD LISTS
// =============================================================================

/**
 * Fields that must NEVER be exposed to survey participants.
 */
export const PARTICIPANT_FORBIDDEN_FIELDS = [
  // Scoring
  'ics',
  'investment_clarity_score',
  'recommendation',
  'dim_scores',
  'dimension_scores',
  'role_dim_scores',
  'case_dim_scores',
  'score_0_100',
  'adjusted_value',
  
  // Flags
  'flags',
  'flag_id',
  'flag_severity',
  'severity',
  'gate_status',
  'gates',
  
  // Truth Mechanisms
  'truth_mechanisms',
  'tm_codes',
  'contradiction_group',
  'contradiction_groups',
  'pattern_category',
  'pattern_categories',
  'triad_group_id',
  'triad_role',
  'reverse_of',
  'is_reverse',
  'time_pair_group',
  'trigger_question_id',
  
  // Weights
  'weights',
  'role_weights',
  'dimension_weights',
  
  // Other participants
  'other_participant_answers',
  'raw_open_text_from_others',
  'all_responses',
  'participant_scores',
  
  // Internal
  'evidence',
  'raw_values',
  'blind_spots',
  'checklist_items',
  'ai_summary',
  'process_score',
  'process_readiness'
] as const;

export type ForbiddenField = typeof PARTICIPANT_FORBIDDEN_FIELDS[number];

// =============================================================================
// STRIPPING FUNCTIONS
// =============================================================================

/**
 * Recursively strip forbidden fields from an object.
 */
export function stripForbiddenFields<T extends Record<string, unknown>>(
  obj: T,
  forbiddenFields: readonly string[] = PARTICIPANT_FORBIDDEN_FIELDS
): Partial<T> {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => 
      typeof item === 'object' && item !== null
        ? stripForbiddenFields(item as Record<string, unknown>, forbiddenFields)
        : item
    ) as unknown as Partial<T>;
  }
  
  const result: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    // Skip forbidden fields
    if (forbiddenFields.includes(key)) {
      continue;
    }
    
    // Recursively process nested objects
    if (value !== null && typeof value === 'object') {
      result[key] = stripForbiddenFields(
        value as Record<string, unknown>,
        forbiddenFields
      );
    } else {
      result[key] = value;
    }
  }
  
  return result as Partial<T>;
}

/**
 * Check if an object contains any forbidden fields.
 */
export function containsForbiddenFields(
  obj: Record<string, unknown>,
  forbiddenFields: readonly string[] = PARTICIPANT_FORBIDDEN_FIELDS
): { contains: boolean; found: string[] } {
  const found: string[] = [];
  
  function check(o: unknown, path: string = ''): void {
    if (o === null || typeof o !== 'object') return;
    
    if (Array.isArray(o)) {
      o.forEach((item, i) => check(item, `${path}[${i}]`));
      return;
    }
    
    for (const [key, value] of Object.entries(o as Record<string, unknown>)) {
      const fullPath = path ? `${path}.${key}` : key;
      
      if (forbiddenFields.includes(key)) {
        found.push(fullPath);
      }
      
      if (value !== null && typeof value === 'object') {
        check(value, fullPath);
      }
    }
  }
  
  check(obj);
  
  return {
    contains: found.length > 0,
    found
  };
}

// =============================================================================
// MIDDLEWARE FOR NEXT.JS API ROUTES
// =============================================================================

import { NextResponse } from 'next/server';

/**
 * Wrap a response to strip forbidden fields for participants.
 */
export function participantSafeResponse<T extends Record<string, unknown>>(
  data: T,
  status: number = 200
): NextResponse {
  const safeData = stripForbiddenFields(data);
  return NextResponse.json(safeData, { status });
}

/**
 * Check if request is from a participant (vs admin/initiator).
 * Participants access via /survey/[token] routes.
 */
export function isParticipantRequest(pathname: string): boolean {
  return pathname.includes('/survey/') || pathname.includes('/participant/');
}

// =============================================================================
// SAFE QUESTION CONFIG FOR PARTICIPANTS
// =============================================================================

import { QuestionConfig } from '../questions/types';

/**
 * Strip internal fields from question config for participant display.
 */
export function safeQuestionConfig(q: QuestionConfig): Partial<QuestionConfig> {
  return {
    question_id: q.question_id,
    text: q.text,
    role: q.role,
    answer_type: q.answer_type,
    options: q.options,
    order: q.order
    // Deliberately exclude: dimension, truth_mechanisms, pattern_category,
    // contradiction_group, is_reverse, reverse_of, time_pair_group, etc.
  };
}

/**
 * Get safe questions for a role (for participant survey display).
 */
export function getSafeQuestionsForRole(
  questions: QuestionConfig[]
): Partial<QuestionConfig>[] {
  return questions.map(safeQuestionConfig);
}

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Validate that a response doesn't leak forbidden data.
 * Use in tests to catch accidental leaks.
 */
export function validateNoLeaks(
  obj: Record<string, unknown>,
  context: string = ''
): void {
  const { contains, found } = containsForbiddenFields(obj);
  
  if (contains) {
    throw new Error(
      `[SECURITY] Forbidden fields leaked${context ? ` in ${context}` : ''}: ${found.join(', ')}`
    );
  }
}

export default stripForbiddenFields;
