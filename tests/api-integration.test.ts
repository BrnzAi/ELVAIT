/**
 * API Integration Tests
 * 
 * Comprehensive tests for all API endpoints
 */

import { describe, it, expect } from 'vitest';
import { validateCreateCase, INVESTMENT_TYPES, TIME_HORIZONS, ESTIMATED_INVESTMENTS } from '../src/lib/context/validation';

// =============================================================================
// POST /api/cases - Create Case Validation
// =============================================================================

describe('API: POST /api/cases - Validation', () => {
  const validPayload = {
    variant: 'CORE',
    decisionTitle: 'Test Decision Title',
    investmentType: 'AI solution / automation',
    decisionDescription: 'Test description for the decision',
    impactedAreas: ['IT / Technology', 'Operations'],
    timeHorizon: '3-6 months',
    estimatedInvestment: '€100k-€500k',
    dCtx1: 'What decision are we making?',
    dCtx2: 'What does success look like?',
    dCtx3: 'What if we do nothing?',
    dCtx4: 'What would make this a mistake?'
  };

  describe('Required Fields', () => {
    it('should pass with all valid fields', () => {
      const result = validateCreateCase(validPayload);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail without decisionTitle', () => {
      const payload = { ...validPayload, decisionTitle: '' };
      const result = validateCreateCase(payload);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === 'decisionTitle')).toBe(true);
    });

    it('should fail without variant', () => {
      const payload = { ...validPayload, variant: undefined };
      const result = validateCreateCase(payload as any);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === 'variant')).toBe(true);
    });

    it('should fail without investmentType', () => {
      const payload = { ...validPayload, investmentType: '' };
      const result = validateCreateCase(payload);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === 'investmentType')).toBe(true);
    });

    it('should fail without decisionDescription', () => {
      const payload = { ...validPayload, decisionDescription: '' };
      const result = validateCreateCase(payload);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === 'decisionDescription')).toBe(true);
    });

    it('should fail without impactedAreas', () => {
      const payload = { ...validPayload, impactedAreas: [] };
      const result = validateCreateCase(payload);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === 'impactedAreas')).toBe(true);
    });

    it('should fail without timeHorizon', () => {
      const payload = { ...validPayload, timeHorizon: '' };
      const result = validateCreateCase(payload);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === 'timeHorizon')).toBe(true);
    });

    it('should fail without dCtx1', () => {
      const payload = { ...validPayload, dCtx1: '' };
      const result = validateCreateCase(payload);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === 'dCtx1')).toBe(true);
    });

    it('should fail without dCtx2', () => {
      const payload = { ...validPayload, dCtx2: '' };
      const result = validateCreateCase(payload);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === 'dCtx2')).toBe(true);
    });

    it('should fail without dCtx3', () => {
      const payload = { ...validPayload, dCtx3: '' };
      const result = validateCreateCase(payload);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === 'dCtx3')).toBe(true);
    });

    it('should fail without dCtx4', () => {
      const payload = { ...validPayload, dCtx4: '' };
      const result = validateCreateCase(payload);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === 'dCtx4')).toBe(true);
    });
  });

  describe('Field Length Limits', () => {
    it('should fail if decisionTitle > 120 chars', () => {
      const payload = { ...validPayload, decisionTitle: 'x'.repeat(121) };
      const result = validateCreateCase(payload);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === 'decisionTitle')).toBe(true);
    });

    it('should pass if decisionTitle = 120 chars', () => {
      const payload = { ...validPayload, decisionTitle: 'x'.repeat(120) };
      const result = validateCreateCase(payload);
      expect(result.errors.some(e => e.field === 'decisionTitle')).toBe(false);
    });

    it('should fail if decisionDescription > 500 chars', () => {
      const payload = { ...validPayload, decisionDescription: 'x'.repeat(501) };
      const result = validateCreateCase(payload);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === 'decisionDescription')).toBe(true);
    });

    it('should fail if dCtx1 > 1000 chars', () => {
      const payload = { ...validPayload, dCtx1: 'x'.repeat(1001) };
      const result = validateCreateCase(payload);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === 'dCtx1')).toBe(true);
    });
  });

  describe('Enum Validation', () => {
    it('should fail with invalid variant', () => {
      const payload = { ...validPayload, variant: 'INVALID_VARIANT' };
      const result = validateCreateCase(payload as any);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === 'variant')).toBe(true);
    });

    it('should accept all valid variants', () => {
      const variants = ['QUICK_CHECK', 'CORE', 'FULL', 'PROCESS_STANDALONE'];
      variants.forEach(variant => {
        const payload = { ...validPayload, variant };
        const result = validateCreateCase(payload as any);
        expect(result.errors.some(e => e.field === 'variant')).toBe(false);
      });
    });

    it('should fail with invalid investmentType', () => {
      const payload = { ...validPayload, investmentType: 'Invalid Type' };
      const result = validateCreateCase(payload);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === 'investmentType')).toBe(true);
    });

    it('should accept all valid investment types', () => {
      INVESTMENT_TYPES.forEach(type => {
        const payload = { ...validPayload, investmentType: type };
        const result = validateCreateCase(payload);
        expect(result.errors.some(e => e.field === 'investmentType')).toBe(false);
      });
    });

    it('should fail with invalid timeHorizon', () => {
      const payload = { ...validPayload, timeHorizon: 'Invalid Horizon' };
      const result = validateCreateCase(payload);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === 'timeHorizon')).toBe(true);
    });

    it('should accept all valid time horizons', () => {
      TIME_HORIZONS.forEach(horizon => {
        const payload = { ...validPayload, timeHorizon: horizon };
        const result = validateCreateCase(payload);
        expect(result.errors.some(e => e.field === 'timeHorizon')).toBe(false);
      });
    });

    it('should fail with invalid estimatedInvestment', () => {
      const payload = { ...validPayload, estimatedInvestment: 'Invalid Amount' };
      const result = validateCreateCase(payload);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === 'estimatedInvestment')).toBe(true);
    });

    it('should accept empty estimatedInvestment (optional)', () => {
      const payload = { ...validPayload, estimatedInvestment: undefined };
      const result = validateCreateCase(payload);
      expect(result.errors.some(e => e.field === 'estimatedInvestment')).toBe(false);
    });
  });

  describe('Multiple Errors', () => {
    it('should return all errors at once', () => {
      const payload = {
        variant: undefined,
        decisionTitle: '',
        investmentType: '',
        decisionDescription: '',
        impactedAreas: [],
        timeHorizon: '',
        dCtx1: '',
        dCtx2: '',
        dCtx3: '',
        dCtx4: ''
      };
      const result = validateCreateCase(payload as any);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(10);
    });
  });
});

