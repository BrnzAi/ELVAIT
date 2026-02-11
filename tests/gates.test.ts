/**
 * Gates and Recommendation Tests
 * 
 * Tests for TC-GATE-01 through TC-GATE-06
 */

import { describe, it, expect } from 'vitest';
import { evaluateG1, evaluateG2, evaluateAllGates } from '../src/lib/gates/rules';
import { computeRecommendation } from '../src/lib/recommendation/engine';
import { CaseDimensionScores } from '../src/lib/scoring/dimensions';
import { IcsResult } from '../src/lib/scoring/ics';
import { FlagEngineResult } from '../src/lib/flags/engine';
import { GateEvaluationResult } from '../src/lib/gates/rules';

// Helper to create mock ICS result
function mockIcsResult(ics: number | null): IcsResult {
  return {
    ics,
    label: ics !== null ? (ics >= 75 ? 'High clarity' : ics >= 55 ? 'Partial clarity' : 'Low clarity') : null,
    labelShort: null,
    computed: ics !== null,
    breakdown: {
      D1: { score: null, weight: 0.20, contribution: null },
      D2: { score: null, weight: 0.25, contribution: null },
      D3: { score: null, weight: 0.20, contribution: null },
      D4: { score: null, weight: 0.20, contribution: null },
      D5: { score: null, weight: 0.15, contribution: null }
    }
  };
}

// Helper to create mock flag result
function mockFlagResult(hasCritical: boolean = false, criticalFlagId?: string): FlagEngineResult {
  const flags = hasCritical && criticalFlagId ? [
    { flag_id: criticalFlagId, severity: 'CRITICAL' as const, evidence: { question_ids: [], raw_values: {} } }
  ] : [];
  
  return {
    flags,
    openTextClassifications: [],
    counts: { critical: hasCritical ? 1 : 0, warn: 0, info: 0, total: flags.length },
    hasCritical,
    flagIds: new Set(flags.map(f => f.flag_id))
  };
}

// Helper to create mock gate result
function mockGateResult(hasGates: boolean = false): GateEvaluationResult {
  return {
    gates: [],
    hasGates,
    gateIds: new Set()
  };
}

describe('Gates - G1 Dimension Floor (TC-GATE-01, TC-GATE-02)', () => {
  // TC-GATE-01: ICS=82, no CRITICAL flags, no gates → GO
  it('TC-GATE-01: ICS=82 with no flags and no gates → GO', () => {
    const dimScores: CaseDimensionScores = {
      D1: 80, D2: 85, D3: 80, D4: 80, D5: 85, P: null
    };
    
    const icsResult = mockIcsResult(82);
    const flagResult = mockFlagResult(false);
    const gateResult = mockGateResult(false);
    
    const result = computeRecommendation(icsResult, flagResult, gateResult, 'CORE');
    
    expect(result.recommendation).toBe('GO');
  });
  
  // TC-GATE-02: ICS=82, no CRITICAL flags, D3=48 → G1 triggers → CLARIFY (not GO)
  it('TC-GATE-02: ICS=82 but D3=48 triggers G1 → CLARIFY', () => {
    const dimScores: CaseDimensionScores = {
      D1: 80, D2: 85, D3: 48, D4: 80, D5: 85, P: null
    };
    
    // G1 should trigger
    const g1Gates = evaluateG1(dimScores);
    expect(g1Gates.length).toBeGreaterThan(0);
    expect(g1Gates[0].gate).toBe('G1');
    expect(g1Gates[0].flag).toContain('LOW_DIMENSION_SCORE');
    
    // Full recommendation with gate
    const icsResult = mockIcsResult(82);
    const flagResult = mockFlagResult(false);
    const gateResult: GateEvaluationResult = {
      gates: g1Gates,
      hasGates: true,
      gateIds: new Set(['G1'])
    };
    
    const result = computeRecommendation(icsResult, flagResult, gateResult, 'CORE');
    
    expect(result.recommendation).toBe('CLARIFY');
    expect(result.primaryFactor).toBe('GATE_TRIGGERED');
  });
});

describe('Gates - G2 Process Readiness (TC-GATE-05)', () => {
  // TC-GATE-05: ICS=80, Full Kit, process_score=44 → G2 triggers → CLARIFY
  it('TC-GATE-05: Full Kit with process_score=44 triggers G2 → CLARIFY', () => {
    const dimScores: CaseDimensionScores = {
      D1: 80, D2: 80, D3: 80, D4: 80, D5: 80, P: 44
    };
    
    // G2 should trigger for FULL variant
    const g2Gates = evaluateG2(dimScores, 'FULL');
    expect(g2Gates.length).toBe(1);
    expect(g2Gates[0].gate).toBe('G2');
    expect(g2Gates[0].flag).toBe('AUTOMATION_PREMATURITY');
    
    // G2 should NOT trigger for CORE variant
    const g2GatesCore = evaluateG2(dimScores, 'CORE');
    expect(g2GatesCore.length).toBe(0);
  });
});

