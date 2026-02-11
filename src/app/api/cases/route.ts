/**
 * Cases API Route
 * 
 * POST /api/cases - Create a new decision case
 * GET /api/cases - List cases (for initiator)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { validateCreateCase } from '@/lib/context/validation';
import { nanoid } from 'nanoid';

// POST - Create new case
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = validateCreateCase(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }
    
    // Create case
    const newCase = await prisma.decisionCase.create({
      data: {
        variant: body.variant,
        status: 'DRAFT',
        decisionTitle: body.decisionTitle,
        investmentType: body.investmentType,
        decisionDescription: body.decisionDescription,
        impactedAreas: JSON.stringify(body.impactedAreas),
        timeHorizon: body.timeHorizon,
        estimatedInvestment: body.estimatedInvestment ?? null,
        dCtx1: body.dCtx1,
        dCtx2: body.dCtx2,
        dCtx3: body.dCtx3,
        dCtx4: body.dCtx4,
        createdBy: body.createdBy ?? null
      }
    });
    
    return NextResponse.json(newCase, { status: 201 });
  } catch (error) {
    console.error('Error creating case:', error);
    return NextResponse.json(
      { error: 'Failed to create case' },
      { status: 500 }
    );
  }
}

// GET - List cases
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') ?? '20');
    
    const where = status ? { status } : {};
    
    const cases = await prisma.decisionCase.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        variant: true,
        status: true,
        decisionTitle: true,
        investmentType: true,
        timeHorizon: true,
        createdAt: true,
        firstResponseAt: true,
        completedAt: true,
        _count: {
          select: { participants: true, responses: true }
        }
      }
    });
    
    return NextResponse.json(cases);
  } catch (error) {
    console.error('Error listing cases:', error);
    return NextResponse.json(
      { error: 'Failed to list cases' },
      { status: 500 }
    );
  }
}