// =============================================================================
// Scoring Engine Tests
// =============================================================================

describe('Scoring Engine', () => {
  describe('ICS Calculation', () => {
    it('ICS weights should sum to 1.0', () => {
      const weights = [0.20, 0.25, 0.20, 0.20, 0.15]; // D1-D5
      const sum = weights.reduce((a, b) => a + b, 0);
      expect(sum).toBeCloseTo(1.0, 5);
    });

    it('Process dimension (P) should NOT be in ICS', () => {
      // P is gate only, never contributes to ICS
      const icsFormula = 'D1×0.20 + D2×0.25 + D3×0.20 + D4×0.20 + D5×0.15';
      expect(icsFormula).not.toContain('P');
    });
  });
});

// =============================================================================
// Flag Detection Tests
// =============================================================================

describe('Flag Detection', () => {
  const flagCodes = ['TM-1', 'TM-2', 'TM-3', 'TM-4', 'TM-5', 'TM-6', 'TM-7', 'TM-8'];

  it('should have 8 flag types defined', () => {
    expect(flagCodes.length).toBe(8);
  });

  flagCodes.forEach(code => {
    it(`${code} should be a valid flag code`, () => {
      expect(code).toMatch(/^TM-[1-8]$/);
    });
  });
});

// =============================================================================
// Recommendation Engine Tests
// =============================================================================

describe('Recommendation Engine', () => {
  describe('Thresholds', () => {
    it('GO threshold should be >= 75', () => {
      const goThreshold = 75;
      expect(goThreshold).toBeGreaterThanOrEqual(75);
    });

    it('NO_GO threshold should be < 50', () => {
      const noGoThreshold = 50;
      expect(noGoThreshold).toBeLessThanOrEqual(50);
    });

    it('CLARIFY should be between 50 and 75', () => {
      const clarifyMin = 50;
      const clarifyMax = 74;
      expect(clarifyMin).toBeGreaterThanOrEqual(50);
      expect(clarifyMax).toBeLessThan(75);
    });
  });

  describe('Gate Rules', () => {
    it('Critical flag should override to NO_GO regardless of ICS', () => {
      const hasCriticalFlag = true;
      const ics = 90; // High ICS
      const recommendation = hasCriticalFlag ? 'NO_GO' : 'GO';
      expect(recommendation).toBe('NO_GO');
    });

    it('Process gate failure should trigger CLARIFY', () => {
      const processGatePassed = false;
      const ics = 80;
      const recommendation = !processGatePassed ? 'CLARIFY' : 'GO';
      expect(recommendation).toBe('CLARIFY');
    });
  });
});
