/**
 * Flag Engine - Aggregator
 * 
 * Runs all Truth Mechanisms (TM-1 through TM-8) and collects flags.
 * Flags are computed BEFORE the recommendation is determined.
 * 
 * CRITICAL: All flags must be deterministic and reproducible.
 */

import { Flag, FlagSeverity, Role } from '../questions/types';
import { detectTm1Flags, AnswerLookup } from './tm1';
import detectAllTm2Flags from './tm2';
import detectTm3Flags from './tm3';
import detectAllTm4Flags from './tm4';
import detectTm5Flags from './tm5';
import detectTm6Flags from './tm6';
import detectTm7Flags from './tm7';
import { processOpenText, OpenTextClassification } from './tm8';

// =============================================================================
// TYPES
// =============================================================================

export interface FlagEngineResult {
  /** All detected flags, sorted by severity (CRITICAL first) */
  flags: Flag[];
  
  /** Open text classifications (TM-8) */
  openTextClassifications: OpenTextClassification[];
  
  /** Count by severity */
  counts: {
    critical: number;
    warn: number;
    info: number;
    total: number;
  };
  
  /** Has any critical flags */
  hasCritical: boolean;
  
  /** Flag IDs for quick lookup */
  flagIds: Set<string>;
}

// =============================================================================
// FLAG SORTING
// =============================================================================

const SEVERITY_ORDER: Record<FlagSeverity, number> = {
  'CRITICAL': 0,
  'WARN': 1,
  'INFO': 2
};

/**
 * Sort flags by severity (CRITICAL first), then by flag_id.
 */
function sortFlags(flags: Flag[]): Flag[] {
  return [...flags].sort((a, b) => {
    const severityDiff = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
    if (severityDiff !== 0) return severityDiff;
    return a.flag_id.localeCompare(b.flag_id);
  });
}

// =============================================================================
// FLAG ENGINE
// =============================================================================

/**
 * Run all truth mechanisms and collect flags.
 * 
 * @param answers - All answers for the case
 * @returns FlagEngineResult with all flags and metadata
 */
export async function runFlagEngine(
  answers: AnswerLookup
): Promise<FlagEngineResult> {
  const allFlags: Flag[] = [];
  
  // TM-1: Reversed Logic Contradictions
  const tm1Flags = detectTm1Flags(answers);
  allFlags.push(...tm1Flags);
  
  // TM-2: Claim → Proof → Consequence Triads
  const tm2Flags = detectAllTm2Flags(answers);
  allFlags.push(...tm2Flags);
  
  // TM-3: Confidence vs Evidence
  const tm3Flags = detectTm3Flags(answers);
  allFlags.push(...tm3Flags);
  
  // TM-4: Cross-Role Contradiction
  const tm4Flags = detectAllTm4Flags(answers);
  allFlags.push(...tm4Flags);
  
  // TM-5: Ownership Diffusion
  const tm5Flags = detectTm5Flags(answers);
  allFlags.push(...tm5Flags);
  
  // TM-6: Forced Trade-offs
  const tm6Flags = detectTm6Flags(answers);
  allFlags.push(...tm6Flags);
  
  // TM-7: Time-Separated Consistency
  const tm7Flags = detectTm7Flags(answers);
  allFlags.push(...tm7Flags);
  
  // TM-8: Open Text Classification (async)
  const openTextClassifications = await processOpenText(answers);
  // TM-8 doesn't generate direct flags, classifications used separately
  
  // Sort flags by severity
  const sortedFlags = sortFlags(allFlags);
  
  // Count by severity
  const counts = {
    critical: sortedFlags.filter(f => f.severity === 'CRITICAL').length,
    warn: sortedFlags.filter(f => f.severity === 'WARN').length,
    info: sortedFlags.filter(f => f.severity === 'INFO').length,
    total: sortedFlags.length
  };
  
  // Build flag ID set for quick lookup
  const flagIds = new Set(sortedFlags.map(f => f.flag_id));
  
  return {
    flags: sortedFlags,
    openTextClassifications,
    counts,
    hasCritical: counts.critical > 0,
    flagIds
  };
}

