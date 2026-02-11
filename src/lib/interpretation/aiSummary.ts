/**
 * Interpretation Pipeline - AI Summary (Strictly Bounded)
 * 
 * CRITICAL CONSTRAINTS:
 * - AI is used ONLY for generating narrative summaries
 * - AI NEVER decides GO/CLARIFY/NO_GO (that's rule-derived)
 * - AI must ONLY reference data present in case_summary
 * - AI must NOT invent risks, numbers, or recommendations
 * - AI must use D-CTX-1..4 verbatim for context
 * 
 * Output: Board-ready language based on existing flags and context.
 */

import { CaseSummary } from './summary';
import { BlindSpot } from './blindspots';
import { ChecklistItem } from './checklist';
import { getRecommendationDisplay, getRecommendationEmoji } from '../recommendation/engine';

// =============================================================================
// TYPES
// =============================================================================

export interface DecisionContext {
  title: string;
  description: string;
  dCtx1: string; // What decision are we actually trying to make?
  dCtx2: string; // What will be different if this decision succeeds?
  dCtx3: string; // What happens if we do nothing?
  dCtx4: string; // What would make this decision a mistake in hindsight?
}

export interface AiSummaryInput {
  summary: CaseSummary;
  context: DecisionContext;
  blindSpots: BlindSpot[];
  checklistItems: ChecklistItem[];
}

export interface AiSummaryOutput {
  /** Executive summary (2-3 sentences) */
  executiveSummary: string;
  
  /** Board-ready narrative */
  boardNarrative: string;
  
  /** Key findings bullet points */
  keyFindings: string[];
  
  /** Risk summary */
  riskSummary: string;
  
  /** Next steps summary */
  nextSteps: string;
}

// =============================================================================
// TEMPLATE-BASED SUMMARY GENERATION
// =============================================================================

/**
 * Generate AI summary using templates.
 * 
 * In production, this could call OpenAI/Claude with strict prompts.
 * For now, uses deterministic templates to ensure bounded output.
 */
export function generateAiSummary(input: AiSummaryInput): AiSummaryOutput {
  const { summary, context, blindSpots, checklistItems } = input;
  
  // Executive Summary
  const executiveSummary = generateExecutiveSummary(summary, context);
  
  // Board Narrative
  const boardNarrative = generateBoardNarrative(summary, context, blindSpots);
  
  // Key Findings
  const keyFindings = generateKeyFindings(summary, blindSpots);
  
  // Risk Summary
  const riskSummary = generateRiskSummary(summary, blindSpots);
  
  // Next Steps
  const nextSteps = generateNextSteps(summary, checklistItems);
  
  return {
    executiveSummary,
    boardNarrative,
    keyFindings,
    riskSummary,
    nextSteps
  };
}

// =============================================================================
// EXECUTIVE SUMMARY
// =============================================================================

function generateExecutiveSummary(summary: CaseSummary, context: DecisionContext): string {
  const rec = summary.recommendation;
  const ics = summary.ics;
  const emoji = getRecommendationEmoji(rec);
  
  if (rec === null) {
    return `Assessment of "${context.title}" produced a Process Readiness Score of ${summary.processScore?.toFixed(0) ?? 'N/A'}. This standalone process check does not include an investment recommendation.`;
  }
  
  const icsLabel = summary.icsLabel ?? 'Not computed';
  const flagCount = summary.flags.length;
  const criticalCount = summary.flags.filter(f => f.severity === 'CRITICAL').length;
  
  let summaryText = `${emoji} Assessment of "${context.title}" resulted in a ${rec} recommendation with an Investment Clarity Score of ${ics?.toFixed(1)} (${icsLabel}).`;
  
  if (criticalCount > 0) {
    summaryText += ` ${criticalCount} critical issue(s) require attention before proceeding.`;
  } else if (flagCount > 0) {
    summaryText += ` ${flagCount} area(s) were flagged for review.`;
  }
  
  return summaryText;
}

// =============================================================================
// BOARD NARRATIVE
// =============================================================================

