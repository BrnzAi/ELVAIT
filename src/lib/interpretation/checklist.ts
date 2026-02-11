/**
 * Interpretation Pipeline - Checklist Generator
 * 
 * Generates next-gate checklist items when:
 * - recommendation = CLARIFY
 * - OR any CRITICAL flag triggered
 * - OR claim >= 4 but proof weak
 * 
 * Each item has: prompt, responsible role, linked question IDs, required input type, status.
 */

import { Flag, Role, Recommendation } from '../questions/types';
import { QUESTION_MAP } from '../questions/registry';

// =============================================================================
// TYPES
// =============================================================================

export type ChecklistStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';

export interface ChecklistItem {
  /** Unique ID for this item */
  id: string;
  
  /** Prompt/question to address */
  prompt: string;
  
  /** Role responsible for resolving this */
  responsibleRole: Role | 'ALL';
  
  /** Linked question IDs from the survey */
  linkedQuestionIds: string[];
  
  /** Type of input required to resolve */
  requiredInputType: 'DOCUMENT' | 'MEETING' | 'DATA' | 'DECISION' | 'CLARIFICATION';
  
  /** Current status */
  status: ChecklistStatus;
  
  /** Priority (1 = highest) */
  priority: number;
  
  /** Source flag or trigger */
  source: string;
}

// =============================================================================
// FLAG TO CHECKLIST MAPPING
// =============================================================================

interface ChecklistTemplate {
  prompt: string;
  responsibleRole: Role | 'ALL';
  requiredInputType: ChecklistItem['requiredInputType'];
}

const FLAG_CHECKLIST_TEMPLATES: Record<string, ChecklistTemplate> = {
  'NARRATIVE_INFLATION_RISK': {
    prompt: 'Document the quantified value baseline with supporting evidence (financial data, pilot results, or documented metrics).',
    responsibleRole: 'BUSINESS_OWNER',
    requiredInputType: 'DOCUMENT'
  },
  'PROOF_GAP': {
    prompt: 'Provide documented evidence supporting the value estimate (financial baseline, pilot results, or formal analysis).',
    responsibleRole: 'BUSINESS_OWNER',
    requiredInputType: 'DOCUMENT'
  },
  'CONSEQUENCE_UNOWNED': {
    prompt: 'Define and assign accountability for what happens if expected value is not realized.',
    responsibleRole: 'EXEC',
    requiredInputType: 'DECISION'
  },
  'OVERCONFIDENCE': {
    prompt: 'Review assumptions and gather supporting evidence to validate confidence level.',
    responsibleRole: 'ALL',
    requiredInputType: 'DATA'
  },
  'CROSS_ROLE_MISMATCH': {
    prompt: 'Conduct alignment session between roles to resolve perception gaps and establish shared understanding.',
    responsibleRole: 'ALL',
    requiredInputType: 'MEETING'
  },
  'OWNERSHIP_DIFFUSION': {
    prompt: 'Clarify and document single-point accountability for initiative success/failure.',
    responsibleRole: 'EXEC',
    requiredInputType: 'DECISION'
  },
  'CAPACITY_ILLUSION_BUSINESS': {
    prompt: 'Identify what will be deprioritized or delayed to accommodate this initiative.',
    responsibleRole: 'BUSINESS_OWNER',
    requiredInputType: 'DECISION'
  },
  'CAPACITY_ILLUSION_TECH': {
    prompt: 'Document realistic capacity impact and identify trade-offs for delivery.',
    responsibleRole: 'TECH_OWNER',
    requiredInputType: 'DOCUMENT'
  },
  'CAPACITY_ILLUSION_CONFIRMED': {
    prompt: 'Both Business and Technical teams must identify concrete trade-offs before proceeding.',
    responsibleRole: 'ALL',
    requiredInputType: 'MEETING'
  },
  'COMPLEXITY_DENIAL': {
    prompt: 'Reconcile claims about simplification with acknowledged new complexity/dependencies.',
    responsibleRole: 'ALL',
    requiredInputType: 'CLARIFICATION'
  },
  'WITHIN_ROLE_CONTRADICTION': {
    prompt: 'Review contradictory responses and clarify actual position.',
    responsibleRole: 'ALL',
    requiredInputType: 'CLARIFICATION'
  },
  'ADOPTION_RISK': {
    prompt: 'Address adoption barriers identified by users before proceeding.',
    responsibleRole: 'BUSINESS_OWNER',
    requiredInputType: 'MEETING'
  },
  'AUTOMATION_PREMATURITY': {
    prompt: 'Improve process stability and clarity before automation.',
    responsibleRole: 'PROCESS_OWNER',
    requiredInputType: 'DOCUMENT'
  },
  'LOW_DIMENSION_SCORE_D1': {
    prompt: 'Clarify strategic intent and alignment with organizational priorities.',
    responsibleRole: 'EXEC',
    requiredInputType: 'CLARIFICATION'
  },
  'LOW_DIMENSION_SCORE_D2': {
    prompt: 'Strengthen value case with documented evidence and clear metrics.',
    responsibleRole: 'BUSINESS_OWNER',
    requiredInputType: 'DOCUMENT'
  },
  'LOW_DIMENSION_SCORE_D3': {
    prompt: 'Address organizational readiness gaps (capacity, capabilities, change management).',
    responsibleRole: 'ALL',
    requiredInputType: 'MEETING'
  },
  'LOW_DIMENSION_SCORE_D4': {
    prompt: 'Document and assess key risks and dependencies.',
    responsibleRole: 'TECH_OWNER',
    requiredInputType: 'DOCUMENT'
  },
  'LOW_DIMENSION_SCORE_D5': {
    prompt: 'Establish clear governance, decision rights, and success criteria.',
    responsibleRole: 'EXEC',
    requiredInputType: 'DECISION'
  }
};