/**
 * Synchronous version that skips TM-8 (for testing).
 */
export function runFlagEngineSync(answers: AnswerLookup): Omit<FlagEngineResult, 'openTextClassifications'> & { openTextClassifications: [] } {
  const allFlags: Flag[] = [];
  
  allFlags.push(...detectTm1Flags(answers));
  allFlags.push(...detectAllTm2Flags(answers));
  allFlags.push(...detectTm3Flags(answers));
  allFlags.push(...detectAllTm4Flags(answers));
  allFlags.push(...detectTm5Flags(answers));
  allFlags.push(...detectTm6Flags(answers));
  allFlags.push(...detectTm7Flags(answers));
  
  const sortedFlags = sortFlags(allFlags);
  
  const counts = {
    critical: sortedFlags.filter(f => f.severity === 'CRITICAL').length,
    warn: sortedFlags.filter(f => f.severity === 'WARN').length,
    info: sortedFlags.filter(f => f.severity === 'INFO').length,
    total: sortedFlags.length
  };
  
  return {
    flags: sortedFlags,
    openTextClassifications: [],
    counts,
    hasCritical: counts.critical > 0,
    flagIds: new Set(sortedFlags.map(f => f.flag_id))
  };
}

// =============================================================================
// FLAG HELPERS
// =============================================================================

/**
 * Check if a specific flag is present.
 */
export function hasFlag(result: FlagEngineResult, flagId: string): boolean {
  return result.flagIds.has(flagId);
}

/**
 * Get flags by severity.
 */
export function getFlagsBySeverity(
  result: FlagEngineResult, 
  severity: FlagSeverity
): Flag[] {
  return result.flags.filter(f => f.severity === severity);
}

/**
 * Get critical flags.
 */
export function getCriticalFlags(result: FlagEngineResult): Flag[] {
  return getFlagsBySeverity(result, 'CRITICAL');
}

/**
 * Get top N flags (by severity).
 */
export function getTopFlags(result: FlagEngineResult, n: number = 5): Flag[] {
  return result.flags.slice(0, n);
}

/**
 * Get unique flag IDs.
 */
export function getUniqueFlagIds(result: FlagEngineResult): string[] {
  return Array.from(new Set(result.flags.map(f => f.flag_id)));
}

/**
 * Check if OWNERSHIP_DIFFUSION is critical.
 */
export function hasOwnershipDiffusion(result: FlagEngineResult): boolean {
  return result.flags.some(
    f => f.flag_id === 'OWNERSHIP_DIFFUSION' && f.severity === 'CRITICAL'
  );
}

/**
 * Check if CAPACITY_ILLUSION_CONFIRMED is present.
 */
export function hasCapacityIllusionConfirmed(result: FlagEngineResult): boolean {
  return result.flagIds.has('CAPACITY_ILLUSION_CONFIRMED');
}

/**
 * Check if NARRATIVE_INFLATION_RISK is present.
 */
export function hasNarrativeInflationRisk(result: FlagEngineResult): boolean {
  return result.flagIds.has('NARRATIVE_INFLATION_RISK');
}

/**
 * Get flags for a specific role.
 */
export function getFlagsForRole(result: FlagEngineResult, role: Role): Flag[] {
  return result.flags.filter(f => f.evidence.roles?.includes(role));
}

/**
 * Generate flag summary text.
 */
export function getFlagSummary(result: FlagEngineResult): string {
  if (result.flags.length === 0) {
    return 'No flags detected.';
  }
  
  const lines: string[] = [];
  
  if (result.counts.critical > 0) {
    lines.push(`🔴 ${result.counts.critical} CRITICAL flag(s)`);
  }
  if (result.counts.warn > 0) {
    lines.push(`🟡 ${result.counts.warn} WARNING flag(s)`);
  }
  if (result.counts.info > 0) {
    lines.push(`🔵 ${result.counts.info} INFO flag(s)`);
  }
  
  return lines.join('\n');
}

export default runFlagEngine;
