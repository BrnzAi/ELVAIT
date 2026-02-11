/**
 * TM-8: Weaponized Open Text (AI Classification)
 * 
 * Classifies open text responses into predefined categories.
 * AI is strictly bounded - can ONLY return one of 7 categories.
 * 
 * Categories:
 * - Known risk
 * - Avoided topic
 * - Role conflict / politics
 * - Cultural resistance / adoption
 * - Technical uncertainty
 * - Process instability
 * - Data quality issues
 * 
 * Open text does NOT contribute to ICS - only to blind spots and narrative.
 */

import { Flag, Role, OpenTextCategory, OPEN_TEXT_CATEGORIES } from '../questions/types';
import { getOpenTextQuestions, QUESTION_MAP } from '../questions/registry';

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

export interface OpenTextClassification {
  questionId: string;
  role: Role;
  category: OpenTextCategory;
  confidence: number;
  triggerQuestionId: string | null;
}

// =============================================================================
// AI CLASSIFIER (STRICTLY BOUNDED)
// =============================================================================

/**
 * Classify open text into one of 7 predefined categories.
 * 
 * CRITICAL RULE: AI must return ONLY one of the predefined categories.
 * No new categories may be invented.
 * 
 * @param text - The open text response to classify
 * @returns The classified category
 */
export async function classifyOpenText(text: string): Promise<{
  category: OpenTextCategory;
  confidence: number;
}> {
  // If text is empty or too short, default to "Known risk"
  if (!text || text.trim().length < 10) {
    return { category: 'Known risk', confidence: 0.5 };
  }
  
  // For now, use keyword-based classification as fallback
  // In production, this would call OpenAI/Claude API
  return classifyByKeywords(text);
}

/**
 * Keyword-based classification fallback.
 * Used when AI API is not available or for testing.
 */
function classifyByKeywords(text: string): {
  category: OpenTextCategory;
  confidence: number;
} {
  const lower = text.toLowerCase();
  
  // Check for each category
  const scores: Record<OpenTextCategory, number> = {
    'Known risk': 0,
    'Avoided topic': 0,
    'Role conflict / politics': 0,
    'Cultural resistance / adoption': 0,
    'Technical uncertainty': 0,
    'Process instability': 0,
    'Data quality issues': 0
  };
  
  // Data quality keywords
  if (lower.includes('data') || lower.includes('quality') || lower.includes('accuracy') ||
      lower.includes('incomplete') || lower.includes('missing data')) {
    scores['Data quality issues'] += 3;
  }
  
  // Technical uncertainty keywords
  if (lower.includes('technical') || lower.includes('integration') || lower.includes('architecture') ||
      lower.includes('system') || lower.includes('complexity') || lower.includes('infrastructure')) {
    scores['Technical uncertainty'] += 3;
  }
  
  // Process instability keywords
  if (lower.includes('process') || lower.includes('workflow') || lower.includes('bottleneck') ||
      lower.includes('manual') || lower.includes('inconsistent')) {
    scores['Process instability'] += 3;
  }
  
  // Cultural resistance keywords
  if (lower.includes('adoption') || lower.includes('resistance') || lower.includes('change') ||
      lower.includes('training') || lower.includes('culture') || lower.includes('user')) {
    scores['Cultural resistance / adoption'] += 3;
  }
  
  // Role conflict keywords
  if (lower.includes('politics') || lower.includes('conflict') || lower.includes('blame') ||
      lower.includes('responsibility') || lower.includes('ownership') || lower.includes('power')) {
    scores['Role conflict / politics'] += 3;
  }
  
  // Avoided topic keywords
  if (lower.includes('avoid') || lower.includes('elephant') || lower.includes('unspoken') ||
      lower.includes('taboo') || lower.includes('sensitive') || lower.includes('hidden')) {
    scores['Avoided topic'] += 3;
  }
  
  // Known risk is default/general
  if (lower.includes('risk') || lower.includes('concern') || lower.includes('worry') ||
      lower.includes('problem') || lower.includes('issue') || lower.includes('challenge')) {
    scores['Known risk'] += 2;
  }
  
  // Find highest scoring category
  let maxScore = 0;
  let bestCategory: OpenTextCategory = 'Known risk';
  
  for (const [category, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      bestCategory = category as OpenTextCategory;
    }
  }
  
  // Confidence based on score differentiation
  const confidence = maxScore > 0 ? Math.min(0.9, 0.5 + (maxScore * 0.1)) : 0.5;
  
  return { category: bestCategory, confidence };
}

/**
 * Validate that a category is one of the allowed values.
 */
export function isValidCategory(category: string): category is OpenTextCategory {
  return OPEN_TEXT_CATEGORIES.includes(category as OpenTextCategory);
}

// =============================================================================
// TM-8 PROCESSING
// =============================================================================

/**
 * Process all open text answers and classify them.
 * 
 * @param answers - Map of questionId -> answer data
 * @returns Array of classifications
 */
export async function processOpenText(
  answers: AnswerLookup
): Promise<OpenTextClassification[]> {
  const classifications: OpenTextClassification[] = [];
  
  // Get all open text questions (TM-8 tagged)
  const openTextQuestions = getOpenTextQuestions();
  
  for (const q of openTextQuestions) {
    const answer = answers[q.question_id];
    if (!answer) continue;
    
    const text = String(answer.rawValue).trim();
    
    // Skip empty responses
    if (!text || text.length < 5) continue;
    
    // Check trigger question was answered (if required)
    if (q.trigger_question_id) {
      const triggerAnswer = answers[q.trigger_question_id];
      if (!triggerAnswer) continue; // Skip if trigger not answered
    }
    
    // Classify the text
    const { category, confidence } = await classifyOpenText(text);
    
    classifications.push({
      questionId: q.question_id,
      role: answer.role,
      category,
      confidence,
      triggerQuestionId: q.trigger_question_id
    });
  }
  
  return classifications;
}

/**
 * Generate flags from open text classifications.
 * Note: Open text contributes to blind spots, not direct flags.
 * Returns empty array as open text signals are handled separately.
 */
export function detectTm8Flags(classifications: OpenTextClassification[]): Flag[] {
  // Open text does not generate direct flags
  // It contributes to blind spot ranking and narrative mismatch
  // Return empty array - classifications are used in interpretation layer
  return [];
}

/**
 * Get category distribution for reporting.
 */
export function getCategoryDistribution(
  classifications: OpenTextClassification[]
): Record<OpenTextCategory, number> {
  const distribution: Record<OpenTextCategory, number> = {
    'Known risk': 0,
    'Avoided topic': 0,
    'Role conflict / politics': 0,
    'Cultural resistance / adoption': 0,
    'Technical uncertainty': 0,
    'Process instability': 0,
    'Data quality issues': 0
  };
  
  for (const c of classifications) {
    distribution[c.category]++;
  }
  
  return distribution;
}

/**
 * Get most common category from classifications.
 */
export function getMostCommonCategory(
  classifications: OpenTextClassification[]
): OpenTextCategory | null {
  if (classifications.length === 0) return null;
  
  const distribution = getCategoryDistribution(classifications);
  
  let maxCount = 0;
  let mostCommon: OpenTextCategory | null = null;
  
  for (const [category, count] of Object.entries(distribution)) {
    if (count > maxCount) {
      maxCount = count;
      mostCommon = category as OpenTextCategory;
    }
  }
  
  return mostCommon;
}

export default processOpenText;
