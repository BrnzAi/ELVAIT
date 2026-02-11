/**
 * Flag Engine Tests
 * 
 * Tests for CRITICAL acceptance criteria from TC-FLAG-01 through TC-FLAG-10
 */

import { describe, it, expect } from 'vitest';
import { detectTm1Flags, AnswerLookup } from '../src/lib/flags/tm1';
import detectAllTm2Flags from '../src/lib/flags/tm2';
import detectTm3Flags from '../src/lib/flags/tm3';
import detectAllTm4Flags from '../src/lib/flags/tm4';
import detectTm5Flags from '../src/lib/flags/tm5';
import detectTm6Flags from '../src/lib/flags/tm6';
import detectTm7Flags from '../src/lib/flags/tm7';
import { runFlagEngineSync } from '../src/lib/flags/engine';

describe('Flags - TM-2 Triads (TC-FLAG-01, TC-FLAG-02)', () => {
  // TC-FLAG-01: B1=5, B2="Assumptions only", B3="Continue anyway" → NARRATIVE_INFLATION_RISK: CRITICAL
  it('TC-FLAG-01: NARRATIVE_INFLATION_RISK when B1>=4, B2=Assumptions, B3=Continue', () => {
    const answers: AnswerLookup = {
      'B1': { rawValue: 5, participantId: 'p1', role: 'BUSINESS_OWNER' },
      'B2': { rawValue: 'Assumptions only', participantId: 'p1', role: 'BUSINESS_OWNER' },
      'B3': { rawValue: 'The initiative will continue anyway', participantId: 'p1', role: 'BUSINESS_OWNER' }
    };
    
    const flags = detectAllTm2Flags(answers);
    
    const narrativeFlag = flags.find(f => f.flag_id === 'NARRATIVE_INFLATION_RISK');
    expect(narrativeFlag).toBeDefined();
    expect(narrativeFlag?.severity).toBe('CRITICAL');
  });
  
  // TC-FLAG-02: B1=5, B2="Assumptions only", B3="Scope will be reduced" → PROOF_GAP: WARN (not CRITICAL)
  it('TC-FLAG-02: PROOF_GAP (WARN) when B1>=4, B2=Assumptions, B3=owned consequence', () => {
    const answers: AnswerLookup = {
      'B1': { rawValue: 5, participantId: 'p1', role: 'BUSINESS_OWNER' },
      'B2': { rawValue: 'Assumptions only', participantId: 'p1', role: 'BUSINESS_OWNER' },
      'B3': { rawValue: 'The scope will be reduced', participantId: 'p1', role: 'BUSINESS_OWNER' }
    };
    
    const flags = detectAllTm2Flags(answers);
    
    const proofGap = flags.find(f => f.flag_id === 'PROOF_GAP');
    expect(proofGap).toBeDefined();
    expect(proofGap?.severity).toBe('WARN');
    
    // Should NOT have NARRATIVE_INFLATION_RISK
    const narrativeFlag = flags.find(f => f.flag_id === 'NARRATIVE_INFLATION_RISK');
    expect(narrativeFlag).toBeUndefined();
  });
});

describe('Flags - TM-4 Cross-Role (TC-FLAG-03)', () => {
  // TC-FLAG-03: E17(adj)=4.5, T1(adj)=1.5 (gap=3.0) → CROSS_ROLE_MISMATCH: CRITICAL (DATA_READINESS)
  it('TC-FLAG-03: CROSS_ROLE_MISMATCH CRITICAL for DATA_READINESS with gap >= 1.2', () => {
    // E17 is data readiness from EXEC, T1 is data readiness from TECH
    // Both are Likert, non-reversed
    const answers: AnswerLookup = {
      'E17': { rawValue: 5, participantId: 'exec1', role: 'EXEC' }, // adj=5, score=100
      'T1': { rawValue: 2, participantId: 'tech1', role: 'TECH_OWNER' } // adj=2, score=25
    };
    
    const flags = detectAllTm4Flags(answers);
    
    const mismatch = flags.find(f => 
      f.flag_id === 'CROSS_ROLE_MISMATCH' && 
      f.evidence.group === 'DATA_READINESS'
    );
    
    expect(mismatch).toBeDefined();
    expect(mismatch?.severity).toBe('CRITICAL');
  });
});

