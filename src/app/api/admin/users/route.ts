/**
 * Admin Users API Route
 * 
 * GET /api/admin/users - List all users with tier info
 * PATCH /api/admin/users - Update user tier
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { Tier } from '@/lib/tiers';

// Admin check helper
async function isAdmin(session: { user?: { email?: string | null } } | null): Promise<boolean> {
  if (!session?.user?.email) return false;
  
  // Admin emails or domains
  const adminDomains = ['@brnz.ai', '@elvait.ai'];
  const adminEmails = ['admin@example.com'];
  
  return adminDomains.some(domain => session.user?.email?.endsWith(domain)) ||
         adminEmails.includes(session.user.email);
}

// GET - List all users
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!await isAdmin(session)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        tier: true,
        emailVerified: true,
        createdAt: true,
        _count: {
          select: { cases: true }
        }
      }
    });
    
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error listing users:', error);
    return NextResponse.json(
      { error: 'Failed to list users' },
      { status: 500 }
    );
  }
}

// PATCH - Update user tier
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!await isAdmin(session)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const { userId, tier } = body;
    
    // Validate tier
    const validTiers: Tier[] = ['free', 'starter', 'professional', 'enterprise'];
    if (!validTiers.includes(tier)) {
      return NextResponse.json(
        { error: 'Invalid tier' },
        { status: 400 }
      );
    }
    
    // Update user
    const user = await prisma.user.update({
      where: { id: userId },
      data: { tier },
      select: {
        id: true,
        email: true,
        tier: true
      }
    });
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
