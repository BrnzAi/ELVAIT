/**
 * Sign Up API Route
 * POST /api/auth/signup - Register a new user
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, validatePassword, createVerificationToken } from '@/lib/auth';
import { sendEmail } from '@/lib/email';

interface SignUpRequest {
  email: string;
  password: string;
  name?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SignUpRequest = await request.json();

    // Validate input
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const email = body.email.toLowerCase().trim();
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password
    const passwordError = validatePassword(body.password);
    if (passwordError) {
      return NextResponse.json(
        { error: passwordError },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(body.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: body.name?.trim() || null,
      },
    });

    // Create verification token and send email
    const token = await createVerificationToken(email);
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

    const emailResult = await sendEmail({
      to: email,
      subject: 'Verify your ELVAIT account',
      html: `
        <h2>Welcome to ELVAIT!</h2>
        <p>Please verify your email by clicking the link below:</p>
        <p><a href="${verifyUrl}" style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Verify Email</a></p>
        <p>Or copy this link: ${verifyUrl}</p>
        <p>This link expires in 24 hours.</p>
        <p>— ELVAIT Team</p>
      `,
      text: `Welcome to ELVAIT!\n\nPlease verify your email by visiting: ${verifyUrl}\n\nThis link expires in 24 hours.\n\n— ELVAIT Team`,
    });

    if (!emailResult.success) {
      console.warn(`Failed to send verification email to ${email}: ${emailResult.error}`);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Account created. Please check your email to verify your account.',
        emailSent: emailResult.success,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
