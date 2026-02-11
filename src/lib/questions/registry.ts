/**
 * Question Registry
 * 
 * Single source of truth for all survey questions.
 * Contains all 57 questions across 5 roles with complete metadata.
 */

import { QuestionConfig, Role, Dimension } from './types';

// =============================================================================
// EXECUTIVE SURVEY (E1-E25)
// =============================================================================

const EXECUTIVE_QUESTIONS: QuestionConfig[] = [
  // Strategic Intent (D1)
  {
    question_id: 'E1',
    text: 'I can clearly articulate the business decision this investment is intended to support.',
    role: 'EXEC',
    module: 'EXEC_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D1',
    truth_mechanisms: ['TM-4'],
    pattern_category: 'UNCLEAR_SUCCESS_DEFINITION',
    contradiction_group: null,
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 1
  },
  {
    question_id: 'E2',
    text: 'This initiative directly supports one of our top three strategic priorities.',
    role: 'EXEC',
    module: 'EXEC_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D1',
    truth_mechanisms: [],
    pattern_category: 'UNCLEAR_SUCCESS_DEFINITION',
    contradiction_group: null,
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 2
  },
  {
    question_id: 'E3',
    text: 'We have a shared understanding of what success means beyond simply implementing a solution.',
    role: 'EXEC',
    module: 'EXEC_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D1',
    truth_mechanisms: ['TM-7'],
    pattern_category: 'UNCLEAR_SUCCESS_DEFINITION',
    contradiction_group: null,
    is_reverse: false,
    reverse_of: null,
    time_pair_group: 'EXEC_SUCCESS',
    time_pair_position: 'early',
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 3
  },
  {
    question_id: 'E4',
    text: 'We know which business or operational decisions would change if this initiative is successful.',
    role: 'EXEC',
    module: 'EXEC_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D1',
    truth_mechanisms: [],
    pattern_category: 'UNCLEAR_SUCCESS_DEFINITION',
    contradiction_group: null,
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 4
  },
  {
    question_id: 'E5',
    text: 'I could explain why this investment matters now in one clear sentence.',
    role: 'EXEC',
    module: 'EXEC_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D1',
    truth_mechanisms: [],
    pattern_category: 'URGENCY_MISMATCH',
    contradiction_group: null,
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 5
  },
  {
    question_id: 'E6',
    text: 'This initiative primarily exists because a solution or technology is available.',
    role: 'EXEC',
    module: 'EXEC_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D1',
    truth_mechanisms: ['TM-1'],
    pattern_category: 'SOLUTION_FIRST_NARRATIVE',
    contradiction_group: null,
    is_reverse: true,
    reverse_of: 'E1',
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 6
  },
  
  // Value & Economics (D2)
  {
    question_id: 'E7',
    text: 'The expected value of this initiative is clearly quantified (e.g. financial impact, time savings, risk reduction).',
    role: 'EXEC',
    module: 'EXEC_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D2',
    truth_mechanisms: ['TM-2'],
    pattern_category: 'VALUE_NARRATIVE_INFLATION',
    contradiction_group: 'VALUE_QUANTIFICATION',
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: 'EXEC_VALUE',
    triad_role: 'claim',
    trigger_question_id: null,
    options: null,
    order: 7
  },
  {
    question_id: 'E8',
    text: 'We know the baseline against which value realization will be measured.',
    role: 'EXEC',
    module: 'EXEC_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D2',
    truth_mechanisms: ['TM-4'],
    pattern_category: 'NO_BASELINE_FOR_VALUE',
    contradiction_group: 'VALUE_BASELINE',
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 8
  },
  {
    question_id: 'E9',
    text: 'We understand where value leakage or inefficiencies exist today.',
    role: 'EXEC',
    module: 'EXEC_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D2',
    truth_mechanisms: [],
    pattern_category: 'NO_BASELINE_FOR_VALUE',
    contradiction_group: null,
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 9
  },
  {
    question_id: 'E10',
    text: 'It is clear which functions or stakeholders will benefit most from this investment.',
    role: 'EXEC',
    module: 'EXEC_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D2',
    truth_mechanisms: [],
    pattern_category: 'VALUE_OWNERSHIP_WEAK',
    contradiction_group: null,
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 10
  },
  {
    question_id: 'E11',
    text: 'Even if the expected value is not realized, this initiative would likely continue.',
    role: 'EXEC',
    module: 'EXEC_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D2',
    truth_mechanisms: ['TM-1'],
    pattern_category: 'VALUE_NARRATIVE_INFLATION',
    contradiction_group: null,
    is_reverse: true,
    reverse_of: 'E7',
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 11
  },
  
  // Organizational Readiness (D3)
  {
    question_id: 'E12',
    text: 'Accountability for realizing outcomes from this initiative is clearly assigned.',
    role: 'EXEC',
    module: 'EXEC_MODULE',
    answer_type: 'SINGLE_SELECT',
    dimension: 'D3',
    truth_mechanisms: ['TM-5'],
    pattern_category: 'OWNERSHIP_DIFFUSION',
    contradiction_group: 'OWNERSHIP_ACCOUNTABILITY',
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: [
      'Business Owner',
      'Executive Sponsor',
      'IT / Technical Team',
      'Joint responsibility',
      'Not clearly defined'
    ],
    order: 12
  },
  {
    question_id: 'E13',
    text: 'The capabilities required to succeed already exist, or known gaps are explicitly acknowledged.',
    role: 'EXEC',
    module: 'EXEC_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D3',
    truth_mechanisms: [],
    pattern_category: 'CAPACITY_ILLUSION',
    contradiction_group: null,
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 13
  },
  {
    question_id: 'E14',
    text: 'The organization has sufficient capacity to absorb this initiative at this time.',
    role: 'EXEC',
    module: 'EXEC_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D3',
    truth_mechanisms: ['TM-4'],
    pattern_category: 'CAPACITY_ILLUSION',
    contradiction_group: 'CAPACITY_TRADEOFFS',
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 14
  },
  {
    question_id: 'E15',
    text: 'Adoption of this initiative will largely take care of itself.',
    role: 'EXEC',
    module: 'EXEC_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D3',
    truth_mechanisms: ['TM-1', 'TM-4'],
    pattern_category: 'ADOPTION_ILLUSION',
    contradiction_group: 'ADOPTION_RESISTANCE',
    is_reverse: true,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 15
  },
  
  // Risk & Dependencies (D4)
  {
    question_id: 'E16',
    text: 'The key risks and dependencies associated with this initiative are well understood.',
    role: 'EXEC',
    module: 'EXEC_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D4',
    truth_mechanisms: [],
    pattern_category: 'FEASIBILITY_GAP',
    contradiction_group: null,
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 16
  },
  {
    question_id: 'E17',
    text: 'Assumptions regarding data availability and data quality are realistic.',
    role: 'EXEC',
    module: 'EXEC_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D4',
    truth_mechanisms: ['TM-4'],
    pattern_category: 'DATA_READINESS_RISK',
    contradiction_group: 'DATA_READINESS',
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 17
  },
  {
    question_id: 'E18',
    text: 'External dependencies (e.g. vendors, partners, systems) are manageable.',
    role: 'EXEC',
    module: 'EXEC_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D4',
    truth_mechanisms: [],
    pattern_category: 'FEASIBILITY_GAP',
    contradiction_group: null,
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 18
  },
  {
    question_id: 'E19',
    text: 'Major risks will only become clear once implementation has started.',
    role: 'EXEC',
    module: 'EXEC_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D4',
    truth_mechanisms: ['TM-1'],
    pattern_category: 'FEASIBILITY_GAP',
    contradiction_group: null,
    is_reverse: true,
    reverse_of: 'E16',
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 19
  },
  
  // Decision Governance (D5)
  {
    question_id: 'E20',
    text: 'Decision authority for this initiative is unambiguous.',
    role: 'EXEC',
    module: 'EXEC_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D5',
    truth_mechanisms: [],
    pattern_category: 'GOVERNANCE_FRAGILITY',
    contradiction_group: null,
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 20
  },
  {
    question_id: 'E21',
    text: 'If this initiative underperforms, we will stop or materially change it.',
    role: 'EXEC',
    module: 'EXEC_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D5',
    truth_mechanisms: ['TM-2', 'TM-4'],
    pattern_category: 'STOP_CRITERIA_WEAK',
    contradiction_group: 'STOP_CRITERIA',
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: 'EXEC_VALUE',
    triad_role: 'consequence',
    trigger_question_id: null,
    options: null,
    order: 21
  },
  {
    question_id: 'E22',
    text: 'This initiative will be reviewed against explicit and predefined success criteria.',
    role: 'EXEC',
    module: 'EXEC_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D5',
    truth_mechanisms: [],
    pattern_category: 'STOP_CRITERIA_WEAK',
    contradiction_group: null,
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 22
  },
  {
    question_id: 'E23',
    text: 'Once approved, stopping this initiative would be politically difficult.',
    role: 'EXEC',
    module: 'EXEC_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D5',
    truth_mechanisms: ['TM-1'],
    pattern_category: 'GOVERNANCE_FRAGILITY',
    contradiction_group: null,
    is_reverse: true,
    reverse_of: 'E21',
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 23
  },
  
  // Confidence & Open Truth
  {
    question_id: 'E24',
    text: 'How confident are you that the assumptions underlying this decision are correct?',
    role: 'EXEC',
    module: 'EXEC_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D4',
    truth_mechanisms: ['TM-3'],
    pattern_category: 'FEASIBILITY_GAP',
    contradiction_group: null,
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 24
  },
  {
    question_id: 'E25',
    text: 'What is the single biggest risk related to this initiative that you hope will not need to be discussed openly?',
    role: 'EXEC',
    module: 'EXEC_MODULE',
    answer_type: 'TEXT',
    dimension: 'D4',
    truth_mechanisms: ['TM-8'],
    pattern_category: 'FEASIBILITY_GAP',
    contradiction_group: null,
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: 'E24',
    options: null,
    order: 25
  }
];

