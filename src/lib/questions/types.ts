/**
 * Question Registry Types
 * 
 * Core type definitions for the survey question system.
 * This is the single source of truth for question metadata.
 */

// =============================================================================
// ROLES
// =============================================================================

export type Role = 
  | 'EXEC' 
  | 'BUSINESS_OWNER' 
  | 'TECH_OWNER' 
  | 'USER' 
  | 'PROCESS_OWNER';

export const ALL_ROLES: Role[] = [
  'EXEC',
  'BUSINESS_OWNER', 
  'TECH_OWNER',
  'USER',
  'PROCESS_OWNER'
];

// =============================================================================
// MODULES
// =============================================================================

export type Module = 
  | 'EXEC_MODULE' 
  | 'CORE_MODULE' 
  | 'USER_MODULE' 
  | 'PROCESS_MODULE';

// =============================================================================
// DIMENSIONS
// =============================================================================

export type Dimension = 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'P';

export const CORE_DIMENSIONS: Dimension[] = ['D1', 'D2', 'D3', 'D4', 'D5'];

export const DIMENSION_NAMES: Record<Dimension, string> = {
  D1: 'Strategic Intent',
  D2: 'Value & Economics',
  D3: 'Organizational Readiness',
  D4: 'Risk & Dependencies',
  D5: 'Decision Governance',
  P: 'Process Readiness'
};

// =============================================================================
// ANSWER TYPES
// =============================================================================

export type AnswerType = 'LIKERT' | 'SINGLE_SELECT' | 'MULTI_SELECT' | 'TEXT';

// =============================================================================
// TRUTH MECHANISMS
// =============================================================================

export type TruthMechanism = 
  | 'TM-1'   // Reversed Logic
  | 'TM-2'   // Claim → Proof → Consequence Triads
  | 'TM-3'   // Confidence vs Evidence
  | 'TM-4'   // Cross-Role Contradiction
  | 'TM-5'   // Ownership Diffusion
  | 'TM-6'   // Forced Trade-offs
  | 'TM-7'   // Time-Separated Consistency
  | 'TM-8';  // Weaponized Open Text

// =============================================================================
// PATTERN CATEGORIES (Controlled Enum)
// =============================================================================

export type PatternCategory =
  // Strategic / Narrative
  | 'SOLUTION_FIRST_NARRATIVE'
  | 'UNCLEAR_SUCCESS_DEFINITION'
  | 'URGENCY_MISMATCH'
  // Value
  | 'VALUE_NARRATIVE_INFLATION'
  | 'NO_BASELINE_FOR_VALUE'
  | 'VALUE_OWNERSHIP_WEAK'
  // Readiness / Adoption
  | 'ADOPTION_ILLUSION'
  | 'CAPACITY_ILLUSION'
  | 'CHANGE_SATURATION'
  // Feasibility / Risk
  | 'FEASIBILITY_GAP'
  | 'DATA_READINESS_RISK'
  | 'COMPLEXITY_DENIAL'
  | 'VENDOR_LOCKIN_BLINDNESS'
  // Governance
  | 'OWNERSHIP_DIFFUSION'
  | 'STOP_CRITERIA_WEAK'
  | 'GOVERNANCE_FRAGILITY'
  // Process
  | 'AUTOMATION_PREMATURITY'
  | 'PROCESS_BOTTLENECK_RISK'
  | 'PROCESS_OWNERSHIP_GAP';

// =============================================================================
// CONTRADICTION GROUPS
// =============================================================================

export type ContradictionGroup =
  | 'DATA_READINESS'
  | 'VALUE_BASELINE'
  | 'VALUE_QUANTIFICATION'
  | 'STOP_CRITERIA'
  | 'OWNERSHIP_ACCOUNTABILITY'
  | 'CAPACITY_TRADEOFFS'
  | 'COMPLEXITY_DEPENDENCIES'
  | 'ADOPTION_RESISTANCE'
  | 'PROCESS_STABILITY'
  | 'PROCESS_BOTTLENECKS'
  | 'PROCESS_AUTOMATION_RISK';

// =============================================================================
// TRIAD ROLES (for TM-2)
// =============================================================================

export type TriadRole = 'claim' | 'proof' | 'consequence';

// =============================================================================
// QUESTION CONFIGURATION
// =============================================================================

export interface QuestionConfig {
  /** Immutable question identifier (e.g., "E1", "B3", "T6", "P9") */
  question_id: string;
  
  /** Question text shown to participants */
  text: string;
  
  /** Role this question belongs to */
  role: Role;
  
  /** Module this question is part of */
  module: Module;
  
  /** Answer type */
  answer_type: AnswerType;
  
  /** Dimension this question maps to (required) */
  dimension: Dimension;
  
  /** Truth mechanisms that apply to this question */
  truth_mechanisms: TruthMechanism[];
  
  /** Primary pattern category */
  pattern_category: PatternCategory;
  
  /** Contradiction group for cross-role comparison (nullable) */
  contradiction_group: ContradictionGroup | null;
  
  /** Whether this is a reverse-scored question */
  is_reverse: boolean;
  
  /** Question ID this is the reverse of (for TM-1) */
  reverse_of: string | null;
  
  /** Time pair group for TM-7 (early/late pairs) */
  time_pair_group: string | null;
  
  /** Position in time pair: 'early' or 'late' */
  time_pair_position?: 'early' | 'late';
  
  /** Triad group ID for TM-2 */
  triad_group_id: string | null;
  
  /** Role in triad (claim/proof/consequence) */
  triad_role: TriadRole | null;
  
  /** Trigger question ID for TM-8 open text (must be answered first) */
  trigger_question_id: string | null;
  
  /** Options for SELECT types */
  options: string[] | null;
  
  /** Order within the survey (for display) */
  order: number;
}

// =============================================================================
// FLAG TYPES
// =============================================================================

export type FlagSeverity = 'INFO' | 'WARN' | 'CRITICAL';

export interface Flag {
  flag_id: string;
  severity: FlagSeverity;
  evidence: {
    question_ids: string[];
    raw_values: Record<string, string | number>;
    roles?: Role[];
    gap?: number;
    group?: string;
    description?: string;
  };
}

// =============================================================================
// GATE TYPES
// =============================================================================

export type GateId = 'G1' | 'G2' | 'G3' | 'G4';

export interface GateResult {
  gate: GateId;
  action: 'CLARIFY' | 'NO_GO';
  flag?: string;
  dimension?: Dimension;
  details?: string;
}

// =============================================================================
// RECOMMENDATION
// =============================================================================

export type Recommendation = 'GO' | 'CLARIFY' | 'NO_GO';

// =============================================================================
// OPEN TEXT CATEGORIES (TM-8)
// =============================================================================

export type OpenTextCategory =
  | 'Known risk'
  | 'Avoided topic'
  | 'Role conflict / politics'
  | 'Cultural resistance / adoption'
  | 'Technical uncertainty'
  | 'Process instability'
  | 'Data quality issues';

export const OPEN_TEXT_CATEGORIES: OpenTextCategory[] = [
  'Known risk',
  'Avoided topic',
  'Role conflict / politics',
  'Cultural resistance / adoption',
  'Technical uncertainty',
  'Process instability',
  'Data quality issues'
];

// =============================================================================
// EVIDENCE SCORE MAP (for TM-3)
// =============================================================================

export const EVIDENCE_SCORE_MAP: Record<string, number> = {
  'A documented financial baseline': 5,
  'Measured results from a pilot': 4,
  'Assumptions only': 2,
  'No formal documentation': 1,
  'No documentation': 1,
};