describe('Flags - TM-5 Ownership (TC-FLAG-04)', () => {
  // TC-FLAG-04: E12=Business Owner, B4=IT Team, T10=Not defined → OWNERSHIP_DIFFUSION: CRITICAL
  it('TC-FLAG-04: OWNERSHIP_DIFFUSION CRITICAL with 3 unique answers', () => {
    const answers: AnswerLookup = {
      'E12': { rawValue: 'Business Owner', participantId: 'exec1', role: 'EXEC' },
      'B4': { rawValue: 'IT / Technical Team', participantId: 'biz1', role: 'BUSINESS_OWNER' },
      'T10': { rawValue: 'Not clearly defined', participantId: 'tech1', role: 'TECH_OWNER' }
    };
    
    const flags = detectTm5Flags(answers);
    
    const diffusion = flags.find(f => f.flag_id === 'OWNERSHIP_DIFFUSION');
    expect(diffusion).toBeDefined();
    expect(diffusion?.severity).toBe('CRITICAL');
  });
  
  it('OWNERSHIP_DIFFUSION triggers on "Not clearly defined" even with 2 unique', () => {
    const answers: AnswerLookup = {
      'E12': { rawValue: 'Business Owner', participantId: 'exec1', role: 'EXEC' },
      'B4': { rawValue: 'Not clearly defined', participantId: 'biz1', role: 'BUSINESS_OWNER' }
    };
    
    const flags = detectTm5Flags(answers);
    
    const diffusion = flags.find(f => f.flag_id === 'OWNERSHIP_DIFFUSION');
    expect(diffusion).toBeDefined();
    expect(diffusion?.severity).toBe('CRITICAL');
  });
});

describe('Flags - TM-6 Capacity Illusion (TC-FLAG-05, TC-FLAG-06)', () => {
  // TC-FLAG-05: B9="Nothing deprioritized", T6="Nothing critical" → CAPACITY_ILLUSION_CONFIRMED: CRITICAL
  it('TC-FLAG-05: CAPACITY_ILLUSION_CONFIRMED when both Business and Tech say Nothing', () => {
    const answers: AnswerLookup = {
      'B9': { rawValue: 'Nothing will be deprioritized', participantId: 'biz1', role: 'BUSINESS_OWNER' },
      'T6': { rawValue: 'Nothing critical will be impacted', participantId: 'tech1', role: 'TECH_OWNER' }
    };
    
    const flags = detectTm6Flags(answers);
    
    const confirmed = flags.find(f => f.flag_id === 'CAPACITY_ILLUSION_CONFIRMED');
    expect(confirmed).toBeDefined();
    expect(confirmed?.severity).toBe('CRITICAL');
  });
  
  // TC-FLAG-06: B9="Nothing", T6="Teams will be overloaded" → CAPACITY_ILLUSION_BUSINESS: WARN (not CONFIRMED)
  it('TC-FLAG-06: Only CAPACITY_ILLUSION_BUSINESS when only Business says Nothing', () => {
    const answers: AnswerLookup = {
      'B9': { rawValue: 'Nothing will be deprioritized', participantId: 'biz1', role: 'BUSINESS_OWNER' },
      'T6': { rawValue: 'Teams will be overloaded', participantId: 'tech1', role: 'TECH_OWNER' }
    };
    
    const flags = detectTm6Flags(answers);
    
    const businessIllusion = flags.find(f => f.flag_id === 'CAPACITY_ILLUSION_BUSINESS');
    expect(businessIllusion).toBeDefined();
    expect(businessIllusion?.severity).toBe('WARN');
    
    // Should NOT have CONFIRMED
    const confirmed = flags.find(f => f.flag_id === 'CAPACITY_ILLUSION_CONFIRMED');
    expect(confirmed).toBeUndefined();
  });
});