// =============================================================================
// BUSINESS OWNER SURVEY (B1-B13)
// =============================================================================

const BUSINESS_OWNER_QUESTIONS: QuestionConfig[] = [
  // Claim → Proof → Consequence Triad (D2)
  {
    question_id: 'B1',
    text: 'The expected value of this initiative is quantified.',
    role: 'BUSINESS_OWNER',
    module: 'CORE_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D2',
    truth_mechanisms: ['TM-2'],
    pattern_category: 'VALUE_NARRATIVE_INFLATION',
    contradiction_group: 'VALUE_QUANTIFICATION',
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: 'BIZ_VALUE',
    triad_role: 'claim',
    trigger_question_id: null,
    options: null,
    order: 1
  },
  {
    question_id: 'B2',
    text: 'Which of the following currently exists to support this value estimate?',
    role: 'BUSINESS_OWNER',
    module: 'CORE_MODULE',
    answer_type: 'SINGLE_SELECT',
    dimension: 'D2',
    truth_mechanisms: ['TM-2', 'TM-3', 'TM-4'],
    pattern_category: 'NO_BASELINE_FOR_VALUE',
    contradiction_group: 'VALUE_BASELINE',
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: 'BIZ_VALUE',
    triad_role: 'proof',
    trigger_question_id: null,
    options: [
      'A documented financial baseline',
      'Measured results from a pilot',
      'Assumptions only',
      'No formal documentation'
    ],
    order: 2
  },
  {
    question_id: 'B3',
    text: 'If the expected value is not realized, what will happen?',
    role: 'BUSINESS_OWNER',
    module: 'CORE_MODULE',
    answer_type: 'SINGLE_SELECT',
    dimension: 'D5',
    truth_mechanisms: ['TM-2', 'TM-4'],
    pattern_category: 'STOP_CRITERIA_WEAK',
    contradiction_group: 'STOP_CRITERIA',
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: 'BIZ_VALUE',
    triad_role: 'consequence',
    trigger_question_id: null,
    options: [
      'The initiative will be stopped',
      'The scope will be reduced',
      'The initiative will continue anyway',
      'This has not been defined'
    ],
    order: 3
  },
  
  // Ownership (D5/D1)
  {
    question_id: 'B4',
    text: 'Who is accountable if this initiative underperforms?',
    role: 'BUSINESS_OWNER',
    module: 'CORE_MODULE',
    answer_type: 'SINGLE_SELECT',
    dimension: 'D5',
    truth_mechanisms: ['TM-5'],
    pattern_category: 'OWNERSHIP_DIFFUSION',
    contradiction_group: 'OWNERSHIP_ACCOUNTABILITY',
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: [
      'Business Owner',
      'Executive Sponsor',
      'IT / Technical Team',
      'Joint responsibility',
      'Not clearly defined'
    ],
    order: 4
  },
  {
    question_id: 'B5',
    text: 'I would personally support stopping this initiative if value does not materialize.',
    role: 'BUSINESS_OWNER',
    module: 'CORE_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D5',
    truth_mechanisms: ['TM-4'],
    pattern_category: 'STOP_CRITERIA_WEAK',
    contradiction_group: 'STOP_CRITERIA',
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 5
  },
  
  // Demand & Adoption (D3)
  {
    question_id: 'B6',
    text: 'There is genuine demand for this initiative from the affected teams.',
    role: 'BUSINESS_OWNER',
    module: 'CORE_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D3',
    truth_mechanisms: ['TM-4'],
    pattern_category: 'ADOPTION_ILLUSION',
    contradiction_group: 'VALUE_BASELINE',
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 6
  },
  {
    question_id: 'B7',
    text: 'The main adoption barriers are already known.',
    role: 'BUSINESS_OWNER',
    module: 'CORE_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D3',
    truth_mechanisms: [],
    pattern_category: 'ADOPTION_ILLUSION',
    contradiction_group: null,
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 7
  },
  {
    question_id: 'B8',
    text: 'Significant resistance to this initiative is unlikely.',
    role: 'BUSINESS_OWNER',
    module: 'CORE_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D3',
    truth_mechanisms: ['TM-1', 'TM-4'],
    pattern_category: 'ADOPTION_ILLUSION',
    contradiction_group: 'ADOPTION_RESISTANCE',
    is_reverse: true,
    reverse_of: 'B6',
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 8
  },
  
  // Forced Trade-offs (D3)
  {
    question_id: 'B9',
    text: 'If this initiative is approved, which of the following will be deprioritized?',
    role: 'BUSINESS_OWNER',
    module: 'CORE_MODULE',
    answer_type: 'SINGLE_SELECT',
    dimension: 'D3',
    truth_mechanisms: ['TM-6', 'TM-4'],
    pattern_category: 'CAPACITY_ILLUSION',
    contradiction_group: 'CAPACITY_TRADEOFFS',
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: [
      'Another initiative',
      'Planned headcount or capacity',
      'Timelines for other commitments',
      'Nothing will be deprioritized'
    ],
    order: 9
  },
  
  // Time-Separated Consistency (D4)
  {
    question_id: 'B10',
    text: 'This initiative will simplify current operations.',
    role: 'BUSINESS_OWNER',
    module: 'CORE_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D4',
    truth_mechanisms: ['TM-7'],
    pattern_category: 'COMPLEXITY_DENIAL',
    contradiction_group: 'COMPLEXITY_DEPENDENCIES',
    is_reverse: false,
    reverse_of: null,
    time_pair_group: 'BIZ_COMPLEXITY',
    time_pair_position: 'early',
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 10
  },
  {
    question_id: 'B11',
    text: 'This initiative will introduce new dependencies or complexity.',
    role: 'BUSINESS_OWNER',
    module: 'CORE_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D4',
    truth_mechanisms: ['TM-7'],
    pattern_category: 'COMPLEXITY_DENIAL',
    contradiction_group: 'COMPLEXITY_DEPENDENCIES',
    is_reverse: false,
    reverse_of: null,
    time_pair_group: 'BIZ_COMPLEXITY',
    time_pair_position: 'late',
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 11
  },
  
  // Confidence & Open Truth
  {
    question_id: 'B12',
    text: 'How confident are you that your value assumptions for this initiative are correct?',
    role: 'BUSINESS_OWNER',
    module: 'CORE_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D2',
    truth_mechanisms: ['TM-3'],
    pattern_category: 'VALUE_NARRATIVE_INFLATION',
    contradiction_group: null,
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 12
  },
  {
    question_id: 'B13',
    text: 'Which assumption, if proven wrong, would most threaten the success of this initiative?',
    role: 'BUSINESS_OWNER',
    module: 'CORE_MODULE',
    answer_type: 'TEXT',
    dimension: 'D4',
    truth_mechanisms: ['TM-8'],
    pattern_category: 'FEASIBILITY_GAP',
    contradiction_group: null,
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: 'B12',
    options: null,
    order: 13
  }
];

