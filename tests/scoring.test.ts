/**
 * Scoring Engine Tests
 * 
 * Tests for BLOCKER acceptance criteria:
 * - AC-SCORE-01: Likert normalisation
 * - AC-SCORE-02: Reverse scoring (raw=1 → adj=5 → score=100)
 * - AC-SCORE-06: ICS formula (D1*0.20 + D2*0.25 + D3*0.20 + D4*0.20 + D5*0.15)
 * - AC-SCORE-07: Weight coefficients (Quick=100, Core=50/25/25, Full=40/20/20/20)
 */

import { describe, it, expect } from 'vitest';
import { normalise, averageOf } from '../src/lib/scoring/normalise';
import { computeIcs, ICS_WEIGHTS } from '../src/lib/scoring/ics';
import { CaseDimensionScores } from '../src/lib/scoring/dimensions';
import { VARIANT_CONFIG } from '../src/lib/variants/config';

describe('Scoring - Normalization (AC-SCORE-01, AC-SCORE-02)', () => {
  // TC-SCORE-01: is_reverse=true, raw_value=2 → adjusted=4, likert_0_100=75
  it('TC-SCORE-01: reverse scoring raw=2 gives adjusted=4, score=75', () => {
    const result = normalise(2, true);
    
    expect(result.raw).toBe(2);
    expect(result.adjusted).toBe(4); // 6 - 2 = 4
    expect(result.score_0_100).toBe(75); // (4-1)*25 = 75
    expect(result.is_reverse).toBe(true);
  });
  
  it('normal scoring raw=5 gives adjusted=5, score=100', () => {
    const result = normalise(5, false);
    
    expect(result.adjusted).toBe(5);
    expect(result.score_0_100).toBe(100); // (5-1)*25 = 100
  });
  
  it('normal scoring raw=1 gives adjusted=1, score=0', () => {
    const result = normalise(1, false);
    
    expect(result.adjusted).toBe(1);
    expect(result.score_0_100).toBe(0); // (1-1)*25 = 0
  });
  
  it('reverse scoring raw=5 gives adjusted=1, score=0', () => {
    const result = normalise(5, true);
    
    expect(result.adjusted).toBe(1); // 6 - 5 = 1
    expect(result.score_0_100).toBe(0); // (1-1)*25 = 0
  });
  
  it('reverse scoring raw=1 gives adjusted=5, score=100', () => {
    const result = normalise(1, true);
    
    expect(result.adjusted).toBe(5); // 6 - 1 = 5
    expect(result.score_0_100).toBe(100); // (5-1)*25 = 100
  });
  
  it('throws for invalid Likert values', () => {
    expect(() => normalise(0, false)).toThrow();
    expect(() => normalise(6, false)).toThrow();
    expect(() => normalise(3.5, false)).toThrow();
  });
});

