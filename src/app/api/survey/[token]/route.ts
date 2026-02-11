/**
 * Survey API Route
 * 
 * GET /api/survey/[token] - Get survey data for participant
 * 
 * BLOCKER: Must NOT expose scoring data, flags, weights, or other internal fields.
 * Participants see only: decision context (partial), questions, their own responses.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getQuestionsForRole } from '@/lib/questions/registry';
import { getSafeQuestionsForRole } from '@/lib/middleware/forbiddenFields';
import { isRoleActive } from '@/lib/variants/config';
import { Role } from '@/lib/questions/types';
import { KitVariant } from '@/lib/variants/types';

interface RouteParams {
  params: { token: string };
}

// GET - Get survey data
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Find participant by token
    const participant = await prisma.participant.findUnique({
      where: { token: params.token },
      include: {
        case: {
          select: {
            id: true,
            variant: true,
            status: true,
            decisionTitle: true,
            decisionDescription: true,
            dCtx1: true,
            dCtx2: true,
            dCtx3: true,
            dCtx4: true,
            impactedAreas: true,
            timeHorizon: true,
            // DELIBERATELY EXCLUDED: investmentType, estimatedInvestment (internal)
          }
        },
        responses: {
          select: {
            questionId: true,
            rawValue: true
          }
        }
      }
    });
    
    if (!participant) {
      return NextResponse.json(
        { error: 'Invalid survey token' },
        { status: 404 }
      );
    }
    
    // Check if case is active
    if (participant.case.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'This survey has been completed' },
        { status: 410 }
      );
    }
    
    // Check if role is active for variant
    const variant = participant.case.variant as KitVariant;
    const role = participant.role as Role;
    
    if (!isRoleActive(variant, role)) {
      return NextResponse.json(
        { error: 'This role is not active for this assessment' },
        { status: 403 }
      );
    }
    
    // Get questions for this role (safe version - no internal fields)
    const questions = getQuestionsForRole(role);
    const safeQuestions = getSafeQuestionsForRole(questions);
    
    // Build response (participant-safe)
    const response = {
      participant: {
        id: participant.id,
        role: participant.role,
        name: participant.name,
        status: participant.status
      },
      context: {
        title: participant.case.decisionTitle,
        description: participant.case.decisionDescription,
        dCtx1: participant.case.dCtx1,
        dCtx2: participant.case.dCtx2,
        dCtx3: participant.case.dCtx3,
        dCtx4: participant.case.dCtx4,
        impactedAreas: JSON.parse(participant.case.impactedAreas),
        timeHorizon: participant.case.timeHorizon
        // NO: investmentType, estimatedInvestment, variant details
      },
      questions: safeQuestions,
      responses: Object.fromEntries(
        participant.responses.map(r => [r.questionId, r.rawValue])
      ),
      progress: {
        total: questions.length,
        completed: participant.responses.length,
        percentage: Math.round((participant.responses.length / questions.length) * 100)
      }
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error getting survey:', error);
    return NextResponse.json(
      { error: 'Failed to get survey' },
      { status: 500 }
    );
  }
}