// =============================================================================
// TECHNICAL OWNER SURVEY (T1-T14)
// =============================================================================

const TECH_OWNER_QUESTIONS: QuestionConfig[] = [
  // Data & Feasibility (D4)
  {
    question_id: 'T1',
    text: 'Required data is available and meets the needs of this initiative.',
    role: 'TECH_OWNER',
    module: 'CORE_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D4',
    truth_mechanisms: ['TM-4'],
    pattern_category: 'DATA_READINESS_RISK',
    contradiction_group: 'DATA_READINESS',
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 1
  },
  {
    question_id: 'T2',
    text: 'The expected integration effort is realistic.',
    role: 'TECH_OWNER',
    module: 'CORE_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D4',
    truth_mechanisms: [],
    pattern_category: 'FEASIBILITY_GAP',
    contradiction_group: null,
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 2
  },
  {
    question_id: 'T3',
    text: 'This initiative fits reasonably within the current system architecture.',
    role: 'TECH_OWNER',
    module: 'CORE_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D4',
    truth_mechanisms: [],
    pattern_category: 'FEASIBILITY_GAP',
    contradiction_group: null,
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 3
  },
  {
    question_id: 'T4',
    text: 'Data gaps can be addressed later without significant impact.',
    role: 'TECH_OWNER',
    module: 'CORE_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D4',
    truth_mechanisms: ['TM-1', 'TM-4'],
    pattern_category: 'DATA_READINESS_RISK',
    contradiction_group: 'DATA_READINESS',
    is_reverse: true,
    reverse_of: 'T1',
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 4
  },
  
  // Capacity & Trade-offs (D3)
  {
    question_id: 'T5',
    text: 'Sufficient technical delivery capacity is available for this initiative.',
    role: 'TECH_OWNER',
    module: 'CORE_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D3',
    truth_mechanisms: [],
    pattern_category: 'CAPACITY_ILLUSION',
    contradiction_group: null,
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 5
  },
  {
    question_id: 'T6',
    text: 'If delivery takes approximately 30% longer than planned, what is the most likely impact?',
    role: 'TECH_OWNER',
    module: 'CORE_MODULE',
    answer_type: 'SINGLE_SELECT',
    dimension: 'D3',
    truth_mechanisms: ['TM-6', 'TM-4'],
    pattern_category: 'CAPACITY_ILLUSION',
    contradiction_group: 'CAPACITY_TRADEOFFS',
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: [
      'Other initiatives will be delayed',
      'Technical debt will increase',
      'Teams will be overloaded',
      'Nothing critical will be impacted'
    ],
    order: 6
  },
  
  // Risk & Operability (D4)
  {
    question_id: 'T7',
    text: 'Security and compliance risks are manageable.',
    role: 'TECH_OWNER',
    module: 'CORE_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D4',
    truth_mechanisms: [],
    pattern_category: 'FEASIBILITY_GAP',
    contradiction_group: null,
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 7
  },
  {
    question_id: 'T8',
    text: 'The solution will be operable and maintainable in the long term.',
    role: 'TECH_OWNER',
    module: 'CORE_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D4',
    truth_mechanisms: [],
    pattern_category: 'FEASIBILITY_GAP',
    contradiction_group: null,
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 8
  },
  {
    question_id: 'T9',
    text: 'Long-term complexity is a secondary concern for this initiative.',
    role: 'TECH_OWNER',
    module: 'CORE_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D4',
    truth_mechanisms: ['TM-1'],
    pattern_category: 'COMPLEXITY_DENIAL',
    contradiction_group: null,
    is_reverse: true,
    reverse_of: 'T8',
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 9
  },
  
  // Ownership (D5)
  {
    question_id: 'T10',
    text: 'Who owns delivery risk if this initiative fails technically?',
    role: 'TECH_OWNER',
    module: 'CORE_MODULE',
    answer_type: 'SINGLE_SELECT',
    dimension: 'D5',
    truth_mechanisms: ['TM-5'],
    pattern_category: 'OWNERSHIP_DIFFUSION',
    contradiction_group: 'OWNERSHIP_ACCOUNTABILITY',
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: [
      'IT / Technical Team',
      'Business',
      'Joint responsibility',
      'Not clearly defined'
    ],
    order: 10
  },
  
  // Time-Separated Complexity (D4)
  {
    question_id: 'T11',
    text: 'This initiative will reduce technical complexity.',
    role: 'TECH_OWNER',
    module: 'CORE_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D4',
    truth_mechanisms: ['TM-7'],
    pattern_category: 'COMPLEXITY_DENIAL',
    contradiction_group: 'COMPLEXITY_DEPENDENCIES',
    is_reverse: false,
    reverse_of: null,
    time_pair_group: 'TECH_COMPLEXITY',
    time_pair_position: 'early',
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 11
  },
  {
    question_id: 'T12',
    text: 'This initiative introduces additional system dependencies.',
    role: 'TECH_OWNER',
    module: 'CORE_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D4',
    truth_mechanisms: ['TM-7'],
    pattern_category: 'COMPLEXITY_DENIAL',
    contradiction_group: 'COMPLEXITY_DEPENDENCIES',
    is_reverse: false,
    reverse_of: null,
    time_pair_group: 'TECH_COMPLEXITY',
    time_pair_position: 'late',
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 12
  },
  
  // Confidence & Open Truth
  {
    question_id: 'T13',
    text: 'How confident are you that the technical risks of this initiative are well understood?',
    role: 'TECH_OWNER',
    module: 'CORE_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D4',
    truth_mechanisms: ['TM-3'],
    pattern_category: 'FEASIBILITY_GAP',
    contradiction_group: null,
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 13
  },
  {
    question_id: 'T14',
    text: 'Which technical risk do you expect may be underestimated at this stage?',
    role: 'TECH_OWNER',
    module: 'CORE_MODULE',
    answer_type: 'TEXT',
    dimension: 'D4',
    truth_mechanisms: ['TM-8'],
    pattern_category: 'FEASIBILITY_GAP',
    contradiction_group: null,
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: 'T13',
    options: null,
    order: 14
  }
];

