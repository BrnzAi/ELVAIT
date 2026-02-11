/**
 * Scoring Normalization
 * 
 * Handles Likert scale normalization and reverse scoring.
 * 
 * BLOCKER RULES:
 * - Reverse scoring: adjusted = 6 - raw for all is_reverse=true questions
 * - Score 0-100: (adjusted - 1) * 25
 * 
 * Examples:
 * - Normal:  raw=1 → adj=1 → score=0,   raw=5 → adj=5 → score=100
 * - Reverse: raw=1 → adj=5 → score=100, raw=5 → adj=1 → score=0
 */

// =============================================================================
// TYPES
// =============================================================================

export interface NormalisedScore {
  /** Original raw value (1-5 Likert) */
  raw: number;
  
  /** Adjusted value after reverse scoring (1-5) */
  adjusted: number;
  
  /** Scaled score (0-100) */
  score_0_100: number;
  
  /** Whether reverse scoring was applied */
  is_reverse: boolean;
}

// =============================================================================
// NORMALISATION FUNCTIONS
// =============================================================================

/**
 * Normalise a Likert response value.
 * 
 * @param raw - Raw value from survey (1-5 Likert scale)
 * @param is_reverse - Whether this is a reverse-scored question
 * @returns Normalised score object
 * 
 * @example
 * // Normal question
 * normalise(5, false) // { raw: 5, adjusted: 5, score_0_100: 100 }
 * 
 * @example
 * // Reverse question (high raw = low clarity)
 * normalise(5, true) // { raw: 5, adjusted: 1, score_0_100: 0 }
 */
export function normalise(raw: number, is_reverse: boolean): NormalisedScore {
  // Validate input
  if (raw < 1 || raw > 5 || !Number.isInteger(raw)) {
    throw new Error(`Invalid Likert value: ${raw}. Must be integer 1-5.`);
  }
  
  // Apply reverse scoring if needed
  // BLOCKER RULE: adjusted = 6 - raw for is_reverse=true
  const adjusted = is_reverse ? (6 - raw) : raw;
  
  // Convert to 0-100 scale
  // BLOCKER RULE: score_0_100 = (adjusted - 1) * 25
  const score_0_100 = (adjusted - 1) * 25;
  
  return {
    raw,
    adjusted,
    score_0_100,
    is_reverse
  };
}

/**
 * Batch normalise multiple Likert values.
 * 
 * @param values - Array of { raw, is_reverse } objects
 * @returns Array of normalised scores
 */
export function normaliseMany(
  values: Array<{ raw: number; is_reverse: boolean }>
): NormalisedScore[] {
  return values.map(v => normalise(v.raw, v.is_reverse));
}

/**
 * Calculate average score from multiple normalised values.
 * Returns null if no values provided.
 * 
 * @param scores - Array of normalised scores
 * @returns Average score (0-100) or null
 */
export function averageScore(scores: NormalisedScore[]): number | null {
  if (scores.length === 0) return null;
  
  const sum = scores.reduce((acc, s) => acc + s.score_0_100, 0);
  return sum / scores.length;
}

/**
 * Calculate average from raw 0-100 scores.
 * Returns null if array is empty.
 */
export function averageOf(scores: number[]): number | null {
  if (scores.length === 0) return null;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

/**
 * Round score to specified decimal places (default 1)
 */
export function roundScore(score: number, decimals: number = 1): number {
  const factor = Math.pow(10, decimals);
  return Math.round(score * factor) / factor;
}

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

/**
 * Check if a value is a valid Likert score (1-5 integer)
 */
export function isValidLikert(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 5
  );
}

/**
 * Parse a Likert value from string or number
 */
export function parseLikert(value: string | number): number {
  const num = typeof value === 'string' ? parseInt(value, 10) : value;
  
  if (!isValidLikert(num)) {
    throw new Error(`Invalid Likert value: ${value}`);
  }
  
  return num;
}

// =============================================================================
// SCORE INTERPRETATION
// =============================================================================

export type ScoreInterpretation = 'LOW' | 'MEDIUM' | 'HIGH';

/**
 * Interpret a 0-100 score into categories
 */
export function interpretScore(score: number): ScoreInterpretation {
  if (score < 55) return 'LOW';
  if (score < 75) return 'MEDIUM';
  return 'HIGH';
}

/**
 * Get ICS label based on score
 * 
 * @param ics - Investment Clarity Score (0-100)
 * @returns Human-readable interpretation
 */
export function getIcsLabel(ics: number): string {
  if (ics < 55) return 'Low clarity / high risk';
  if (ics < 75) return 'Partial clarity / clarification required';
  return 'High clarity / ready to proceed if no critical flags';
}

/**
 * Get short ICS label
 */
export function getIcsLabelShort(ics: number): string {
  if (ics < 55) return 'Low Clarity';
  if (ics < 75) return 'Partial Clarity';
  return 'High Clarity';
}

export default normalise;