function generateBoardNarrative(
  summary: CaseSummary, 
  context: DecisionContext,
  blindSpots: BlindSpot[]
): string {
  const sections: string[] = [];
  
  // Decision Context (verbatim from D-CTX)
  sections.push('## Decision Context');
  sections.push(`**Decision:** ${context.dCtx1}`);
  sections.push(`**Success Definition:** ${context.dCtx2}`);
  sections.push(`**Do-Nothing Scenario:** ${context.dCtx3}`);
  sections.push(`**Mistake Scenario:** ${context.dCtx4}`);
  sections.push('');
  
  // Assessment Result
  sections.push('## Assessment Result');
  const rec = summary.recommendation;
  const display = getRecommendationDisplay(rec);
  const emoji = getRecommendationEmoji(rec);
  
  if (summary.ics !== null) {
    sections.push(`**Investment Clarity Score:** ${summary.ics.toFixed(1)}/100`);
    sections.push(`**Recommendation:** ${emoji} ${display}`);
    sections.push(`**Basis:** ${summary.recommendationReason}`);
  } else {
    sections.push(`**Process Readiness Score:** ${summary.processScore?.toFixed(1) ?? 'N/A'}/100`);
    sections.push(`**Process Status:** ${summary.processReadiness ?? 'Not assessed'}`);
  }
  sections.push('');
  
  // Key Risks and Blind Spots
  if (blindSpots.length > 0) {
    sections.push('## Key Risks & Blind Spots');
    for (const spot of blindSpots.slice(0, 3)) {
      const icon = spot.severity === 'CRITICAL' ? '🔴' : spot.severity === 'WARN' ? '🟡' : '🔵';
      sections.push(`${icon} **${spot.label}:** ${spot.explanation}`);
    }
    sections.push('');
  }
  
  // Dimension Summary
  sections.push('## Dimension Scores');
  const dims = summary.dimScores;
  sections.push(`- Strategic Intent (D1): ${dims.D1?.toFixed(0) ?? 'N/A'}`);
  sections.push(`- Value & Economics (D2): ${dims.D2?.toFixed(0) ?? 'N/A'}`);
  sections.push(`- Organizational Readiness (D3): ${dims.D3?.toFixed(0) ?? 'N/A'}`);
  sections.push(`- Risk & Dependencies (D4): ${dims.D4?.toFixed(0) ?? 'N/A'}`);
  sections.push(`- Decision Governance (D5): ${dims.D5?.toFixed(0) ?? 'N/A'}`);
  if (summary.processScore !== null) {
    sections.push(`- Process Readiness (P): ${summary.processScore.toFixed(0)}`);
  }
  
  return sections.join('\n');
}

// =============================================================================
// KEY FINDINGS
// =============================================================================

function generateKeyFindings(summary: CaseSummary, blindSpots: BlindSpot[]): string[] {
  const findings: string[] = [];
  
  // ICS-based finding
  if (summary.ics !== null) {
    if (summary.ics >= 75) {
      findings.push('Overall investment clarity is high, supporting a positive decision.');
    } else if (summary.ics >= 55) {
      findings.push('Investment clarity is partial; specific areas require attention before proceeding.');
    } else {
      findings.push('Investment clarity is low; fundamental issues need resolution.');
    }
  }
  
  // Critical flags
  const criticalFlags = summary.flags.filter(f => f.severity === 'CRITICAL');
  if (criticalFlags.length > 0) {
    const flagNames = criticalFlags.map(f => f.flag_id.replace(/_/g, ' ').toLowerCase());
    findings.push(`Critical issues identified: ${flagNames.join(', ')}.`);
  }
  
  // Top mismatches
  if (summary.topMismatches.length > 0) {
    const topMismatch = summary.topMismatches[0];
    findings.push(`Significant perception gap in ${topMismatch.group.replace(/_/g, ' ')}: ${topMismatch.gap.toFixed(0)} points between ${topMismatch.roleA} and ${topMismatch.roleB}.`);
  }
  
  // Blind spots
  for (const spot of blindSpots.slice(0, 2)) {
    findings.push(spot.label + ': ' + spot.explanation.split('.')[0] + '.');
  }
  
  return findings;
}

// =============================================================================
// RISK SUMMARY
// =============================================================================

function generateRiskSummary(summary: CaseSummary, blindSpots: BlindSpot[]): string {
  const criticalCount = summary.flags.filter(f => f.severity === 'CRITICAL').length;
  const warnCount = summary.flags.filter(f => f.severity === 'WARN').length;
  
  if (criticalCount === 0 && warnCount === 0) {
    return 'No significant risks were identified in the assessment.';
  }
  
  let riskText = '';
  
  if (criticalCount > 0) {
    riskText += `${criticalCount} critical risk(s) require immediate attention. `;
  }
  
  if (warnCount > 0) {
    riskText += `${warnCount} warning(s) should be addressed before investment.`;
  }
  
  if (blindSpots.length > 0) {
    const topRisk = blindSpots[0];
    riskText += ` Primary concern: ${topRisk.label}.`;
  }
  
  return riskText.trim();
}

// =============================================================================
// NEXT STEPS
// =============================================================================

function generateNextSteps(summary: CaseSummary, checklistItems: ChecklistItem[]): string {
  const rec = summary.recommendation;
  
  if (rec === 'GO') {
    if (checklistItems.length > 0) {
      return `Proceed with investment. Address ${checklistItems.length} minor item(s) in parallel.`;
    }
    return 'Proceed with investment. No blocking issues identified.';
  }
  
  if (rec === 'CLARIFY') {
    const highPriority = checklistItems.filter(i => i.priority <= 3);
    return `Complete ${highPriority.length} high-priority action item(s) before re-assessment. Key areas: ${highPriority.map(i => i.prompt.split('.')[0]).slice(0, 2).join('; ')}.`;
  }
  
  if (rec === 'NO_GO') {
    return 'Do not proceed. Fundamental issues must be resolved before reconsidering this investment.';
  }
  
  // Process standalone
  if (summary.processReadiness) {
    return `Process status: ${summary.processReadiness}. ${summary.processReadiness === 'Automate' ? 'Process is ready for automation.' : 'Address process issues before automation.'}`;
  }
  
  return 'Review assessment results and determine next steps.';
}

export default generateAiSummary;
