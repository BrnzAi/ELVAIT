/**
 * Cases API Route
 * 
 * POST /api/cases - Create a new decision case
 * GET /api/cases - List cases (for initiator)
 *   ?countOnly=true - Returns only count and tier info
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { validateCreateCase } from '@/lib/context/validation';
import { auth } from '@/lib/auth';
import { TIER_LIMITS, Tier } from '@/lib/tiers';

// POST - Create new case
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const session = await auth();
    
    // Validate input
    const validation = validateCreateCase(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }
    
    // Check case limit for authenticated users
    let userId: string | null = null;
    if (session?.user?.id) {
      userId = session.user.id;
      
      // Get user tier
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { tier: true }
      });
      
      const tier = (user?.tier || 'free') as Tier;
      const maxCases = TIER_LIMITS[tier]?.maxCases || 1;
      
      // Count existing cases for this user
      const existingCount = await prisma.decisionCase.count({
        where: { createdBy: userId }
      });
      
      if (existingCount >= maxCases) {
        return NextResponse.json(
          { error: `Case limit reached. Your ${tier} plan allows ${maxCases} active assessment${maxCases > 1 ? 's' : ''}.` },
          { status: 403 }
        );
      }
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
        createdBy: userId
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
    const countOnly = searchParams.get('countOnly') === 'true';
    
    const session = await auth();
    
    // For countOnly requests, return count and tier info
    if (countOnly) {
      if (!session?.user?.id) {
        return NextResponse.json({ count: 0, tier: 'free' });
      }
      
      // Get user tier
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { tier: true }
      });
      
      // Count cases for this user
      const count = await prisma.decisionCase.count({
        where: { createdBy: session.user.id }
      });
      
      return NextResponse.json({
        count,
        tier: user?.tier || 'free'
      });
    }
    
    // Build filter
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    
    // If authenticated, show only user's cases
    if (session?.user?.id) {
      where.createdBy = session.user.id;
    }
    
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
