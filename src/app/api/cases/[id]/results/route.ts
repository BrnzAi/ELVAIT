/**
 * Results API Route
 * 
 * GET /api/cases/[id]/results - Generate and return full analysis
 * 
 * Runs the complete analysis pipeline:
 * 1. Scoring Engine (dimensions + ICS)
 * 2. Flag Engine (TM-1 through TM-8)
 * 3. Gating Rules (G1-G4)
 * 4. Recommendation Engine (GO/CLARIFY/NO_GO)
 * 5. Interpretation Pipeline (summary, blind spots, checklist)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { KitVariant } from '@/lib/variants/types';
import { Role } from '@/lib/questions/types';
import { getQuestionsForRole, QUESTION_REGISTRY } from '@/lib/questions/registry';
import { getActiveRoles } from '@/lib/variants/config';

// Scoring
import { calculateCaseScores, Answer } from '@/lib/scoring/dimensions';
import { computeIcs } from '@/lib/scoring/ics';
import { calculateCompleteProcessScores, getGateProcessScore } from '@/lib/scoring/process-scores';

// Flags
import { runFlagEngine, FlagEngineResult } from '@/lib/flags/engine';
import { AnswerLookup } from '@/lib/flags/tm1';

// Gates & Recommendation
import { evaluateAllGates } from '@/lib/gates/rules';
import { computeRecommendation } from '@/lib/recommendation/engine';

// Interpretation
import { generateCaseSummary, CaseSummary } from '@/lib/interpretation/summary';
import { generateBlindSpots, BlindSpot } from '@/lib/interpretation/blindspots';
import { generateChecklist, ChecklistItem } from '@/lib/interpretation/checklist';
import { generateAiSummary, AiSummaryOutput } from '@/lib/interpretation/aiSummary';

interface RouteParams {
  params: { id: string };
}

// GET - Generate results
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Get case with all data
    const caseData = await prisma.decisionCase.findUnique({
      where: { id: params.id },
      include: {
        participants: true,
        responses: true,
        processes: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    });
    
    if (!caseData) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }
    
    if (caseData.responses.length === 0) {
      return NextResponse.json(
        { error: 'No responses yet' },
        { status: 400 }
      );
    }
    
    const variant = caseData.variant as KitVariant;
    
    // Build answer structures
    const answers: Answer[] = caseData.responses.map(r => ({
      questionId: r.questionId,
      rawValue: r.answerType === 'LIKERT' ? parseInt(r.rawValue, 10) : r.rawValue,
      participantId: r.participantId,
      role: caseData.participants.find(p => p.id === r.participantId)?.role as Role ?? 'EXEC'
    }));
    
    const answerLookup: AnswerLookup = {};
    for (const r of caseData.responses) {
      const participant = caseData.participants.find(p => p.id === r.participantId);
      answerLookup[r.questionId] = {
        rawValue: r.answerType === 'LIKERT' ? parseInt(r.rawValue, 10) : r.rawValue as any,
        participantId: r.participantId,
        role: participant?.role as Role ?? 'EXEC'
      };
    }
    
    // 1. Calculate scores
    const { roleScores, caseScores } = calculateCaseScores(answers, variant);
    
    // 1.5. Calculate per-process scores (if processes exist)
    const processScoring = calculateCompleteProcessScores(caseData.responses, caseData.processes);
    
    // 2. Calculate ICS
    const icsResult = computeIcs(caseScores, variant);
    
    // 3. Run flag engine
    const flagResult = await runFlagEngine(answerLookup);
    
    // 4. Evaluate gates (use weakest process score for gating)
    const gateProcessScore = getGateProcessScore(caseScores.P, processScoring);
    const gateResult = evaluateAllGates({
      caseDimScores: { ...caseScores, P: gateProcessScore },
      variant,
      flagResult,
      userFrictionScore: roleScores['USER']?.['D3'] ?? null,
      execReadinessScore: roleScores['EXEC']?.['D3'] ?? null
    });
    
    // 5. Compute recommendation
    const recommendationResult = computeRecommendation(
      icsResult,
      flagResult,
      gateResult,
      variant
    );
    
    // 6. Generate case summary
    const summary = generateCaseSummary({
      icsResult,
      recommendationResult,
      dimScores: caseScores,
      roleDimScores: roleScores,
      flagResult,
      gateResult,
      variant
    });
    
    // 7. Generate blind spots
    const blindSpots = generateBlindSpots({
      flags: flagResult.flags,
      mismatches: summary.topMismatches,
      openTextClassifications: flagResult.openTextClassifications,
      participantCount: caseData.participants.length
    });
    
    // 8. Generate checklist
    const checklistItems = generateChecklist({
      recommendation: recommendationResult.recommendation,
      flags: flagResult.flags,
      hasWeakProofWithHighClaim: flagResult.flags.some(f => 
        f.flag_id === 'PROOF_GAP' || f.flag_id === 'NARRATIVE_INFLATION_RISK'
      )
    });
    
    // 9. Collect text responses
    const activeRoles = getActiveRoles(variant);
    const questions = QUESTION_REGISTRY.filter(q => activeRoles.includes(q.role));
    const textResponses = caseData.responses
      .filter(r => r.answerType === 'TEXT' && r.rawValue.trim())
      .map(r => {
        const participant = caseData.participants.find(p => p.id === r.participantId);
        const question = questions.find(q => q.question_id === r.questionId);
        
        return {
          questionId: r.questionId,
          questionText: question?.text ?? r.questionId,
          response: r.rawValue,
          participantRole: participant?.role ?? 'UNKNOWN'
        };
      });

    // 10. Generate AI summary
    const aiSummary = generateAiSummary({
      summary,
      context: {
        title: caseData.decisionTitle,
        description: caseData.decisionDescription,
        dCtx1: caseData.dCtx1 ?? '',
        dCtx2: caseData.dCtx2 ?? '',
        dCtx3: caseData.dCtx3 ?? '',
        dCtx4: caseData.dCtx4 ?? ''
      },
      blindSpots,
      checklistItems,
      textResponses,
      participantCount: caseData.participants.length
    });
    
    // Save summary to database
    await prisma.caseSummary.upsert({
      where: { caseId: params.id },
      create: {
        caseId: params.id,
        ics: icsResult.ics,
        recommendation: recommendationResult.recommendation,
        dimScores: JSON.stringify(caseScores),
        roleDimScores: JSON.stringify(roleScores),
        flags: JSON.stringify(flagResult.flags),
        gates: JSON.stringify(gateResult.gates),
        topMismatches: JSON.stringify(summary.topMismatches),
        aiSummary: aiSummary.boardNarrative,
        blindSpots: JSON.stringify(blindSpots),
        checklistItems: JSON.stringify(checklistItems),
        processScore: gateProcessScore,
        processReadiness: summary.processReadiness
      },
      update: {
        ics: icsResult.ics,
        recommendation: recommendationResult.recommendation,
        dimScores: JSON.stringify(caseScores),
        roleDimScores: JSON.stringify(roleScores),
        flags: JSON.stringify(flagResult.flags),
        gates: JSON.stringify(gateResult.gates),
        topMismatches: JSON.stringify(summary.topMismatches),
        aiSummary: aiSummary.boardNarrative,
        blindSpots: JSON.stringify(blindSpots),
        checklistItems: JSON.stringify(checklistItems),
        processScore: gateProcessScore,
        processReadiness: summary.processReadiness
      }
    });
    
    // Build response
    const response = {
      caseId: params.id,
      variant,
      
      // Core results
      ics: {
        value: icsResult.ics,
        label: icsResult.label,
        breakdown: icsResult.breakdown
      },
      
      recommendation: {
        value: recommendationResult.recommendation,
        reason: recommendationResult.reason,
        factors: recommendationResult.factors
      },
      
      // Dimension scores
      dimensions: {
        case: caseScores,
        byRole: roleScores
      },
      
      // Flags & gates
      flags: {
        items: flagResult.flags,
        counts: flagResult.counts,
        hasCritical: flagResult.hasCritical
      },
      
      gates: {
        items: gateResult.gates,
        hasGates: gateResult.hasGates
      },
      
      // Interpretation
      blindSpots,
      checklistItems,
      textResponses,
      
      // AI summary
      narrative: {
        executive: aiSummary.executiveSummary,
        keyFindings: aiSummary.keyFindings,
        riskSummary: aiSummary.riskSummary,
        nextSteps: aiSummary.nextSteps,
        boardNarrative: aiSummary.boardNarrative
      },
      
      // Process (if applicable)
      process: caseScores.P !== null ? {
        score: caseScores.P,
        readiness: summary.processReadiness
      } : null,
      
      // Per-process scores (only for multi-process cases)
      processScores: processScoring?.processScores || null,
      aggregateProcessScore: processScoring?.aggregateProcessScore || null,
      lowestProcessScore: processScoring?.lowestProcessScore || null,
      
      // Meta
      generatedAt: new Date().toISOString(),
      responseCount: caseData.responses.length,
      participantCount: caseData.participants.length
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error generating results:', error);
    return NextResponse.json(
      { error: 'Failed to generate results', details: String(error) },
      { status: 500 }
    );
  }
}
