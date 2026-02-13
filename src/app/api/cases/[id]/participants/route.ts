/**
 * Participants API Route
 * 
 * POST /api/cases/[id]/participants - Add participant to case
 * GET /api/cases/[id]/participants - List participants
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { nanoid } from 'nanoid';
import { isRoleActive } from '@/lib/variants/config';
import { Role, ALL_ROLES } from '@/lib/questions/types';
import { KitVariant } from '@/lib/variants/types';

interface RouteParams {
  params: { id: string };
}

// POST - Add participant
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const body = await request.json();
    const { role, email, name } = body;
    
    // Validate role
    if (!role || !ALL_ROLES.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }
    
    // Get case to check variant
    const caseData = await prisma.decisionCase.findUnique({
      where: { id: params.id }
    });
    
    if (!caseData) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }
    
    // Check if role is active for this variant
    if (!isRoleActive(caseData.variant as KitVariant, role as Role)) {
      return NextResponse.json(
        { error: `Role ${role} is not active for variant ${caseData.variant}` },
        { status: 400 }
      );
    }
    
    // Generate unique token
    const token = nanoid(24);
    
    // Create participant
    const participant = await prisma.participant.create({
      data: {
        caseId: params.id,
        role,
        email: email ?? null,
        name: name ?? null,
        token,
        status: 'INVITED'
      }
    });
    
    // Generate survey URL using proper host detection
    const forwardedHost = request.headers.get('x-forwarded-host');
    const host = request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    
    let baseUrl: string;
    if (forwardedHost) {
      baseUrl = `${protocol}://${forwardedHost}`;
    } else if (host && !host.includes('localhost')) {
      baseUrl = `${protocol}://${host}`;
    } else if (process.env.NEXT_PUBLIC_BASE_URL) {
      baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    } else {
      baseUrl = 'https://elvait.brnz.live';
    }
    
    const surveyUrl = `${baseUrl}/survey/${token}`;
    
    return NextResponse.json({
      ...participant,
      surveyUrl
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding participant:', error);
    return NextResponse.json(
      { error: 'Failed to add participant' },
      { status: 500 }
    );
  }
}

// GET - List participants
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const participants = await prisma.participant.findMany({
      where: { caseId: params.id },
      select: {
        id: true,
        role: true,
        email: true,
        name: true,
        token: true,
        status: true,
        invitedAt: true,
        startedAt: true,
        completedAt: true
      },
      orderBy: { invitedAt: 'asc' }
    });
    
    // Get proper base URL
    const forwardedHost = request.headers.get('x-forwarded-host');
    const host = request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    
    let baseUrl: string;
    if (forwardedHost) {
      baseUrl = `${protocol}://${forwardedHost}`;
    } else if (host && !host.includes('localhost')) {
      baseUrl = `${protocol}://${host}`;
    } else if (process.env.NEXT_PUBLIC_BASE_URL) {
      baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    } else {
      baseUrl = 'https://elvait.brnz.live';
    }
    
    const withUrls = participants.map(p => ({
      ...p,
      surveyUrl: `${baseUrl}/survey/${p.token}`
    }));
    
    return NextResponse.json(withUrls);
  } catch (error) {
    console.error('Error listing participants:', error);
    return NextResponse.json(
      { error: 'Failed to list participants' },
      { status: 500 }
    );
  }
}
