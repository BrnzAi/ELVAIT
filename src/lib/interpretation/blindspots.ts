/**
 * Interpretation Pipeline - Blind Spots
 * 
 * Generates the top 5 blind spot candidates from flags and signals.
 * Each blind spot has: label, explanation, who sees it, who doesn't, linked IDs.
 * 
 * Priority order:
 * 1. CRITICAL flags
 * 2. Largest cross-role gaps
 * 3. Overconfidence signals
 * 4. TM-8 open text category alignment
 */

import { Flag, Role } from '../questions/types';
import { DIMENSION_NAMES } from '../questions/types';
import { CrossRoleMismatch } from './summary';
import { OpenTextClassification } from '../flags/tm8';

// =============================================================================
// TYPES
// =============================================================================

export interface BlindSpot {
  /** Human-readable label */
  label: string;
  
  /** Evidence-backed explanation */
  explanation: string;
  
  /** Roles with high score on this (who "sees" it) */
  whoSeesIt: Role[];
  
  /** Roles with contradicting/low score (who "doesn't see" it) */
  whoDoesnt: Role[];
  
  /** Linked question IDs */
  linkedQuestionIds: string[];
  
  /** Severity (from source flag) */
  severity: 'CRITICAL' | 'WARN' | 'INFO';
  
  /** Source flag or signal type */
  source: string;
  
  /** Rank (1-5) */
  rank: number;
}

// =============================================================================
// FLAG TO BLIND SPOT MAPPING
// =============================================================================

const FLAG_LABELS: Record<string, string> = {
  'NARRATIVE_INFLATION_RISK': 'Value claims may be inflated',
  'PROOF_GAP': 'Value assumptions lack evidence',
  'CONSEQUENCE_UNOWNED': 'Failure consequences not owned',
  'OVERCONFIDENCE': 'Confidence exceeds evidence',
  'CROSS_ROLE_MISMATCH': 'Roles see different realities',
  'OWNERSHIP_DIFFUSION': 'Accountability is unclear',
  'CAPACITY_ILLUSION_BUSINESS': 'Business underestimates impact',
  'CAPACITY_ILLUSION_TECH': 'Technical team underestimates impact',
  'CAPACITY_ILLUSION_CONFIRMED': 'Organization-wide capacity illusion',
  'COMPLEXITY_DENIAL': 'Complexity is being downplayed',
  'WITHIN_ROLE_CONTRADICTION': 'Contradictory responses detected',
  'ADOPTION_RISK': 'Adoption barriers underestimated',
  'AUTOMATION_PREMATURITY': 'Process not ready for automation',
  'LOW_DIMENSION_SCORE_D1': 'Strategic intent unclear',
  'LOW_DIMENSION_SCORE_D2': 'Value case weak',
  'LOW_DIMENSION_SCORE_D3': 'Organization not ready',
  'LOW_DIMENSION_SCORE_D4': 'Risks not understood',
  'LOW_DIMENSION_SCORE_D5': 'Governance gaps'
};

// =============================================================================
// BLIND SPOT GENERATION
// =============================================================================

/**
 * Convert a flag to a blind spot candidate.
 */
function flagToBlindSpot(flag: Flag, rank: number): BlindSpot {
  const label = FLAG_LABELS[flag.flag_id] ?? flag.flag_id.replace(/_/g, ' ').toLowerCase();
  
  // Extract roles
  const rolesInvolved = flag.evidence.roles ?? [];
  const whoSeesIt = rolesInvolved.slice(0, 1); // First role typically has higher score
  const whoDoesnt = rolesInvolved.slice(1);    // Other roles
  
  return {
    label,
    explanation: flag.evidence.description ?? `${flag.flag_id} was detected.`,
    whoSeesIt,
    whoDoesnt,
    linkedQuestionIds: flag.evidence.question_ids ?? [],
    severity: flag.severity === 'CRITICAL' ? 'CRITICAL' : flag.severity === 'WARN' ? 'WARN' : 'INFO',
    source: flag.flag_id,
    rank
  };
}

/**
 * Convert a cross-role mismatch to a blind spot.
 */
function mismatchToBlindSpot(mismatch: CrossRoleMismatch, rank: number): BlindSpot {
  const higherRole = mismatch.scoreA > mismatch.scoreB ? mismatch.roleA : mismatch.roleB;
  const lowerRole = mismatch.scoreA > mismatch.scoreB ? mismatch.roleB : mismatch.roleA;
  const higherScore = Math.max(mismatch.scoreA, mismatch.scoreB);
  const lowerScore = Math.min(mismatch.scoreA, mismatch.scoreB);
  
  return {
    label: `${mismatch.group.replace(/_/g, ' ')} perception gap`,
    explanation: `${higherRole} scores ${higherScore.toFixed(0)} while ${lowerRole} scores ${lowerScore.toFixed(0)} — a gap of ${mismatch.gap.toFixed(0)} points suggests different realities.`,
    whoSeesIt: [higherRole],
    whoDoesnt: [lowerRole],
    linkedQuestionIds: [],
    severity: mismatch.severity,
    source: 'CROSS_ROLE_MISMATCH',
    rank
  };
}