// =============================================================================
// FUNCTIONAL USERS SURVEY (U1-U5)
// =============================================================================

const USER_QUESTIONS: QuestionConfig[] = [
  {
    question_id: 'U1',
    text: 'The current process works well enough for my daily work.',
    role: 'USER',
    module: 'USER_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D3',
    truth_mechanisms: [],
    pattern_category: 'ADOPTION_ILLUSION',
    contradiction_group: null,
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 1
  },
  {
    question_id: 'U2',
    text: 'The current process frequently breaks down or creates friction.',
    role: 'USER',
    module: 'USER_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D4',
    truth_mechanisms: ['TM-1', 'TM-4'],
    pattern_category: 'ADOPTION_ILLUSION',
    contradiction_group: 'ADOPTION_RESISTANCE',
    is_reverse: true,
    reverse_of: 'U1',
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 2
  },
  {
    question_id: 'U3',
    text: 'This initiative would remove real pain points from my daily work.',
    role: 'USER',
    module: 'USER_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D3',
    truth_mechanisms: [],
    pattern_category: 'ADOPTION_ILLUSION',
    contradiction_group: null,
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 3
  },
  {
    question_id: 'U4',
    text: 'Which part of your work do you expect will become harder?',
    role: 'USER',
    module: 'USER_MODULE',
    answer_type: 'SINGLE_SELECT',
    dimension: 'D3',
    truth_mechanisms: ['TM-6'],
    pattern_category: 'ADOPTION_ILLUSION',
    contradiction_group: null,
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: [
      'Data input',
      'Exception handling',
      'Reporting',
      'Nothing'
    ],
    order: 4
  },
  {
    question_id: 'U5',
    text: 'Which part of your daily work do you believe will not improve with this initiative?',
    role: 'USER',
    module: 'USER_MODULE',
    answer_type: 'TEXT',
    dimension: 'D4',
    truth_mechanisms: ['TM-8'],
    pattern_category: 'ADOPTION_ILLUSION',
    contradiction_group: null,
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: 'U4',
    options: null,
    order: 5
  }
];

