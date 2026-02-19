import { randomBytes } from 'crypto';
import { prisma } from '@/lib/db';

/**
 * Generate a random token (32 bytes = 64 hex chars)
 */
export function generateToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Create a verification token for email verification
 */
export async function createVerificationToken(email: string): Promise<string> {
  const token = generateToken();
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Delete any existing tokens for this email
  await prisma.verificationToken.deleteMany({
    where: { identifier: email },
  });

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  return token;
}

/**
 * Verify and consume a verification token
 */
export async function verifyVerificationToken(
  token: string
): Promise<string | null> {
  const record = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!record) {
    return null;
  }

  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { id: record.id } });
    return null;
  }

  // Delete the token after use
  await prisma.verificationToken.delete({ where: { id: record.id } });

  return record.identifier;
}

/**
 * Create a password reset token
 */
export async function createPasswordResetToken(email: string): Promise<string> {
  const token = generateToken();
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  // Delete any existing tokens for this email
  await prisma.passwordResetToken.deleteMany({
    where: { email },
  });

  await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return token;
}

/**
 * Verify and consume a password reset token
 */
export async function verifyPasswordResetToken(
  token: string
): Promise<string | null> {
  const record = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!record) {
    return null;
  }

  if (record.expires < new Date()) {
    await prisma.passwordResetToken.delete({ where: { id: record.id } });
    return null;
  }

  // Delete the token after use
  await prisma.passwordResetToken.delete({ where: { id: record.id } });

  return record.email;
}