describe('Recommendation - ICS Thresholds (TC-GATE-03)', () => {
  // TC-GATE-03: ICS=42 → NO_GO
  it('TC-GATE-03: ICS=42 → NO_GO', () => {
    const icsResult = mockIcsResult(42);
    const flagResult = mockFlagResult(false);
    const gateResult = mockGateResult(false);
    
    const result = computeRecommendation(icsResult, flagResult, gateResult, 'CORE');
    
    expect(result.recommendation).toBe('NO_GO');
    expect(result.primaryFactor).toBe('ICS_LOW');
  });
  
  it('ICS=55 → CLARIFY (edge of range)', () => {
    const icsResult = mockIcsResult(55);
    const flagResult = mockFlagResult(false);
    const gateResult = mockGateResult(false);
    
    const result = computeRecommendation(icsResult, flagResult, gateResult, 'CORE');
    
    expect(result.recommendation).toBe('CLARIFY');
  });
  
  it('ICS=74 → CLARIFY', () => {
    const icsResult = mockIcsResult(74);
    const flagResult = mockFlagResult(false);
    const gateResult = mockGateResult(false);
    
    const result = computeRecommendation(icsResult, flagResult, gateResult, 'CORE');
    
    expect(result.recommendation).toBe('CLARIFY');
  });
  
  it('ICS=75 → GO (threshold)', () => {
    const icsResult = mockIcsResult(75);
    const flagResult = mockFlagResult(false);
    const gateResult = mockGateResult(false);
    
    const result = computeRecommendation(icsResult, flagResult, gateResult, 'CORE');
    
    expect(result.recommendation).toBe('GO');
  });
});

describe('Recommendation - CRITICAL Flag Override (TC-GATE-04)', () => {
  // TC-GATE-04: ICS=60 + NARRATIVE_INFLATION_RISK CRITICAL → NO_GO
  it('TC-GATE-04: CRITICAL flag overrides ICS → NO_GO', () => {
    const icsResult = mockIcsResult(60);
    const flagResult = mockFlagResult(true, 'NARRATIVE_INFLATION_RISK');
    const gateResult = mockGateResult(false);
    
    const result = computeRecommendation(icsResult, flagResult, gateResult, 'CORE');
    
    expect(result.recommendation).toBe('NO_GO');
    expect(result.primaryFactor).toBe('CRITICAL_FLAG');
  });
  
  it('High ICS (78) + CRITICAL flag → NO_GO (not GO)', () => {
    const icsResult = mockIcsResult(78);
    const flagResult = mockFlagResult(true, 'OWNERSHIP_DIFFUSION');
    const gateResult = mockGateResult(false);
    
    const result = computeRecommendation(icsResult, flagResult, gateResult, 'CORE');
    
    expect(result.recommendation).toBe('NO_GO');
    expect(result.primaryFactor).toBe('CRITICAL_FLAG');
  });
});

describe('Recommendation - G4 Ownership Diffusion (TC-GATE-06)', () => {
  // TC-GATE-06: OWNERSHIP_DIFFUSION CRITICAL + ICS=78 → minimum CLARIFY
  it('TC-GATE-06: OWNERSHIP_DIFFUSION triggers G4 → minimum CLARIFY', () => {
    const flagResult: FlagEngineResult = {
      flags: [{ 
        flag_id: 'OWNERSHIP_DIFFUSION', 
        severity: 'CRITICAL', 
        evidence: { question_ids: [], raw_values: {} } 
      }],
      openTextClassifications: [],
      counts: { critical: 1, warn: 0, info: 0, total: 1 },
      hasCritical: true,
      flagIds: new Set(['OWNERSHIP_DIFFUSION'])
    };
    
    const dimScores: CaseDimensionScores = {
      D1: 80, D2: 80, D3: 80, D4: 80, D5: 80, P: null
    };
    
    const gateResult = evaluateAllGates({
      caseDimScores: dimScores,
      variant: 'CORE',
      flagResult
    });
    
    // G4 should be triggered
    expect(gateResult.hasGates).toBe(true);
    expect(gateResult.gateIds.has('G4')).toBe(true);
  });
});

describe('Recommendation - AI Never Overrides', () => {
  it('aiCanOverride is always false', () => {
    const icsResult = mockIcsResult(80);
    const flagResult = mockFlagResult(false);
    const gateResult = mockGateResult(false);
    
    const result = computeRecommendation(icsResult, flagResult, gateResult, 'CORE');
    
    expect(result.aiCanOverride).toBe(false);
  });
});
