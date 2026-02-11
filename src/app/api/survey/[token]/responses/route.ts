/**
 * Survey Responses API Route
 * 
 * POST /api/survey/[token]/responses - Submit response(s)
 * 
 * Sets firstResponseAt on case when first response is submitted.
 * This locks the decision title and variant.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { QUESTION_MAP, getQuestionsForRole } from '@/lib/questions/registry';
import { normalise, isValidLikert } from '@/lib/scoring/normalise';
import { Role } from '@/lib/questions/types';

interface RouteParams {
  params: { token: string };
}

interface ResponseInput {
  questionId: string;
  value: number | string;
}

// POST - Submit responses
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const body = await request.json();
    const responses: ResponseInput[] = Array.isArray(body) ? body : [body];
    
    // Find participant
    const participant = await prisma.participant.findUnique({
      where: { token: params.token },
      include: { case: true }
    });
    
    if (!participant) {
      return NextResponse.json(
        { error: 'Invalid survey token' },
        { status: 404 }
      );
    }
    
    if (participant.case.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'This survey has been completed' },
        { status: 410 }
      );
    }
    
    // Get valid questions for this role
    const roleQuestions = getQuestionsForRole(participant.role as Role);
    const validQuestionIds = new Set(roleQuestions.map(q => q.question_id));
    
    // Validate and process responses
    const processedResponses: Array<{
      questionId: string;
      answerType: string;
      rawValue: string;
      adjustedValue: number | null;
      score0100: number | null;
    }> = [];
    
    const errors: Array<{ questionId: string; error: string }> = [];
    
    for (const resp of responses) {
      // Check question is valid for this role
      if (!validQuestionIds.has(resp.questionId)) {
        errors.push({
          questionId: resp.questionId,
          error: 'Question not valid for this role'
        });
        continue;
      }
      
      const question = QUESTION_MAP.get(resp.questionId);
      if (!question) {
        errors.push({
          questionId: resp.questionId,
          error: 'Question not found'
        });
        continue;
      }
      
      // Process based on answer type
      let rawValue: string;
      let adjustedValue: number | null = null;
      let score0100: number | null = null;
      
      if (question.answer_type === 'LIKERT') {
        const numValue = typeof resp.value === 'number' 
          ? resp.value 
          : parseInt(resp.value as string, 10);
        
        if (!isValidLikert(numValue)) {
          errors.push({
            questionId: resp.questionId,
            error: 'Invalid Likert value (must be 1-5)'
          });
          continue;
        }
        
        rawValue = String(numValue);
        const norm = normalise(numValue, question.is_reverse);
        adjustedValue = norm.adjusted;
        score0100 = norm.score_0_100;
      } else if (question.answer_type === 'SINGLE_SELECT') {
        rawValue = String(resp.value);
        
        // Validate option if options are defined
        if (question.options && !question.options.includes(rawValue)) {
          errors.push({
            questionId: resp.questionId,
            error: 'Invalid option selected'
          });
          continue;
        }
      } else if (question.answer_type === 'MULTI_SELECT') {
        rawValue = Array.isArray(resp.value) 
          ? JSON.stringify(resp.value) 
          : String(resp.value);
      } else {
        // TEXT
        rawValue = String(resp.value);
      }
      
      processedResponses.push({
        questionId: resp.questionId,
        answerType: question.answer_type,
        rawValue,
        adjustedValue,
        score0100
      });
    }
    
    if (errors.length > 0 && processedResponses.length === 0) {
      return NextResponse.json(
        { error: 'All responses invalid', details: errors },
        { status: 400 }
      );
    }
    
    // Use transaction to save responses and update status
    const result = await prisma.$transaction(async (tx) => {
      // Check if this is the first response for the case
      const isFirstResponse = participant.case.firstResponseAt === null;
      
      // Save/update responses
      const savedResponses = [];
      for (const resp of processedResponses) {
        const saved = await tx.surveyResponse.upsert({
          where: {
            participantId_questionId: {
              participantId: participant.id,
              questionId: resp.questionId
            }
          },
          create: {
            caseId: participant.case.id,
            participantId: participant.id,
            questionId: resp.questionId,
            answerType: resp.answerType,
            rawValue: resp.rawValue,
            adjustedValue: resp.adjustedValue,
            score0100: resp.score0100
          },
          update: {
            rawValue: resp.rawValue,
            adjustedValue: resp.adjustedValue,
            score0100: resp.score0100
          }
        });
        savedResponses.push(saved);
      }
      
      // Update participant status
      const totalQuestions = roleQuestions.length;
      const responseCount = await tx.surveyResponse.count({
        where: { participantId: participant.id }
      });
      
      const newStatus = responseCount >= totalQuestions ? 'COMPLETED' : 'IN_PROGRESS';
      
      await tx.participant.update({
        where: { id: participant.id },
        data: {
          status: newStatus,
          startedAt: participant.startedAt ?? new Date(),
          completedAt: newStatus === 'COMPLETED' ? new Date() : null
        }
      });
      
      // Set firstResponseAt if this is the first response
      if (isFirstResponse) {
        await tx.decisionCase.update({
          where: { id: participant.case.id },
          data: {
            firstResponseAt: new Date(),
            status: 'ACTIVE'
          }
        });
      }
      
      return {
        saved: savedResponses.length,
        status: newStatus,
        progress: {
          total: totalQuestions,
          completed: responseCount,
          percentage: Math.round((responseCount / totalQuestions) * 100)
        }
      };
    });
    
    return NextResponse.json({
      success: true,
      ...result,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error saving responses:', error);
    return NextResponse.json(
      { error: 'Failed to save responses' },
      { status: 500 }
    );
  }
}
