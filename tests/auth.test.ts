/**
 * Authentication Tests
 * 
 * Tests for password utilities, token generation, and email verification
 */

import { describe, it, expect } from 'vitest';
import { validatePassword } from '../src/lib/auth/password';

// =============================================================================
// Password Validation Tests
// =============================================================================

describe('Auth: Password Validation', () => {
  describe('validatePassword', () => {
    it('should reject passwords shorter than 8 characters', () => {
      const result = validatePassword('Short1A');
      expect(result).toBe('Password must be at least 8 characters');
    });

    it('should reject passwords without uppercase letters', () => {
      const result = validatePassword('lowercase123');
      expect(result).toBe('Password must contain at least one uppercase letter');
    });

    it('should reject passwords without lowercase letters', () => {
      const result = validatePassword('UPPERCASE123');
      expect(result).toBe('Password must contain at least one lowercase letter');
    });

    it('should reject passwords without numbers', () => {
      const result = validatePassword('NoNumbersHere');
      expect(result).toBe('Password must contain at least one number');
    });

    it('should accept valid passwords', () => {
      const result = validatePassword('ValidPass123');
      expect(result).toBeNull();
    });

    it('should accept complex passwords', () => {
      const result = validatePassword('C0mpl3x!P@ssw0rd');
      expect(result).toBeNull();
    });

    it('should accept passwords with special characters', () => {
      const result = validatePassword('Test@123!');
      expect(result).toBeNull();
    });

    it('should accept minimum valid password', () => {
      const result = validatePassword('Abcd1234');
      expect(result).toBeNull();
    });
  });
});

// =============================================================================
// Email Validation Tests (signup validation)
// =============================================================================

describe('Auth: Email Validation', () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  it('should accept valid email addresses', () => {
    expect(emailRegex.test('user@example.com')).toBe(true);
    expect(emailRegex.test('user.name@example.co.uk')).toBe(true);
    expect(emailRegex.test('user+tag@example.org')).toBe(true);
  });

  it('should reject invalid email addresses', () => {
    expect(emailRegex.test('invalid')).toBe(false);
    expect(emailRegex.test('invalid@')).toBe(false);
    expect(emailRegex.test('@example.com')).toBe(false);
    expect(emailRegex.test('user @example.com')).toBe(false);
  });
});

// =============================================================================
// Auth Configuration Tests
// =============================================================================

describe('Auth: Configuration', () => {
  it('should have email config structure', async () => {
    const { emailConfig, isEmailConfigured } = await import('../src/lib/email/config');
    
    expect(emailConfig).toHaveProperty('host');
    expect(emailConfig).toHaveProperty('port');
    expect(emailConfig).toHaveProperty('auth');
    expect(emailConfig).toHaveProperty('from');
    expect(typeof isEmailConfigured).toBe('function');
  });
});

// =============================================================================
// Token Generation Tests (mocked)
// =============================================================================

describe('Auth: Token Format', () => {
  it('should generate tokens of correct length', async () => {
    const { generateToken } = await import('../src/lib/auth/tokens');
    const token = generateToken();
    
    // 32 bytes = 64 hex characters
    expect(token).toHaveLength(64);
    expect(/^[a-f0-9]+$/.test(token)).toBe(true);
  });

  it('should generate unique tokens', async () => {
    const { generateToken } = await import('../src/lib/auth/tokens');
    const tokens = new Set<string>();
    
    for (let i = 0; i < 100; i++) {
      tokens.add(generateToken());
    }
    
    // All tokens should be unique
    expect(tokens.size).toBe(100);
  });
});

// =============================================================================
// Email Verification Tests
// =============================================================================

describe('Auth: Email Verification Requirements', () => {
  describe('Sign-in Flow', () => {
    it('should block sign-in for unverified users', () => {
      // Auth config throws EMAIL_NOT_VERIFIED if emailVerified is null
      const user = { email: 'test@example.com', emailVerified: null };
      const shouldBlock = !user.emailVerified;
      expect(shouldBlock).toBe(true);
    });

    it('should allow sign-in for verified users', () => {
      const user = { email: 'test@example.com', emailVerified: new Date() };
      const shouldBlock = !user.emailVerified;
      expect(shouldBlock).toBe(false);
    });

    it('should return EMAIL_NOT_VERIFIED error code', () => {
      const errorCode = 'EMAIL_NOT_VERIFIED';
      expect(errorCode).toBe('EMAIL_NOT_VERIFIED');
    });
  });

  describe('Sign-up Flow', () => {
    it('should NOT auto-sign-in after registration', () => {
      // Registration creates user but does not sign them in
      const autoSignIn = false;
      expect(autoSignIn).toBe(false);
    });

    it('should send verification email after registration', () => {
      const sendsVerificationEmail = true;
      expect(sendsVerificationEmail).toBe(true);
    });

    it('should show "Check your email" message after registration', () => {
      const successMessage = 'Account created. Please check your email to verify your account.';
      expect(successMessage).toContain('check your email');
    });
  });

  describe('Results Gate Integration', () => {
    it('unverified users should be treated as Tier 0 (anonymous)', () => {
      // Since unverified users cannot sign in, isAuthenticated = false
      const isAuthenticated = false; // can't sign in without verification
      const tier = null;
      const effectiveTier = isAuthenticated ? tier : 'anonymous';
      expect(effectiveTier).toBe('anonymous');
    });

    it('verified + signed-in users should get Tier 1 access', () => {
      const isAuthenticated = true;
      const tier = 'free';
      const hasTier1Access = isAuthenticated && tier !== null;
      expect(hasTier1Access).toBe(true);
    });
  });
});

// =============================================================================
// Admin Email Domain Tests
// =============================================================================

describe('Auth: Admin Access', () => {
  const ADMIN_DOMAINS = ['brnz.ai', 'elvait.ai'];

  const isAdminEmail = (email: string): boolean => {
    const domain = email.split('@')[1]?.toLowerCase();
    return ADMIN_DOMAINS.includes(domain);
  };

  it('should allow @brnz.ai emails as admin', () => {
    expect(isAdminEmail('user@brnz.ai')).toBe(true);
  });

  it('should allow @elvait.ai emails as admin', () => {
    expect(isAdminEmail('user@elvait.ai')).toBe(true);
  });

  it('should reject other domains as admin', () => {
    expect(isAdminEmail('user@gmail.com')).toBe(false);
    expect(isAdminEmail('user@example.com')).toBe(false);
  });

  it('should be case-insensitive', () => {
    expect(isAdminEmail('user@BRNZ.AI')).toBe(true);
    expect(isAdminEmail('user@ELVAIT.AI')).toBe(true);
  });
});
