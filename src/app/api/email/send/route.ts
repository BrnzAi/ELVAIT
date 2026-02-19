/**
 * Email Send API Route
 * 
 * POST /api/email/send - Send an email
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, isEmailConfigured, type EmailOptions } from '@/lib/email';

interface SendEmailRequest {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
}

export async function POST(request: NextRequest) {
  try {
    // Check if email is configured
    if (!isEmailConfigured()) {
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 503 }
      );
    }

    const body: SendEmailRequest = await request.json();

    // Validate required fields
    if (!body.to) {
      return NextResponse.json(
        { error: 'Missing required field: to' },
        { status: 400 }
      );
    }

    if (!body.subject) {
      return NextResponse.json(
        { error: 'Missing required field: subject' },
        { status: 400 }
      );
    }

    if (!body.text && !body.html) {
      return NextResponse.json(
        { error: 'Either text or html content is required' },
        { status: 400 }
      );
    }

    // Send email
    const result = await sendEmail({
      to: body.to,
      subject: body.subject,
      text: body.text,
      html: body.html,
      replyTo: body.replyTo,
      cc: body.cc,
      bcc: body.bcc,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
    });
  } catch (error) {
    console.error('Error in email send API:', error);
    return NextResponse.json(
      { error: 'Failed to process email request' },
      { status: 500 }
    );
  }
}