// =============================================================================
// PROCESS OWNER SURVEY (P1-P10)
// =============================================================================

const PROCESS_OWNER_QUESTIONS: QuestionConfig[] = [
  // Stability & Bottlenecks (P/D4)
  {
    question_id: 'P1',
    text: 'The steps of this process are stable and repeatable.',
    role: 'PROCESS_OWNER',
    module: 'PROCESS_MODULE',
    answer_type: 'LIKERT',
    dimension: 'P',
    truth_mechanisms: ['TM-4'],
    pattern_category: 'PROCESS_BOTTLENECK_RISK',
    contradiction_group: 'PROCESS_STABILITY',
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 1
  },
  {
    question_id: 'P2',
    text: 'This process varies significantly from case to case.',
    role: 'PROCESS_OWNER',
    module: 'PROCESS_MODULE',
    answer_type: 'LIKERT',
    dimension: 'P',
    truth_mechanisms: ['TM-1'],
    pattern_category: 'PROCESS_BOTTLENECK_RISK',
    contradiction_group: 'PROCESS_STABILITY',
    is_reverse: true,
    reverse_of: 'P1',
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 2
  },
  {
    question_id: 'P3',
    text: 'The main bottlenecks in this process are well understood.',
    role: 'PROCESS_OWNER',
    module: 'PROCESS_MODULE',
    answer_type: 'LIKERT',
    dimension: 'P',
    truth_mechanisms: ['TM-4'],
    pattern_category: 'PROCESS_BOTTLENECK_RISK',
    contradiction_group: 'PROCESS_BOTTLENECKS',
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 3
  },
  {
    question_id: 'P4',
    text: 'Most current bottlenecks will disappear once the process is automated.',
    role: 'PROCESS_OWNER',
    module: 'PROCESS_MODULE',
    answer_type: 'LIKERT',
    dimension: 'P',
    truth_mechanisms: ['TM-1'],
    pattern_category: 'AUTOMATION_PREMATURITY',
    contradiction_group: 'PROCESS_AUTOMATION_RISK',
    is_reverse: true,
    reverse_of: 'P3',
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 4
  },
  
  // Ownership & Decisions (D5)
  {
    question_id: 'P5',
    text: 'Who owns this process end-to-end?',
    role: 'PROCESS_OWNER',
    module: 'PROCESS_MODULE',
    answer_type: 'SINGLE_SELECT',
    dimension: 'D5',
    truth_mechanisms: ['TM-5'],
    pattern_category: 'PROCESS_OWNERSHIP_GAP',
    contradiction_group: 'OWNERSHIP_ACCOUNTABILITY',
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: [
      'A clearly defined role',
      'Multiple shared roles',
      'No clear owner'
    ],
    order: 5
  },
  {
    question_id: 'P6',
    text: 'Decision rights within this process are clearly defined.',
    role: 'PROCESS_OWNER',
    module: 'PROCESS_MODULE',
    answer_type: 'LIKERT',
    dimension: 'D5',
    truth_mechanisms: [],
    pattern_category: 'PROCESS_OWNERSHIP_GAP',
    contradiction_group: null,
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 6
  },
  
  // Automation Readiness (P)
  {
    question_id: 'P7',
    text: 'Parts of this process are ready to be automated today.',
    role: 'PROCESS_OWNER',
    module: 'PROCESS_MODULE',
    answer_type: 'LIKERT',
    dimension: 'P',
    truth_mechanisms: ['TM-4'],
    pattern_category: 'AUTOMATION_PREMATURITY',
    contradiction_group: 'PROCESS_AUTOMATION_RISK',
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 7
  },
  {
    question_id: 'P8',
    text: 'Automating this process would likely amplify existing problems.',
    role: 'PROCESS_OWNER',
    module: 'PROCESS_MODULE',
    answer_type: 'LIKERT',
    dimension: 'P',
    truth_mechanisms: ['TM-1'],
    pattern_category: 'AUTOMATION_PREMATURITY',
    contradiction_group: 'PROCESS_AUTOMATION_RISK',
    is_reverse: true,
    reverse_of: 'P7',
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 8
  },
  
  // Confidence & Open Truth
  {
    question_id: 'P9',
    text: 'How confident are you that this process is ready for automation in its current state?',
    role: 'PROCESS_OWNER',
    module: 'PROCESS_MODULE',
    answer_type: 'LIKERT',
    dimension: 'P',
    truth_mechanisms: ['TM-3'],
    pattern_category: 'AUTOMATION_PREMATURITY',
    contradiction_group: null,
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: null,
    options: null,
    order: 9
  },
  {
    question_id: 'P10',
    text: 'Which process issue do you think people are hoping automation will hide rather than fix?',
    role: 'PROCESS_OWNER',
    module: 'PROCESS_MODULE',
    answer_type: 'TEXT',
    dimension: 'P',
    truth_mechanisms: ['TM-8'],
    pattern_category: 'AUTOMATION_PREMATURITY',
    contradiction_group: null,
    is_reverse: false,
    reverse_of: null,
    time_pair_group: null,
    triad_group_id: null,
    triad_role: null,
    trigger_question_id: 'P9',
    options: null,
    order: 10
  }
];

