/**
 * Individual Case API Route
 * 
 * GET /api/cases/[id] - Get case details
 * PATCH /api/cases/[id] - Update case (with immutability rules)
 * DELETE /api/cases/[id] - Delete case (only if no responses)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { validateTitleModification, canModifyTitle, canChangeVariant } from '@/lib/context/validation';

interface RouteParams {
  params: { id: string };
}

// GET - Get case details
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    
    const caseData = await prisma.decisionCase.findUnique({
      where: { id },
      include: {
        participants: {
          select: {
            id: true,
            role: true,
            email: true,
            name: true,
            status: true,
            token: true
          }
        },
        summary: true,
        _count: {
          select: { responses: true }
        }
      }
    });
    
    if (!caseData) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }
    
    // Get base URL for survey links
    // Use x-forwarded-host header (set by Cloud Run/proxies) or fall back to host header
    const forwardedHost = request.headers.get('x-forwarded-host');
    const host = request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    
    // Determine the correct base URL
    let baseUrl: string;
    if (forwardedHost) {
      baseUrl = `${protocol}://${forwardedHost}`;
    } else if (host && !host.includes('localhost')) {
      baseUrl = `${protocol}://${host}`;
    } else if (process.env.NEXT_PUBLIC_BASE_URL) {
      baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    } else {
      // Fallback to production URL
      baseUrl = 'https://elvait.brnz.live';
    }
    
    // Add surveyUrl to each participant
    const participantsWithUrls = caseData.participants.map(p => ({
      ...p,
      surveyUrl: `${baseUrl}/survey/${p.token}`
    }));
    
    // Parse JSON fields and construct response
    const response = {
      ...caseData,
      participants: participantsWithUrls,
      impactedAreas: caseData.impactedAreas ? JSON.parse(caseData.impactedAreas) : []
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error getting case:', error);
    // Return more details in development
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to get case', details: errorMessage },
      { status: 500 }
    );
  }
}

// PATCH - Update case
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const body = await request.json();
    
    // Get existing case
    const existing = await prisma.decisionCase.findUnique({
      where: { id: params.id }
    });
    
    if (!existing) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }
    
    // Check immutability rules
    const errors: Array<{ field: string; message: string }> = [];
    
    // Decision title immutability
    if (body.decisionTitle !== undefined && body.decisionTitle !== existing.decisionTitle) {
      if (!canModifyTitle(existing.firstResponseAt)) {
        errors.push({
          field: 'decisionTitle',
          message: 'Decision title cannot be modified after the first participant response'
        });
      }
    }
    
    // Variant immutability
    if (body.variant !== undefined && body.variant !== existing.variant) {
      if (!canChangeVariant(existing.firstResponseAt)) {
        errors.push({
          field: 'variant',
          message: 'Kit variant cannot be changed after the first participant response'
        });
      }
    }
    
    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }
    
    // Build update data
    const updateData: Record<string, unknown> = {};
    
    const allowedFields = [
      'decisionTitle', 'decisionDescription', 'investmentType',
      'timeHorizon', 'estimatedInvestment', 'status',
      'dCtx1', 'dCtx2', 'dCtx3', 'dCtx4'
    ];
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }
    
    if (body.impactedAreas !== undefined) {
      updateData.impactedAreas = JSON.stringify(body.impactedAreas);
    }
    
    // Variant can only be changed if allowed
    if (body.variant !== undefined && canChangeVariant(existing.firstResponseAt)) {
      updateData.variant = body.variant;
    }
    
    const updated = await prisma.decisionCase.update({
      where: { id: params.id },
      data: updateData
    });
    
    return NextResponse.json({
      ...updated,
      impactedAreas: JSON.parse(updated.impactedAreas)
    });
  } catch (error) {
    console.error('Error updating case:', error);
    return NextResponse.json(
      { error: 'Failed to update case' },
      { status: 500 }
    );
  }
}

// DELETE - Delete case
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const existing = await prisma.decisionCase.findUnique({
      where: { id: params.id },
      include: { _count: { select: { responses: true } } }
    });
    
    if (!existing) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }
    
    // Only allow deletion if no responses
    if (existing._count.responses > 0) {
      return NextResponse.json(
        { error: 'Cannot delete case with existing responses' },
        { status: 400 }
      );
    }
    
    await prisma.decisionCase.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting case:', error);
    return NextResponse.json(
      { error: 'Failed to delete case' },
      { status: 500 }
    );
  }
}