/**
 * Generate blind spots from open text classifications.
 */
function openTextToBlindSpot(
  classifications: OpenTextClassification[],
  rank: number
): BlindSpot | null {
  if (classifications.length === 0) return null;
  
  // Group by category
  const byCategory = new Map<string, OpenTextClassification[]>();
  for (const c of classifications) {
    const existing = byCategory.get(c.category) ?? [];
    existing.push(c);
    byCategory.set(c.category, existing);
  }
  
  // Find most common category
  let maxCount = 0;
  let topCategory = '';
  let topClassifications: OpenTextClassification[] = [];
  
  for (const [category, items] of byCategory) {
    if (items.length > maxCount) {
      maxCount = items.length;
      topCategory = category;
      topClassifications = items;
    }
  }
  
  if (!topCategory) return null;
  
  const roles = [...new Set(topClassifications.map(c => c.role))];
  
  return {
    label: `Open concerns: ${topCategory}`,
    explanation: `${maxCount} participant(s) raised concerns classified as "${topCategory}" in open text responses.`,
    whoSeesIt: roles,
    whoDoesnt: [],
    linkedQuestionIds: topClassifications.map(c => c.questionId),
    severity: 'WARN',
    source: 'TM-8_OPEN_TEXT',
    rank
  };
}

// =============================================================================
// MAIN GENERATOR
// =============================================================================

export interface GenerateBlindSpotsInput {
  flags: Flag[];
  mismatches: CrossRoleMismatch[];
  openTextClassifications: OpenTextClassification[];
  limit?: number;
  participantCount?: number;
}

/**
 * Generate top blind spots for the case.
 * 
 * Priority:
 * 1. CRITICAL flags first
 * 2. Largest cross-role gaps
 * 3. Overconfidence
 * 4. Open text signals
 */
export function generateBlindSpots(input: GenerateBlindSpotsInput): BlindSpot[] {
  const { flags, mismatches, openTextClassifications, limit = 5, participantCount = 1 } = input;
  
  // For single participants, blind spots don't make sense - return empty array
  if (participantCount === 1) {
    return [];
  }
  
  const candidates: BlindSpot[] = [];
  let rank = 1;
  
  // 1. CRITICAL flags first
  const criticalFlags = flags.filter(f => f.severity === 'CRITICAL');
  for (const flag of criticalFlags) {
    if (rank > limit) break;
    candidates.push(flagToBlindSpot(flag, rank++));
  }
  
  // 2. Top mismatches (if not already covered by CROSS_ROLE_MISMATCH flags)
  const addedMismatchGroups = new Set(
    candidates.filter(c => c.source === 'CROSS_ROLE_MISMATCH').map(c => c.label)
  );
  
  for (const mismatch of mismatches) {
    if (rank > limit) break;
    const label = `${mismatch.group.replace(/_/g, ' ')} perception gap`;
    if (!addedMismatchGroups.has(label)) {
      candidates.push(mismatchToBlindSpot(mismatch, rank++));
      addedMismatchGroups.add(label);
    }
  }
  
  // 3. Overconfidence flags
  const overconfidenceFlags = flags.filter(f => f.flag_id === 'OVERCONFIDENCE' && f.severity !== 'CRITICAL');
  for (const flag of overconfidenceFlags) {
    if (rank > limit) break;
    candidates.push(flagToBlindSpot(flag, rank++));
  }
  
  // 4. WARNING flags
  const warnFlags = flags.filter(f => 
    f.severity === 'WARN' && 
    !candidates.some(c => c.source === f.flag_id)
  );
  for (const flag of warnFlags) {
    if (rank > limit) break;
    candidates.push(flagToBlindSpot(flag, rank++));
  }
  
  // 5. Open text signal (if room)
  if (rank <= limit && openTextClassifications.length > 0) {
    const openTextSpot = openTextToBlindSpot(openTextClassifications, rank);
    if (openTextSpot) {
      candidates.push(openTextSpot);
    }
  }
  
  return candidates.slice(0, limit);
}

/**
 * Get blind spot summary for display.
 */
export function getBlindSpotSummary(blindSpots: BlindSpot[]): string {
  if (blindSpots.length === 0) {
    return 'No significant blind spots detected.';
  }
  
  const lines = blindSpots.map((bs, i) => {
    const icon = bs.severity === 'CRITICAL' ? '🔴' : bs.severity === 'WARN' ? '🟡' : '🔵';
    return `${i + 1}. ${icon} ${bs.label}`;
  });
  
  return lines.join('\n');
}

export default generateBlindSpots;