// =============================================================================
// COMPLETE REGISTRY
// =============================================================================

export const QUESTION_REGISTRY: QuestionConfig[] = [
  ...EXECUTIVE_QUESTIONS,
  ...BUSINESS_OWNER_QUESTIONS,
  ...TECH_OWNER_QUESTIONS,
  ...USER_QUESTIONS,
  ...PROCESS_OWNER_QUESTIONS
];

// =============================================================================
// LOOKUP MAPS
// =============================================================================

/** Map from question_id to QuestionConfig */
export const QUESTION_MAP: Map<string, QuestionConfig> = new Map(
  QUESTION_REGISTRY.map(q => [q.question_id, q])
);

/** Get question by ID */
export function getQuestion(questionId: string): QuestionConfig | undefined {
  return QUESTION_MAP.get(questionId);
}

/** Get all questions for a role */
export function getQuestionsForRole(role: Role): QuestionConfig[] {
  return QUESTION_REGISTRY.filter(q => q.role === role);
}

/** Get all questions for a dimension */
export function getQuestionsForDimension(dimension: Dimension): QuestionConfig[] {
  return QUESTION_REGISTRY.filter(q => q.dimension === dimension);
}

/** Get all questions with a specific truth mechanism */
export function getQuestionsWithTM(tm: string): QuestionConfig[] {
  return QUESTION_REGISTRY.filter(q => q.truth_mechanisms.includes(tm as any));
}