describe('Scoring - ICS Formula (AC-SCORE-06)', () => {
  it('ICS weights are correct', () => {
    expect(ICS_WEIGHTS.D1).toBe(0.20);
    expect(ICS_WEIGHTS.D2).toBe(0.25);
    expect(ICS_WEIGHTS.D3).toBe(0.20);
    expect(ICS_WEIGHTS.D4).toBe(0.20);
    expect(ICS_WEIGHTS.D5).toBe(0.15);
    
    // Weights must sum to 1.0
    const sum = ICS_WEIGHTS.D1 + ICS_WEIGHTS.D2 + ICS_WEIGHTS.D3 + ICS_WEIGHTS.D4 + ICS_WEIGHTS.D5;
    expect(sum).toBe(1.0);
  });
  
  // TC-SCORE-02: Quick Check ICS calculation
  it('TC-SCORE-02: Quick Check ICS = 80*0.20+60*0.25+70*0.20+50*0.20+40*0.15 = 63.0', () => {
    const dimScores: CaseDimensionScores = {
      D1: 80,
      D2: 60,
      D3: 70,
      D4: 50,
      D5: 40,
      P: null
    };
    
    const result = computeIcs(dimScores, 'QUICK_CHECK');
    
    // 80*0.20 + 60*0.25 + 70*0.20 + 50*0.20 + 40*0.15
    // = 16 + 15 + 14 + 10 + 6 = 61
    const expected = 80 * 0.20 + 60 * 0.25 + 70 * 0.20 + 50 * 0.20 + 40 * 0.15;
    
    expect(result.ics).toBe(expected);
    expect(result.computed).toBe(true);
  });
  
  it('Process dimension (P) never enters ICS formula', () => {
    const dimScores: CaseDimensionScores = {
      D1: 80,
      D2: 80,
      D3: 80,
      D4: 80,
      D5: 80,
      P: 100 // This should NOT affect ICS
    };
    
    const result = computeIcs(dimScores, 'FULL');
    
    // ICS should be 80 (all dims at 80)
    expect(result.ics).toBe(80);
    
    // P should not be in breakdown contributions
    expect(result.breakdown.D1.contribution).toBe(80 * 0.20);
    expect(result.breakdown.D2.contribution).toBe(80 * 0.25);
  });
  
  it('PROCESS_STANDALONE does not compute ICS', () => {
    const dimScores: CaseDimensionScores = {
      D1: null,
      D2: null,
      D3: null,
      D4: null,
      D5: null,
      P: 75
    };
    
    const result = computeIcs(dimScores, 'PROCESS_STANDALONE');
    
    expect(result.ics).toBeNull();
    expect(result.computed).toBe(false);
  });
});

describe('Scoring - Variant Weights (AC-SCORE-07)', () => {
  it('Quick Check: Exec 100%', () => {
    const config = VARIANT_CONFIG.QUICK_CHECK;
    
    expect(config.weights.EXEC).toBe(1.0);
    expect(config.activeRoles).toEqual(['EXEC']);
    expect(config.computeIcs).toBe(true);
  });
  
  it('Core: Exec 50%, Business 25%, Tech 25%', () => {
    const config = VARIANT_CONFIG.CORE;
    
    expect(config.weights.EXEC).toBe(0.50);
    expect(config.weights.BUSINESS_OWNER).toBe(0.25);
    expect(config.weights.TECH_OWNER).toBe(0.25);
    expect(config.activeRoles).toContain('EXEC');
    expect(config.activeRoles).toContain('BUSINESS_OWNER');
    expect(config.activeRoles).toContain('TECH_OWNER');
  });
  
  it('Full: Exec 40%, Business 20%, Tech 20%, Process 20%', () => {
    const config = VARIANT_CONFIG.FULL;
    
    expect(config.weights.EXEC).toBe(0.40);
    expect(config.weights.BUSINESS_OWNER).toBe(0.20);
    expect(config.weights.TECH_OWNER).toBe(0.20);
    expect(config.weights.PROCESS_OWNER).toBe(0.20);
    expect(config.processIsGate).toBe(true);
  });
  
  it('Process Standalone: Process Owner 100%, no ICS', () => {
    const config = VARIANT_CONFIG.PROCESS_STANDALONE;
    
    expect(config.weights.PROCESS_OWNER).toBe(1.0);
    expect(config.computeIcs).toBe(false);
    expect(config.activeRoles).toEqual(['PROCESS_OWNER']);
  });
});

describe('Scoring - Edge Cases', () => {
  it('averageOf returns null for empty array', () => {
    expect(averageOf([])).toBeNull();
  });
  
  it('averageOf calculates correctly', () => {
    expect(averageOf([60, 80, 100])).toBe(80);
    expect(averageOf([50])).toBe(50);
  });
  
  it('ICS returns null when no dimension data', () => {
    const dimScores: CaseDimensionScores = {
      D1: null,
      D2: null,
      D3: null,
      D4: null,
      D5: null,
      P: null
    };
    
    const result = computeIcs(dimScores, 'CORE');
    
    expect(result.ics).toBeNull();
  });
});