describe('Flags - TM-3 Overconfidence (TC-FLAG-07)', () => {
  // TC-FLAG-07: E24=5, B2="No documentation" (evidence=1) → OVERCONFIDENCE: CRITICAL
  it('TC-FLAG-07: OVERCONFIDENCE CRITICAL when confidence>=4 and evidence=1', () => {
    const answers: AnswerLookup = {
      'E24': { rawValue: 5, participantId: 'exec1', role: 'EXEC' },
      'B2': { rawValue: 'No formal documentation', participantId: 'biz1', role: 'BUSINESS_OWNER' }
    };
    
    const flags = detectTm3Flags(answers);
    
    const overconfidence = flags.find(f => f.flag_id === 'OVERCONFIDENCE');
    expect(overconfidence).toBeDefined();
    expect(overconfidence?.severity).toBe('CRITICAL');
  });
  
  it('OVERCONFIDENCE WARN when confidence>=4 and evidence=2', () => {
    const answers: AnswerLookup = {
      'E24': { rawValue: 4, participantId: 'exec1', role: 'EXEC' },
      'B2': { rawValue: 'Assumptions only', participantId: 'biz1', role: 'BUSINESS_OWNER' }
    };
    
    const flags = detectTm3Flags(answers);
    
    const overconfidence = flags.find(f => f.flag_id === 'OVERCONFIDENCE');
    expect(overconfidence).toBeDefined();
    expect(overconfidence?.severity).toBe('WARN');
  });
});

describe('Flags - TM-7 Complexity Denial (TC-FLAG-08)', () => {
  // TC-FLAG-08: B10=5, B11=5 → COMPLEXITY_DENIAL: WARN
  it('TC-FLAG-08: COMPLEXITY_DENIAL when both early and late questions >= 4', () => {
    const answers: AnswerLookup = {
      'B10': { rawValue: 5, participantId: 'biz1', role: 'BUSINESS_OWNER' },
      'B11': { rawValue: 5, participantId: 'biz1', role: 'BUSINESS_OWNER' }
    };
    
    const flags = detectTm7Flags(answers);
    
    const denial = flags.find(f => f.flag_id === 'COMPLEXITY_DENIAL');
    expect(denial).toBeDefined();
    expect(denial?.severity).toBe('WARN');
  });
});

describe('Flags - TM-1 Reversed Logic (TC-FLAG-09)', () => {
  // TC-FLAG-09: E6(reversed,raw=5) → adjusted=1; E1(adj)=4 → Flag does NOT trigger
  it('TC-FLAG-09: No contradiction when reversed question has low adjusted score', () => {
    const answers: AnswerLookup = {
      'E1': { rawValue: 4, participantId: 'exec1', role: 'EXEC' }, // adj=4
      'E6': { rawValue: 5, participantId: 'exec1', role: 'EXEC' }  // is_reverse=true, adj=6-5=1
    };
    
    const flags = detectTm1Flags(answers);
    
    // Should NOT trigger because E6 adjusted=1 (not >= 4)
    const contradiction = flags.find(f => f.flag_id === 'WITHIN_ROLE_CONTRADICTION');
    expect(contradiction).toBeUndefined();
  });
  
  it('WITHIN_ROLE_CONTRADICTION when both adjusted scores >= 4', () => {
    const answers: AnswerLookup = {
      'E1': { rawValue: 4, participantId: 'exec1', role: 'EXEC' }, // adj=4
      'E6': { rawValue: 2, participantId: 'exec1', role: 'EXEC' }  // is_reverse=true, adj=6-2=4
    };
    
    const flags = detectTm1Flags(answers);
    
    const contradiction = flags.find(f => f.flag_id === 'WITHIN_ROLE_CONTRADICTION');
    expect(contradiction).toBeDefined();
    expect(contradiction?.severity).toBe('WARN');
  });
});

describe('Flags - Flag Engine Integration', () => {
  it('Engine sorts flags by severity (CRITICAL first)', () => {
    const answers: AnswerLookup = {
      // This should trigger OWNERSHIP_DIFFUSION (CRITICAL)
      'E12': { rawValue: 'Business Owner', participantId: 'exec1', role: 'EXEC' },
      'B4': { rawValue: 'IT / Technical Team', participantId: 'biz1', role: 'BUSINESS_OWNER' },
      'T10': { rawValue: 'Not clearly defined', participantId: 'tech1', role: 'TECH_OWNER' },
      // This should trigger COMPLEXITY_DENIAL (WARN)
      'B10': { rawValue: 5, participantId: 'biz1', role: 'BUSINESS_OWNER' },
      'B11': { rawValue: 5, participantId: 'biz1', role: 'BUSINESS_OWNER' }
    };
    
    const result = runFlagEngineSync(answers);
    
    expect(result.hasCritical).toBe(true);
    expect(result.counts.critical).toBeGreaterThan(0);
    
    // First flag should be CRITICAL
    if (result.flags.length > 0) {
      expect(result.flags[0].severity).toBe('CRITICAL');
    }
  });
});
