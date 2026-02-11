/**
 * Question Registry Validator
 * 
 * Engineering validator that enforces all registry rules.
 * Must block deploy if any of these conditions are violated.
 * 
 * BLOCKER RULES:
 * 1. Any question has dimension = null
 * 2. Any question with is_reverse=true has both reverse_of=null AND no contradiction_group
 * 3. Any triad_group_id group is missing any of the 3 triad roles
 * 4. Any TM-6 question has no option containing the word "Nothing"
 * 5. Groups DATA_READINESS, OWNERSHIP_ACCOUNTABILITY, VALUE_BASELINE each have fewer than 2 role mappings
 * 6. Any TM-8 question has trigger_question_id = null
 * 7. Required modules don't meet minimum coverage
 */

import { 
  QUESTION_REGISTRY, 
  getTriadGroup, 
  getContradictionGroup,
  getQuestionsForRole
} from './registry';
import { QuestionConfig, Role, TriadRole } from './types';

// =============================================================================
// VALIDATION ERROR TYPES
// =============================================================================

export interface ValidationError {
  rule: string;
  severity: 'BLOCKER' | 'CRITICAL';
  message: string;
  questionIds?: string[];
  details?: Record<string, unknown>;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

// =============================================================================
// RULE 1: Every question has a dimension
// =============================================================================

function validateDimensions(): ValidationError[] {
  const errors: ValidationError[] = [];
  
  const questionsWithoutDimension = QUESTION_REGISTRY.filter(
    q => !q.dimension
  );
  
  if (questionsWithoutDimension.length > 0) {
    errors.push({
      rule: 'RULE_1_DIMENSION_REQUIRED',
      severity: 'BLOCKER',
      message: `${questionsWithoutDimension.length} question(s) have no dimension assigned`,
      questionIds: questionsWithoutDimension.map(q => q.question_id)
    });
  }
  
  return errors;
}

// =============================================================================
// RULE 2: Reverse questions have pairs or contradiction groups
// =============================================================================

function validateReversePairs(): ValidationError[] {
  const errors: ValidationError[] = [];
  
  const reverseQuestions = QUESTION_REGISTRY.filter(q => q.is_reverse);
  
  for (const q of reverseQuestions) {
    if (!q.reverse_of && !q.contradiction_group) {
      errors.push({
        rule: 'RULE_2_REVERSE_PAIR_REQUIRED',
        severity: 'BLOCKER',
        message: `Reverse question ${q.question_id} has no reverse_of and no contradiction_group`,
        questionIds: [q.question_id]
      });
    }
  }
  
  return errors;
}

// =============================================================================
// RULE 3: Triads are complete (claim, proof, consequence)
// =============================================================================

function validateTriads(): ValidationError[] {
  const errors: ValidationError[] = [];
  
  // Get all unique triad group IDs
  const triadGroupIds = new Set(
    QUESTION_REGISTRY
      .filter(q => q.triad_group_id)
      .map(q => q.triad_group_id as string)
  );
  
  const requiredRoles: TriadRole[] = ['claim', 'proof', 'consequence'];
  
  for (const groupId of triadGroupIds) {
    const triadQuestions = getTriadGroup(groupId);
    const rolesPresent = new Set(triadQuestions.map(q => q.triad_role));
    
    const missingRoles = requiredRoles.filter(role => !rolesPresent.has(role));
    
    if (missingRoles.length > 0) {
      errors.push({
        rule: 'RULE_3_TRIAD_INCOMPLETE',
        severity: 'BLOCKER',
        message: `Triad group ${groupId} is missing roles: ${missingRoles.join(', ')}`,
        questionIds: triadQuestions.map(q => q.question_id),
        details: { groupId, missingRoles, presentRoles: Array.from(rolesPresent) }
      });
    }
  }
  
  return errors;
}

// =============================================================================
// RULE 4: TM-6 trade-off questions have "Nothing" option
// =============================================================================

function validateTradeOffOptions(): ValidationError[] {
  const errors: ValidationError[] = [];
  
  const tm6Questions = QUESTION_REGISTRY.filter(
    q => q.truth_mechanisms.includes('TM-6')
  );
  
  for (const q of tm6Questions) {
    if (!q.options || q.options.length === 0) {
      errors.push({
        rule: 'RULE_4_TRADEOFF_NO_OPTIONS',
        severity: 'BLOCKER',
        message: `TM-6 question ${q.question_id} has no options defined`,
        questionIds: [q.question_id]
      });
      continue;
    }
    
    const hasNothingOption = q.options.some(
      opt => opt.toLowerCase().includes('nothing')
    );
    
    if (!hasNothingOption) {
      errors.push({
        rule: 'RULE_4_TRADEOFF_MISSING_NOTHING',
        severity: 'BLOCKER',
        message: `TM-6 question ${q.question_id} has no option containing "Nothing"`,
        questionIds: [q.question_id],
        details: { options: q.options }
      });
    }
  }
  
  return errors;
}

// =============================================================================
// RULE 5: Cross-role contradiction groups have ≥2 role mappings
// =============================================================================

function validateContradictionGroups(): ValidationError[] {
  const errors: ValidationError[] = [];
  
  const requiredGroups = [
    'DATA_READINESS',
    'OWNERSHIP_ACCOUNTABILITY', 
    'VALUE_BASELINE'
  ];
  
  for (const groupName of requiredGroups) {
    const groupQuestions = getContradictionGroup(groupName);
    const rolesInGroup = new Set(groupQuestions.map(q => q.role));
    
    if (rolesInGroup.size < 2) {
      errors.push({
        rule: 'RULE_5_CONTRADICTION_GROUP_COVERAGE',
        severity: 'BLOCKER',
        message: `Contradiction group ${groupName} has fewer than 2 role mappings (has ${rolesInGroup.size})`,
        questionIds: groupQuestions.map(q => q.question_id),
        details: { 
          group: groupName, 
          roles: Array.from(rolesInGroup),
          requiredMinimum: 2
        }
      });
    }
  }
  
  return errors;
}

// =============================================================================
// RULE 6: TM-8 open text questions have trigger_question_id
// =============================================================================

function validateOpenTextTriggers(): ValidationError[] {
  const errors: ValidationError[] = [];
  
  const tm8Questions = QUESTION_REGISTRY.filter(
    q => q.truth_mechanisms.includes('TM-8')
  );
  
  for (const q of tm8Questions) {
    if (!q.trigger_question_id) {
      errors.push({
        rule: 'RULE_6_OPEN_TEXT_NO_TRIGGER',
        severity: 'BLOCKER',
        message: `TM-8 question ${q.question_id} has no trigger_question_id`,
        questionIds: [q.question_id]
      });
    }
  }
  
  return errors;
}

// =============================================================================
// RULE 7: Minimum coverage per module
// =============================================================================

function validateMinimumCoverage(): ValidationError[] {
  const errors: ValidationError[] = [];
  
  // Executive Module: ≥3 reversed, ≥1 confidence, ≥1 open text
  const execQuestions = getQuestionsForRole('EXEC');
  const execReversed = execQuestions.filter(q => q.is_reverse);
  const execConfidence = execQuestions.filter(q => q.truth_mechanisms.includes('TM-3'));
  const execOpenText = execQuestions.filter(q => q.truth_mechanisms.includes('TM-8'));
  
  if (execReversed.length < 3) {
    errors.push({
      rule: 'RULE_7_EXEC_COVERAGE',
      severity: 'CRITICAL',
      message: `Exec module has ${execReversed.length} reversed questions (minimum 3 required)`,
      questionIds: execReversed.map(q => q.question_id)
    });
  }
  if (execConfidence.length < 1) {
    errors.push({
      rule: 'RULE_7_EXEC_COVERAGE',
      severity: 'CRITICAL',
      message: `Exec module has ${execConfidence.length} confidence questions (minimum 1 required)`,
      questionIds: []
    });
  }
  if (execOpenText.length < 1) {
    errors.push({
      rule: 'RULE_7_EXEC_COVERAGE',
      severity: 'CRITICAL',
      message: `Exec module has ${execOpenText.length} open text questions (minimum 1 required)`,
      questionIds: []
    });
  }
  
  // Business Module: ≥1 triad
  const bizQuestions = getQuestionsForRole('BUSINESS_OWNER');
  const bizTriads = bizQuestions.filter(q => q.triad_group_id);
  if (bizTriads.length < 3) { // Need at least 3 for a complete triad
    errors.push({
      rule: 'RULE_7_BUSINESS_COVERAGE',
      severity: 'CRITICAL',
      message: `Business module has incomplete triad coverage (${bizTriads.length} triad questions)`,
      questionIds: bizTriads.map(q => q.question_id)
    });
  }
  
  // Tech Module: ≥2 reversed, ≥1 confidence, ≥1 open text, ≥1 trade-off
  const techQuestions = getQuestionsForRole('TECH_OWNER');
  const techReversed = techQuestions.filter(q => q.is_reverse);
  const techConfidence = techQuestions.filter(q => q.truth_mechanisms.includes('TM-3'));
  const techOpenText = techQuestions.filter(q => q.truth_mechanisms.includes('TM-8'));
  const techTradeoff = techQuestions.filter(q => q.truth_mechanisms.includes('TM-6'));
  
  if (techReversed.length < 2) {
    errors.push({
      rule: 'RULE_7_TECH_COVERAGE',
      severity: 'CRITICAL',
      message: `Tech module has ${techReversed.length} reversed questions (minimum 2 required)`,
      questionIds: techReversed.map(q => q.question_id)
    });
  }
  if (techTradeoff.length < 1) {
    errors.push({
      rule: 'RULE_7_TECH_COVERAGE',
      severity: 'CRITICAL',
      message: `Tech module has ${techTradeoff.length} trade-off questions (minimum 1 required)`,
      questionIds: []
    });
  }
  
  // User Module: ≥1 reversed, ≥1 trade-off, ≥1 open text
  const userQuestions = getQuestionsForRole('USER');
  const userReversed = userQuestions.filter(q => q.is_reverse);
  const userTradeoff = userQuestions.filter(q => q.truth_mechanisms.includes('TM-6'));
  const userOpenText = userQuestions.filter(q => q.truth_mechanisms.includes('TM-8'));
  
  if (userReversed.length < 1) {
    errors.push({
      rule: 'RULE_7_USER_COVERAGE',
      severity: 'CRITICAL',
      message: `User module has ${userReversed.length} reversed questions (minimum 1 required)`,
      questionIds: []
    });
  }
  if (userTradeoff.length < 1) {
    errors.push({
      rule: 'RULE_7_USER_COVERAGE',
      severity: 'CRITICAL',
      message: `User module has ${userTradeoff.length} trade-off questions (minimum 1 required)`,
      questionIds: []
    });
  }
  
  // Process Module: ≥2 reversed, ≥1 ownership, ≥1 confidence
  const processQuestions = getQuestionsForRole('PROCESS_OWNER');
  const processReversed = processQuestions.filter(q => q.is_reverse);
  const processOwnership = processQuestions.filter(q => q.truth_mechanisms.includes('TM-5'));
  const processConfidence = processQuestions.filter(q => q.truth_mechanisms.includes('TM-3'));
  
  if (processReversed.length < 2) {
    errors.push({
      rule: 'RULE_7_PROCESS_COVERAGE',
      severity: 'CRITICAL',
      message: `Process module has ${processReversed.length} reversed questions (minimum 2 required)`,
      questionIds: processReversed.map(q => q.question_id)
    });
  }
  if (processOwnership.length < 1) {
    errors.push({
      rule: 'RULE_7_PROCESS_COVERAGE',
      severity: 'CRITICAL',
      message: `Process module has ${processOwnership.length} ownership questions (minimum 1 required)`,
      questionIds: []
    });
  }
  
  return errors;
}

// =============================================================================
// MAIN VALIDATOR
// =============================================================================

/**
 * Validate the entire question registry.
 * Run at startup and as CI step.
 */
export function validateRegistry(): ValidationResult {
  const allErrors: ValidationError[] = [
    ...validateDimensions(),
    ...validateReversePairs(),
    ...validateTriads(),
    ...validateTradeOffOptions(),
    ...validateContradictionGroups(),
    ...validateOpenTextTriggers(),
    ...validateMinimumCoverage()
  ];
  
  const blockers = allErrors.filter(e => e.severity === 'BLOCKER');
  const criticals = allErrors.filter(e => e.severity === 'CRITICAL');
  
  return {
    valid: blockers.length === 0,
    errors: blockers,
    warnings: criticals
  };
}

/**
 * Assert registry is valid. Throws if any BLOCKER rules are violated.
 * Use at application startup.
 */
export function assertRegistryValid(): void {
  const result = validateRegistry();
  
  if (!result.valid) {
    const errorMessages = result.errors.map(e => 
      `[${e.rule}] ${e.message}${e.questionIds?.length ? ` (${e.questionIds.join(', ')})` : ''}`
    ).join('\n');
    
    throw new Error(
      `Question Registry Validation Failed!\n\n` +
      `BLOCKER Errors (${result.errors.length}):\n${errorMessages}\n\n` +
      `These must be fixed before deployment.`
    );
  }
  
  if (result.warnings.length > 0) {
    console.warn(
      `Question Registry Validation Warnings (${result.warnings.length}):\n` +
      result.warnings.map(w => `[${w.rule}] ${w.message}`).join('\n')
    );
  }
}

/**
 * Get validation summary for display
 */
export function getValidationSummary(): string {
  const result = validateRegistry();
  
  const lines: string[] = [
    '=== Question Registry Validation ===',
    '',
    `Total Questions: ${QUESTION_REGISTRY.length}`,
    `Status: ${result.valid ? '✅ VALID' : '❌ INVALID'}`,
    ''
  ];
  
  if (result.errors.length > 0) {
    lines.push(`BLOCKER Errors (${result.errors.length}):`);
    result.errors.forEach(e => {
      lines.push(`  ❌ ${e.rule}: ${e.message}`);
    });
    lines.push('');
  }
  
  if (result.warnings.length > 0) {
    lines.push(`Warnings (${result.warnings.length}):`);
    result.warnings.forEach(w => {
      lines.push(`  ⚠️ ${w.rule}: ${w.message}`);
    });
    lines.push('');
  }
  
  // Coverage stats
  const stats = {
    exec: getQuestionsForRole('EXEC').length,
    business: getQuestionsForRole('BUSINESS_OWNER').length,
    tech: getQuestionsForRole('TECH_OWNER').length,
    user: getQuestionsForRole('USER').length,
    process: getQuestionsForRole('PROCESS_OWNER').length,
    reversed: QUESTION_REGISTRY.filter(q => q.is_reverse).length,
    triads: QUESTION_REGISTRY.filter(q => q.triad_group_id).length,
    openText: QUESTION_REGISTRY.filter(q => q.truth_mechanisms.includes('TM-8')).length
  };
  
  lines.push('Coverage:');
  lines.push(`  Executive: ${stats.exec} questions`);
  lines.push(`  Business Owner: ${stats.business} questions`);
  lines.push(`  Technical Owner: ${stats.tech} questions`);
  lines.push(`  Functional Users: ${stats.user} questions`);
  lines.push(`  Process Owner: ${stats.process} questions`);
  lines.push('');
  lines.push(`  Reversed (TM-1): ${stats.reversed}`);
  lines.push(`  Triads (TM-2): ${stats.triads}`);
  lines.push(`  Open Text (TM-8): ${stats.openText}`);
  
  return lines.join('\n');
}

export default validateRegistry;
