/**
 * Email Verify API Route
 * 
 * GET /api/email/verify - Verify SMTP connection
 */

import { NextResponse } from 'next/server';
import { verifyConnection, isEmailConfigured, emailConfig } from '@/lib/email';

export async function GET() {
  try {
    if (!isEmailConfigured()) {
      return NextResponse.json({
        configured: false,
        connected: false,
        error: 'SMTP credentials not configured',
      });
    }

    const connected = await verifyConnection();

    return NextResponse.json({
      configured: true,
      connected,
      from: emailConfig.from.address,
      host: emailConfig.host,
      port: emailConfig.port,
    });
  } catch (error) {
    console.error('Error verifying email:', error);
    return NextResponse.json(
      {
        configured: isEmailConfigured(),
        connected: false,
        error: error instanceof Error ? error.message : 'Verification failed',
      },
      { status: 500 }
    );
  }
}