/** Get triad group questions */
export function getTriadGroup(triadGroupId: string): QuestionConfig[] {
  return QUESTION_REGISTRY.filter(q => q.triad_group_id === triadGroupId);
}

/** Get time pair questions */
export function getTimePair(timePairGroup: string): { early: QuestionConfig | undefined; late: QuestionConfig | undefined } {
  const questions = QUESTION_REGISTRY.filter(q => q.time_pair_group === timePairGroup);
  return {
    early: questions.find(q => q.time_pair_position === 'early'),
    late: questions.find(q => q.time_pair_position === 'late')
  };
}

/** Get contradiction group questions */
export function getContradictionGroup(group: string): QuestionConfig[] {
  return QUESTION_REGISTRY.filter(q => q.contradiction_group === group);
}

/** Get ownership questions (TM-5) */
export function getOwnershipQuestions(): QuestionConfig[] {
  return QUESTION_REGISTRY.filter(q => q.truth_mechanisms.includes('TM-5'));
}

/** Get trade-off questions (TM-6) */
export function getTradeOffQuestions(): QuestionConfig[] {
  return QUESTION_REGISTRY.filter(q => q.truth_mechanisms.includes('TM-6'));
}

/** Get open text questions (TM-8) */
export function getOpenTextQuestions(): QuestionConfig[] {
  return QUESTION_REGISTRY.filter(q => q.truth_mechanisms.includes('TM-8'));
}

/** Get confidence questions (TM-3) */
export function getConfidenceQuestions(): QuestionConfig[] {
  return QUESTION_REGISTRY.filter(q => q.truth_mechanisms.includes('TM-3'));
}

/** Get reversed questions (TM-1 with is_reverse=true) */
export function getReversedQuestions(): QuestionConfig[] {
  return QUESTION_REGISTRY.filter(q => q.is_reverse);
}

export default QUESTION_REGISTRY;
