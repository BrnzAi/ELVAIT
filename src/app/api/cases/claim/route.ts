/**
 * Claim Case API Route
 * POST /api/cases/claim - Link an anonymous case to the authenticated user
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { caseId } = await request.json();

    if (!caseId) {
      return NextResponse.json(
        { error: 'Case ID is required' },
        { status: 400 }
      );
    }

    // Find the case
    const existingCase = await prisma.decisionCase.findUnique({
      where: { id: caseId },
    });

    if (!existingCase) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }

    // Check if case is already claimed by another user
    if (existingCase.userId && existingCase.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'This case belongs to another user' },
        { status: 403 }
      );
    }

    // If already claimed by this user, just return success
    if (existingCase.userId === session.user.id) {
      return NextResponse.json({
        success: true,
        message: 'Case already linked to your account',
      });
    }

    // Link the case to the user
    await prisma.decisionCase.update({
      where: { id: caseId },
      data: { userId: session.user.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Case successfully linked to your account',
    });
  } catch (error) {
    console.error('Claim case error:', error);
    return NextResponse.json(
      { error: 'Failed to claim case' },
      { status: 500 }
    );
  }
}