// =============================================================================
// CHECKLIST GENERATION
// =============================================================================

/**
 * Generate a checklist item from a flag.
 */
function flagToChecklistItem(flag: Flag, priority: number): ChecklistItem | null {
  const template = FLAG_CHECKLIST_TEMPLATES[flag.flag_id];
  
  if (!template) {
    // Generate generic item for unknown flags
    return {
      id: `CHK-${flag.flag_id}-${priority}`,
      prompt: `Address ${flag.flag_id.replace(/_/g, ' ').toLowerCase()}: ${flag.evidence.description ?? 'Review and resolve.'}`,
      responsibleRole: (flag.evidence.roles?.[0] ?? 'ALL') as Role | 'ALL',
      linkedQuestionIds: flag.evidence.question_ids ?? [],
      requiredInputType: 'CLARIFICATION',
      status: 'OPEN',
      priority,
      source: flag.flag_id
    };
  }
  
  return {
    id: `CHK-${flag.flag_id}-${priority}`,
    prompt: template.prompt,
    responsibleRole: template.responsibleRole,
    linkedQuestionIds: flag.evidence.question_ids ?? [],
    requiredInputType: template.requiredInputType,
    status: 'OPEN',
    priority,
    source: flag.flag_id
  };
}

// =============================================================================
// MAIN GENERATOR
// =============================================================================

export interface GenerateChecklistInput {
  recommendation: Recommendation | null;
  flags: Flag[];
  hasWeakProofWithHighClaim?: boolean;
}

/**
 * Generate checklist items based on recommendation and flags.
 * 
 * Generated when:
 * - recommendation = CLARIFY
 * - OR any CRITICAL flag
 * - OR claim >= 4 + weak proof
 */
export function generateChecklist(input: GenerateChecklistInput): ChecklistItem[] {
  const { recommendation, flags, hasWeakProofWithHighClaim } = input;
  
  // Check if checklist should be generated
  const hasCritical = flags.some(f => f.severity === 'CRITICAL');
  const needsChecklist = recommendation === 'CLARIFY' || hasCritical || hasWeakProofWithHighClaim;
  
  if (!needsChecklist) {
    return [];
  }
  
  const items: ChecklistItem[] = [];
  const addedFlags = new Set<string>();
  let priority = 1;
  
  // 1. CRITICAL flags first
  const criticalFlags = flags.filter(f => f.severity === 'CRITICAL');
  for (const flag of criticalFlags) {
    if (addedFlags.has(flag.flag_id)) continue;
    
    const item = flagToChecklistItem(flag, priority++);
    if (item) {
      items.push(item);
      addedFlags.add(flag.flag_id);
    }
  }
  
  // 2. WARNING flags that have templates
  const warnFlags = flags.filter(f => 
    f.severity === 'WARN' && 
    FLAG_CHECKLIST_TEMPLATES[f.flag_id] &&
    !addedFlags.has(f.flag_id)
  );
  
  for (const flag of warnFlags) {
    const item = flagToChecklistItem(flag, priority++);
    if (item) {
      items.push(item);
      addedFlags.add(flag.flag_id);
    }
  }
  
  // 3. Gate-related items (from flag names like LOW_DIMENSION_SCORE_*)
  const gateFlags = flags.filter(f => 
    f.flag_id.startsWith('LOW_DIMENSION_SCORE_') &&
    !addedFlags.has(f.flag_id)
  );
  
  for (const flag of gateFlags) {
    const item = flagToChecklistItem(flag, priority++);
    if (item) {
      items.push(item);
      addedFlags.add(flag.flag_id);
    }
  }
  
  return items;
}

/**
 * Get checklist summary for display.
 */
export function getChecklistSummary(items: ChecklistItem[]): string {
  if (items.length === 0) {
    return 'No action items required.';
  }
  
  const open = items.filter(i => i.status === 'OPEN').length;
  const inProgress = items.filter(i => i.status === 'IN_PROGRESS').length;
  const resolved = items.filter(i => i.status === 'RESOLVED').length;
  
  return `${items.length} action items: ${open} open, ${inProgress} in progress, ${resolved} resolved.`;
}

/**
 * Group checklist items by responsible role.
 */
export function groupByRole(items: ChecklistItem[]): Map<Role | 'ALL', ChecklistItem[]> {
  const groups = new Map<Role | 'ALL', ChecklistItem[]>();
  
  for (const item of items) {
    const existing = groups.get(item.responsibleRole) ?? [];
    existing.push(item);
    groups.set(item.responsibleRole, existing);
  }
  
  return groups;
}

export default generateChecklist;
