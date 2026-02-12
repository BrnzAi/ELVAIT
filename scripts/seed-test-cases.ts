/**
 * Test Cases Seed Data
 * 
 * All possible scenarios based on PRD and Acceptance Criteria
 * Run with: npx ts-node prisma/seed-test-cases.ts
 */

import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

// =============================================================================
// TEST CASE DEFINITIONS
// =============================================================================

interface TestCase {
  name: string;
  description: string;
  variant: 'QUICK_CHECK' | 'CORE' | 'FULL' | 'PROCESS_STANDALONE';
  expectedRecommendation: 'GO' | 'CLARIFY' | 'NO_GO' | null;
  expectedIcsRange?: [number, number];
  expectedFlags: string[];
  expectedGates: string[];
  context: {
    decisionTitle: string;
    investmentType: string;
    decisionDescription: string;
    timeHorizon: string;
    dCtx1: string;
    dCtx2: string;
    dCtx3: string;
    dCtx4: string;
  };
  participants: {
    role: string;
    name: string;
    responses: Record<string, number | string>;
  }[];
}

const TEST_CASES: TestCase[] = [
  // ==========================================================================
  // SCENARIO 1: PERFECT GO - High alignment, no flags
  // ==========================================================================
  {
    name: 'Perfect GO - Full Alignment',
    description: 'All roles aligned, high scores, no contradictions → GO',
    variant: 'CORE',
    expectedRecommendation: 'GO',
    expectedIcsRange: [75, 100],
    expectedFlags: [],
    expectedGates: [],
    context: {
      decisionTitle: 'Customer Service AI Automation',
      investmentType: 'AI solution / automation',
      decisionDescription: 'Implement AI-powered chatbot for tier-1 customer support inquiries',
      timeHorizon: '3-6 months',
      dCtx1: 'Whether to invest €200k in AI chatbot for customer service',
      dCtx2: '40% reduction in tier-1 support tickets, faster response times',
      dCtx3: 'Continue manual handling, increasing costs by 15% annually',
      dCtx4: 'If customers reject AI interactions or accuracy is below 85%',
    },
    participants: [
      {
        role: 'EXEC',
        name: 'CEO Test',
        responses: {
          E1: 5, E2: 5, E3: 5, E4: 5, E5: 5,  // D1 - Strategic Intent
          E6: 5, E7: 5, E8: 5,                 // D2 - Value
          E9: 5, E10: 5, E11: 4,               // D3 - Readiness
          E13: 4, E14: 4, E15: 4,              // D4 - Risk
          E16: 5, E17: 5,                      // D5 - Governance
          E12: 'Executive sponsor',            // Ownership
        }
      },
      {
        role: 'BUSINESS_OWNER',
        name: 'Business Lead Test',
        responses: {
          B1: 5, B5: 5, B6: 5, B7: 5,          // D2 - Value
          B2: 'A documented financial baseline',
          B3: 'KPIs tracked, owner assigned',
          B8: 4, B9: 'Lower priority projects', // D3
          B4: 'Executive sponsor',              // Ownership
          B10: 4, B11: 2,                       // Time pair - consistent
        }
      },
      {
        role: 'TECH_OWNER',
        name: 'Tech Lead Test',
        responses: {
          T1: 5, T2: 5, T3: 5, T4: 5,          // D1 & D3
          T5: 4, T6: 'Lower priority initiatives', // D3 - trade-off
          T7: 4, T8: 4, T9: 4,                 // D4 - Risk
          T10: 'Executive sponsor',            // Ownership
          T11: 4, T12: 2,                      // Time pair - consistent
        }
      }
    ]
  },

  // ==========================================================================
  // SCENARIO 2: NO_GO - Critical Flag (Ownership Diffusion)
  // ==========================================================================
  {
    name: 'NO_GO - Ownership Diffusion',
    description: 'Three different ownership answers → CRITICAL flag → NO_GO',
    variant: 'CORE',
    expectedRecommendation: 'NO_GO',
    expectedIcsRange: [70, 85],
    expectedFlags: ['OWNERSHIP_DIFFUSION'],
    expectedGates: ['G4'],
    context: {
      decisionTitle: 'ERP System Modernization',
      investmentType: 'Software / digital tool',
      decisionDescription: 'Replace legacy ERP with cloud-based solution',
      timeHorizon: '>6 months',
      dCtx1: 'Whether to migrate from SAP R/3 to S/4HANA Cloud',
      dCtx2: 'Unified data model, real-time reporting, mobile access',
      dCtx3: 'Increasing maintenance costs, end of support in 2027',
      dCtx4: 'Data migration failures, user adoption resistance',
    },
    participants: [
      {
        role: 'EXEC',
        name: 'CFO Test',
        responses: {
          E1: 5, E2: 4, E3: 4, E4: 4, E5: 4,
          E6: 4, E7: 4, E8: 4,
          E9: 4, E10: 4, E11: 4,
          E13: 4, E14: 4, E15: 4,
          E16: 4, E17: 4,
          E12: 'Executive sponsor',  // Different from others
        }
      },
      {
        role: 'BUSINESS_OWNER',
        name: 'Operations Director',
        responses: {
          B1: 4, B5: 4, B6: 4, B7: 4,
          B2: 'A documented financial baseline',
          B3: 'KPIs tracked, owner assigned',
          B8: 4, B9: 'Lower priority projects',
          B4: 'Business unit leader',  // Different
          B10: 4, B11: 2,
        }
      },
      {
        role: 'TECH_OWNER',
        name: 'IT Director',
        responses: {
          T1: 4, T2: 4, T3: 4, T4: 4,
          T5: 4, T6: 'Lower priority initiatives',
          T7: 4, T8: 4, T9: 4,
          T10: 'Not clearly defined',  // Different - triggers flag
          T11: 4, T12: 2,
        }
      }
    ]
  },

  // ==========================================================================
  // SCENARIO 3: NO_GO - Low ICS Score
  // ==========================================================================
  {
    name: 'NO_GO - Low ICS (Below 55)',
    description: 'Overall poor scores across dimensions → ICS < 55 → NO_GO',
    variant: 'CORE',
    expectedRecommendation: 'NO_GO',
    expectedIcsRange: [30, 54],
    expectedFlags: [],
    expectedGates: ['G1'],
    context: {
      decisionTitle: 'Blockchain Supply Chain',
      investmentType: 'AI solution / automation',
      decisionDescription: 'Implement blockchain for supply chain tracking',
      timeHorizon: 'Immediate',
      dCtx1: 'Whether to implement blockchain for shipment tracking',
      dCtx2: 'Full visibility into supply chain, reduced fraud',
      dCtx3: 'Continue with current manual tracking system',
      dCtx4: 'If partners refuse to adopt or technology is immature',
    },
    participants: [
      {
        role: 'EXEC',
        name: 'CEO Skeptic',
        responses: {
          E1: 2, E2: 2, E3: 2, E4: 2, E5: 2,  // Low D1
          E6: 2, E7: 2, E8: 2,                 // Low D2
          E9: 2, E10: 2, E11: 2,               // Low D3
          E13: 2, E14: 2, E15: 2,              // Low D4
          E16: 2, E17: 2,                      // Low D5
          E12: 'Executive sponsor',
        }
      },
      {
        role: 'BUSINESS_OWNER',
        name: 'Business Skeptic',
        responses: {
          B1: 2, B5: 2, B6: 2, B7: 2,
          B2: 'No formal documentation',
          B3: 'Not defined',
          B8: 2, B9: 'Lower priority projects',
          B4: 'Executive sponsor',
          B10: 2, B11: 2,
        }
      },
      {
        role: 'TECH_OWNER',
        name: 'Tech Skeptic',
        responses: {
          T1: 2, T2: 2, T3: 2, T4: 2,
          T5: 2, T6: 'Lower priority initiatives',
          T7: 2, T8: 2, T9: 2,
          T10: 'Executive sponsor',
          T11: 2, T12: 2,
        }
      }
    ]
  },

  // ==========================================================================
  // SCENARIO 4: CLARIFY - Mid-range ICS
  // ==========================================================================
  {
    name: 'CLARIFY - Mid-range ICS (55-74)',
    description: 'Average scores → ICS in 55-74 range → CLARIFY',
    variant: 'CORE',
    expectedRecommendation: 'CLARIFY',
    expectedIcsRange: [55, 74],
    expectedFlags: [],
    expectedGates: [],
    context: {
      decisionTitle: 'Marketing Automation Platform',
      investmentType: 'Software / digital tool',
      decisionDescription: 'Implement marketing automation for lead nurturing',
      timeHorizon: '3-6 months',
      dCtx1: 'Whether to invest in HubSpot Marketing Hub',
      dCtx2: '30% increase in qualified leads, better attribution',
      dCtx3: 'Manual email campaigns, inconsistent follow-up',
      dCtx4: 'Low adoption by marketing team, poor integration',
    },
    participants: [
      {
        role: 'EXEC',
        name: 'CMO Test',
        responses: {
          E1: 3, E2: 3, E3: 4, E4: 3, E5: 3,
          E6: 3, E7: 3, E8: 4,
          E9: 3, E10: 3, E11: 3,
          E13: 3, E14: 3, E15: 3,
          E16: 3, E17: 4,
          E12: 'Executive sponsor',
        }
      },
      {
        role: 'BUSINESS_OWNER',
        name: 'Marketing Director',
        responses: {
          B1: 3, B5: 3, B6: 4, B7: 3,
          B2: 'Assumptions only',
          B3: 'KPIs tracked, owner assigned',
          B8: 3, B9: 'Lower priority projects',
          B4: 'Executive sponsor',
          B10: 3, B11: 3,
        }
      },
      {
        role: 'TECH_OWNER',
        name: 'MarTech Lead',
        responses: {
          T1: 3, T2: 4, T3: 3, T4: 3,
          T5: 3, T6: 'Lower priority initiatives',
          T7: 3, T8: 3, T9: 4,
          T10: 'Executive sponsor',
          T11: 3, T12: 3,
        }
      }
    ]
  },

  // ==========================================================================
  // SCENARIO 5: CLARIFY - Gate G1 (Low Dimension Score)
  // ==========================================================================
  {
    name: 'CLARIFY - Gate G1 Triggered',
    description: 'High ICS but D3 < 50 → Gate G1 → CLARIFY (not GO)',
    variant: 'CORE',
    expectedRecommendation: 'CLARIFY',
    expectedIcsRange: [75, 85],
    expectedFlags: [],
    expectedGates: ['G1'],
    context: {
      decisionTitle: 'Data Lake Implementation',
      investmentType: 'AI solution / automation',
      decisionDescription: 'Build centralized data lake for analytics',
      timeHorizon: '3-6 months',
      dCtx1: 'Whether to build a cloud data lake on AWS',
      dCtx2: 'Single source of truth, faster insights',
      dCtx3: 'Continued data silos, slow reporting',
      dCtx4: 'Data quality issues, security concerns',
    },
    participants: [
      {
        role: 'EXEC',
        name: 'CDO Test',
        responses: {
          E1: 5, E2: 5, E3: 5, E4: 5, E5: 5,  // High D1
          E6: 5, E7: 5, E8: 5,                 // High D2
          E9: 2, E10: 2, E11: 2,               // LOW D3 - triggers G1
          E13: 4, E14: 4, E15: 4,              // Good D4
          E16: 5, E17: 5,                      // High D5
          E12: 'Executive sponsor',
        }
      },
      {
        role: 'BUSINESS_OWNER',
        name: 'Analytics Lead',
        responses: {
          B1: 5, B5: 5, B6: 5, B7: 5,
          B2: 'A documented financial baseline',
          B3: 'KPIs tracked, owner assigned',
          B8: 2, B9: 'Lower priority projects',  // Low D3
          B4: 'Executive sponsor',
          B10: 4, B11: 2,
        }
      },
      {
        role: 'TECH_OWNER',
        name: 'Data Engineer Lead',
        responses: {
          T1: 5, T2: 5, T3: 5, T4: 2,          // Mixed
          T5: 2, T6: 'Lower priority initiatives',  // Low D3
          T7: 4, T8: 4, T9: 4,
          T10: 'Executive sponsor',
          T11: 4, T12: 2,
        }
      }
    ]
  },

  // ==========================================================================
  // SCENARIO 6: NO_GO - Narrative Inflation Risk (TM-2)
  // ==========================================================================
  {
    name: 'NO_GO - Narrative Inflation Risk',
    description: 'B1 high + B2 assumptions + B3 continue anyway → CRITICAL',
    variant: 'CORE',
    expectedRecommendation: 'NO_GO',
    expectedIcsRange: [65, 80],
    expectedFlags: ['NARRATIVE_INFLATION_RISK'],
    expectedGates: [],
    context: {
      decisionTitle: 'AI Sales Forecasting',
      investmentType: 'AI solution / automation',
      decisionDescription: 'ML-based sales prediction system',
      timeHorizon: '3-6 months',
      dCtx1: 'Whether to implement AI sales forecasting',
      dCtx2: '20% improvement in forecast accuracy',
      dCtx3: 'Continue with spreadsheet-based forecasts',
      dCtx4: 'If historical data quality is poor',
    },
    participants: [
      {
        role: 'EXEC',
        name: 'CRO Test',
        responses: {
          E1: 4, E2: 4, E3: 4, E4: 4, E5: 4,
          E6: 4, E7: 4, E8: 4,
          E9: 4, E10: 4, E11: 4,
          E13: 4, E14: 4, E15: 4,
          E16: 4, E17: 4,
          E12: 'Executive sponsor',
        }
      },
      {
        role: 'BUSINESS_OWNER',
        name: 'Sales Ops Lead',
        responses: {
          B1: 5,  // HIGH claim
          B2: 'Assumptions only',  // No proof
          B3: 'Continue anyway',   // No consequence ownership → CRITICAL
          B5: 4, B6: 4, B7: 4,
          B8: 4, B9: 'Lower priority projects',
          B4: 'Executive sponsor',
          B10: 4, B11: 2,
        }
      },
      {
        role: 'TECH_OWNER',
        name: 'ML Engineer Lead',
        responses: {
          T1: 4, T2: 4, T3: 4, T4: 4,
          T5: 4, T6: 'Lower priority initiatives',
          T7: 4, T8: 4, T9: 4,
          T10: 'Executive sponsor',
          T11: 4, T12: 2,
        }
      }
    ]
  },

  // ==========================================================================
  // SCENARIO 7: NO_GO - Capacity Illusion Confirmed (TM-6)
  // ==========================================================================
  {
    name: 'NO_GO - Capacity Illusion Confirmed',
    description: 'Both Business and Tech say "nothing" deprioritized → CRITICAL',
    variant: 'CORE',
    expectedRecommendation: 'NO_GO',
    expectedIcsRange: [65, 80],
    expectedFlags: ['CAPACITY_ILLUSION_CONFIRMED'],
    expectedGates: [],
    context: {
      decisionTitle: 'Digital Twin Factory',
      investmentType: 'AI solution / automation',
      decisionDescription: 'Implement digital twin for manufacturing optimization',
      timeHorizon: '>6 months',
      dCtx1: 'Whether to build digital twin of production line',
      dCtx2: '15% increase in OEE, predictive maintenance',
      dCtx3: 'Continue reactive maintenance approach',
      dCtx4: 'If IoT data integration fails',
    },
    participants: [
      {
        role: 'EXEC',
        name: 'COO Test',
        responses: {
          E1: 4, E2: 4, E3: 4, E4: 4, E5: 4,
          E6: 4, E7: 4, E8: 4,
          E9: 4, E10: 4, E11: 4,
          E13: 4, E14: 4, E15: 4,
          E16: 4, E17: 4,
          E12: 'Executive sponsor',
        }
      },
      {
        role: 'BUSINESS_OWNER',
        name: 'Plant Manager',
        responses: {
          B1: 4, B5: 4, B6: 4, B7: 4,
          B2: 'Measured results from a pilot',
          B3: 'KPIs tracked, owner assigned',
          B8: 4,
          B9: 'Nothing will be deprioritized',  // CAPACITY ILLUSION
          B4: 'Executive sponsor',
          B10: 4, B11: 2,
        }
      },
      {
        role: 'TECH_OWNER',
        name: 'OT Director',
        responses: {
          T1: 4, T2: 4, T3: 4, T4: 4,
          T5: 4,
          T6: 'Nothing critical will be impacted',  // CONFIRMS ILLUSION
          T7: 4, T8: 4, T9: 4,
          T10: 'Executive sponsor',
          T11: 4, T12: 2,
        }
      }
    ]
  },

  // ==========================================================================
  // SCENARIO 8: NO_GO - Overconfidence (TM-3)
  // ==========================================================================
  {
    name: 'NO_GO - Overconfidence Detected',
    description: 'High confidence claim + no evidence → CRITICAL',
    variant: 'CORE',
    expectedRecommendation: 'NO_GO',
    expectedIcsRange: [65, 80],
    expectedFlags: ['OVERCONFIDENCE'],
    expectedGates: [],
    context: {
      decisionTitle: 'Process Mining Implementation',
      investmentType: 'AI solution / automation',
      decisionDescription: 'Deploy Celonis for process discovery',
      timeHorizon: '3-6 months',
      dCtx1: 'Whether to implement process mining software',
      dCtx2: 'Identify bottlenecks, 25% efficiency gain',
      dCtx3: 'Manual process audits, slow improvement cycles',
      dCtx4: 'If event logs are incomplete or inconsistent',
    },
    participants: [
      {
        role: 'EXEC',
        name: 'CPO Test',
        responses: {
          E1: 5, E2: 5, E3: 5, E4: 5, E5: 5,  // HIGH confidence
          E6: 5, E7: 5, E8: 5,
          E9: 4, E10: 4, E11: 4,
          E13: 4, E14: 4, E15: 4,
          E16: 5, E17: 5,
          E12: 'Executive sponsor',
        }
      },
      {
        role: 'BUSINESS_OWNER',
        name: 'Process Excellence Lead',
        responses: {
          B1: 5,  // HIGH confidence claim
          B2: 'No formal documentation',  // NO evidence → OVERCONFIDENCE CRITICAL
          B3: 'KPIs tracked, owner assigned',
          B5: 4, B6: 4, B7: 4,
          B8: 4, B9: 'Lower priority projects',
          B4: 'Executive sponsor',
          B10: 4, B11: 2,
        }
      },
      {
        role: 'TECH_OWNER',
        name: 'Integration Lead',
        responses: {
          T1: 4, T2: 4, T3: 4, T4: 4,
          T5: 4, T6: 'Lower priority initiatives',
          T7: 4, T8: 4, T9: 4,
          T10: 'Executive sponsor',
          T11: 4, T12: 2,
        }
      }
    ]
  },

  // ==========================================================================
  // SCENARIO 9: CLARIFY - Cross-Role Mismatch (TM-4)
  // ==========================================================================
  {
    name: 'CLARIFY - Cross-Role Mismatch on Data Readiness',
    description: 'Exec high + Tech low on data readiness → Gap > 30 → CRITICAL',
    variant: 'CORE',
    expectedRecommendation: 'NO_GO',
    expectedIcsRange: [60, 75],
    expectedFlags: ['CROSS_ROLE_MISMATCH'],
    expectedGates: [],
    context: {
      decisionTitle: 'Predictive Maintenance AI',
      investmentType: 'AI solution / automation',
      decisionDescription: 'ML model for equipment failure prediction',
      timeHorizon: '3-6 months',
      dCtx1: 'Whether to implement predictive maintenance AI',
      dCtx2: '30% reduction in unplanned downtime',
      dCtx3: 'Continue time-based maintenance schedule',
      dCtx4: 'If sensor data is unreliable or incomplete',
    },
    participants: [
      {
        role: 'EXEC',
        name: 'VP Engineering',
        responses: {
          E1: 4, E2: 4, E3: 4, E4: 4, E5: 4,
          E6: 4, E7: 4, E8: 4,
          E9: 4, E10: 4, E11: 4,
          E13: 4, E14: 4, E15: 4,
          E16: 4,
          E17: 5,  // HIGH data readiness (contradiction group)
          E12: 'Executive sponsor',
        }
      },
      {
        role: 'BUSINESS_OWNER',
        name: 'Maintenance Manager',
        responses: {
          B1: 4, B5: 4, B6: 4, B7: 4,
          B2: 'A documented financial baseline',
          B3: 'KPIs tracked, owner assigned',
          B8: 4, B9: 'Lower priority projects',
          B4: 'Executive sponsor',
          B10: 4, B11: 2,
        }
      },
      {
        role: 'TECH_OWNER',
        name: 'Data Engineer',
        responses: {
          T1: 2,  // LOW data readiness (contradiction with E17)
          T2: 4, T3: 4, T4: 4,
          T5: 4, T6: 'Lower priority initiatives',
          T7: 4, T8: 4, T9: 4,
          T10: 'Executive sponsor',
          T11: 4, T12: 2,
        }
      }
    ]
  },

  // ==========================================================================
  // SCENARIO 10: CLARIFY - Complexity Denial (TM-7)
  // ==========================================================================
  {
    name: 'CLARIFY - Complexity Denial',
    description: 'Both early and late complexity questions high → WARN flag',
    variant: 'CORE',
    expectedRecommendation: 'CLARIFY',
    expectedIcsRange: [65, 80],
    expectedFlags: ['COMPLEXITY_DENIAL'],
    expectedGates: [],
    context: {
      decisionTitle: 'Multi-cloud Migration',
      investmentType: 'Software / digital tool',
      decisionDescription: 'Migrate to multi-cloud architecture',
      timeHorizon: '>6 months',
      dCtx1: 'Whether to adopt multi-cloud strategy',
      dCtx2: 'Vendor independence, improved resilience',
      dCtx3: 'Single cloud vendor lock-in risk',
      dCtx4: 'If complexity exceeds team capabilities',
    },
    participants: [
      {
        role: 'EXEC',
        name: 'CTO Test',
        responses: {
          E1: 4, E2: 4, E3: 4, E4: 4, E5: 4,
          E6: 4, E7: 4, E8: 4,
          E9: 4, E10: 4, E11: 4,
          E13: 4, E14: 4, E15: 4,
          E16: 4, E17: 4,
          E12: 'Executive sponsor',
        }
      },
      {
        role: 'BUSINESS_OWNER',
        name: 'Cloud Architect',
        responses: {
          B1: 4, B5: 4, B6: 4, B7: 4,
          B2: 'Measured results from a pilot',
          B3: 'KPIs tracked, owner assigned',
          B8: 4, B9: 'Lower priority projects',
          B4: 'Executive sponsor',
          B10: 5,  // HIGH - underestimates complexity early
          B11: 5,  // HIGH - still underestimates late → COMPLEXITY_DENIAL
        }
      },
      {
        role: 'TECH_OWNER',
        name: 'DevOps Lead',
        responses: {
          T1: 4, T2: 4, T3: 4, T4: 4,
          T5: 4, T6: 'Lower priority initiatives',
          T7: 4, T8: 4, T9: 4,
          T10: 'Executive sponsor',
          T11: 5,  // HIGH complexity denial
          T12: 5,  // Still HIGH → COMPLEXITY_DENIAL
        }
      }
    ]
  },

  // ==========================================================================
  // SCENARIO 11: FULL KIT - Gate G2 Process Readiness
  // ==========================================================================
  {
    name: 'FULL KIT - Gate G2 Process Not Ready',
    description: 'Full kit with process score < 50 → Gate G2 → CLARIFY',
    variant: 'FULL',
    expectedRecommendation: 'CLARIFY',
    expectedIcsRange: [75, 85],
    expectedFlags: [],
    expectedGates: ['G2'],
    context: {
      decisionTitle: 'RPA Invoice Processing',
      investmentType: 'AI solution / automation',
      decisionDescription: 'Automate invoice processing with RPA',
      timeHorizon: '3-6 months',
      dCtx1: 'Whether to automate AP invoice processing',
      dCtx2: '60% reduction in processing time',
      dCtx3: 'Manual processing continues, high error rate',
      dCtx4: 'If process exceptions are too varied',
    },
    participants: [
      {
        role: 'EXEC',
        name: 'CFO Finance',
        responses: {
          E1: 5, E2: 5, E3: 5, E4: 5, E5: 5,
          E6: 5, E7: 5, E8: 5,
          E9: 4, E10: 4, E11: 4,
          E13: 4, E14: 4, E15: 4,
          E16: 5, E17: 5,
          E12: 'Executive sponsor',
        }
      },
      {
        role: 'BUSINESS_OWNER',
        name: 'AP Manager',
        responses: {
          B1: 5, B5: 5, B6: 5, B7: 5,
          B2: 'A documented financial baseline',
          B3: 'KPIs tracked, owner assigned',
          B8: 4, B9: 'Lower priority projects',
          B4: 'Executive sponsor',
          B10: 4, B11: 2,
        }
      },
      {
        role: 'TECH_OWNER',
        name: 'RPA Developer',
        responses: {
          T1: 5, T2: 5, T3: 5, T4: 4,
          T5: 4, T6: 'Lower priority initiatives',
          T7: 4, T8: 4, T9: 4,
          T10: 'Executive sponsor',
          T11: 4, T12: 2,
        }
      },
      {
        role: 'PROCESS_OWNER',
        name: 'Process Analyst',
        responses: {
          P1: 2, P2: 2, P3: 2, P4: 2,  // LOW process scores → G2
          P5: 'Executive sponsor',
          P6: 2, P7: 2, P8: 2, P9: 2,
        }
      }
    ]
  },

  // ==========================================================================
  // SCENARIO 12: QUICK_CHECK - Executive Only
  // ==========================================================================
  {
    name: 'QUICK_CHECK - Executive GO',
    description: 'Quick check with single exec, high scores → GO',
    variant: 'QUICK_CHECK',
    expectedRecommendation: 'GO',
    expectedIcsRange: [75, 100],
    expectedFlags: [],
    expectedGates: [],
    context: {
      decisionTitle: 'Chatbot Quick Assessment',
      investmentType: 'AI solution / automation',
      decisionDescription: 'Quick assessment for chatbot investment',
      timeHorizon: 'Immediate',
      dCtx1: 'Quick check on chatbot feasibility',
      dCtx2: 'Faster customer response times',
      dCtx3: 'Continue manual support',
      dCtx4: 'If customers prefer human support',
    },
    participants: [
      {
        role: 'EXEC',
        name: 'Quick Check Exec',
        responses: {
          E1: 5, E2: 5, E3: 5, E4: 5, E5: 5,
          E6: 5, E7: 5, E8: 5,
          E9: 4, E10: 4, E11: 4,
          E13: 4, E14: 4, E15: 4,
          E16: 5, E17: 5,
          E12: 'Executive sponsor',
        }
      }
    ]
  },

  // ==========================================================================
  // SCENARIO 13: PROCESS_STANDALONE - No ICS
  // ==========================================================================
  {
    name: 'PROCESS_STANDALONE - No Recommendation',
    description: 'Process standalone variant produces no ICS or recommendation',
    variant: 'PROCESS_STANDALONE',
    expectedRecommendation: null,
    expectedIcsRange: undefined,
    expectedFlags: [],
    expectedGates: [],
    context: {
      decisionTitle: 'Process Assessment Only',
      investmentType: 'External consultancy / system integrator',
      decisionDescription: 'Assess process readiness only',
      timeHorizon: '3-6 months',
      dCtx1: 'Evaluate process maturity for future automation',
      dCtx2: 'Clear process documentation',
      dCtx3: 'Process remains undocumented',
      dCtx4: 'If process is too variable',
    },
    participants: [
      {
        role: 'PROCESS_OWNER',
        name: 'Process Consultant',
        responses: {
          P1: 4, P2: 4, P3: 4, P4: 4,
          P5: 'Executive sponsor',
          P6: 4, P7: 4, P8: 4, P9: 4,
        }
      }
    ]
  },

  // ==========================================================================
  // SCENARIO 14: Within-Role Contradiction (TM-1)
  // ==========================================================================
  {
    name: 'CLARIFY - Within Role Contradiction',
    description: 'Executive contradicts self on reversed questions → WARN',
    variant: 'CORE',
    expectedRecommendation: 'CLARIFY',
    expectedIcsRange: [60, 75],
    expectedFlags: ['WITHIN_ROLE_CONTRADICTION'],
    expectedGates: [],
    context: {
      decisionTitle: 'Knowledge Management AI',
      investmentType: 'AI solution / automation',
      decisionDescription: 'AI-powered knowledge base and search',
      timeHorizon: '3-6 months',
      dCtx1: 'Whether to implement AI knowledge management',
      dCtx2: '50% faster information retrieval',
      dCtx3: 'Continue with fragmented documentation',
      dCtx4: 'If content quality is inconsistent',
    },
    participants: [
      {
        role: 'EXEC',
        name: 'CKO Test',
        responses: {
          E1: 5,   // Positive on strategic clarity
          E2: 4, E3: 4, E4: 4, E5: 4,
          E6: 4, E7: 4, E8: 4,
          E9: 4, E10: 4, E11: 5,  // BUT also high on reverse → contradiction
          E13: 4, E14: 4, E15: 4,
          E16: 4, E17: 4,
          E12: 'Executive sponsor',
        }
      },
      {
        role: 'BUSINESS_OWNER',
        name: 'Content Lead',
        responses: {
          B1: 4, B5: 4, B6: 4, B7: 4,
          B2: 'Measured results from a pilot',
          B3: 'KPIs tracked, owner assigned',
          B8: 4, B9: 'Lower priority projects',
          B4: 'Executive sponsor',
          B10: 4, B11: 2,
        }
      },
      {
        role: 'TECH_OWNER',
        name: 'Search Engineer',
        responses: {
          T1: 4, T2: 4, T3: 4, T4: 4,
          T5: 4, T6: 'Lower priority initiatives',
          T7: 4, T8: 4, T9: 4,
          T10: 'Executive sponsor',
          T11: 4, T12: 2,
        }
      }
    ]
  },

  // ==========================================================================
  // SCENARIO 15: Multiple Participants Same Role
  // ==========================================================================
  {
    name: 'Multiple Executives - Averaged',
    description: 'Two executives with different views → averaged before weighting',
    variant: 'QUICK_CHECK',
    expectedRecommendation: 'CLARIFY',
    expectedIcsRange: [55, 74],
    expectedFlags: [],
    expectedGates: [],
    context: {
      decisionTitle: 'CRM AI Enhancement',
      investmentType: 'AI solution / automation',
      decisionDescription: 'Add AI features to existing CRM',
      timeHorizon: '3-6 months',
      dCtx1: 'Whether to enhance CRM with AI capabilities',
      dCtx2: 'Better lead scoring, automated follow-ups',
      dCtx3: 'Manual lead qualification continues',
      dCtx4: 'If sales team resists new workflow',
    },
    participants: [
      {
        role: 'EXEC',
        name: 'Optimistic CEO',
        responses: {
          E1: 5, E2: 5, E3: 5, E4: 5, E5: 5,
          E6: 5, E7: 5, E8: 5,
          E9: 5, E10: 5, E11: 4,
          E13: 4, E14: 4, E15: 4,
          E16: 5, E17: 5,
          E12: 'Executive sponsor',
        }
      },
      {
        role: 'EXEC',
        name: 'Skeptical CFO',
        responses: {
          E1: 2, E2: 2, E3: 2, E4: 2, E5: 2,
          E6: 2, E7: 2, E8: 2,
          E9: 2, E10: 2, E11: 2,
          E13: 2, E14: 2, E15: 2,
          E16: 2, E17: 2,
          E12: 'Executive sponsor',
        }
      }
    ]
  },
];

// =============================================================================
// SEED FUNCTION
// =============================================================================

async function seedTestCases() {
  console.log('🌱 Seeding test cases...\n');

  for (const testCase of TEST_CASES) {
    console.log(`📋 Creating: ${testCase.name}`);
    
    // Create the case
    const decisionCase = await prisma.decisionCase.create({
      data: {
        variant: testCase.variant,
        status: 'DRAFT',
        decisionTitle: testCase.context.decisionTitle,
        investmentType: testCase.context.investmentType,
        decisionDescription: testCase.context.decisionDescription,
        timeHorizon: testCase.context.timeHorizon,
        dCtx1: testCase.context.dCtx1,
        dCtx2: testCase.context.dCtx2,
        dCtx3: testCase.context.dCtx3,
        dCtx4: testCase.context.dCtx4,
      }
    });

    // Create participants and their responses
    for (const participant of testCase.participants) {
      const token = nanoid(24);
      
      const createdParticipant = await prisma.participant.create({
        data: {
          caseId: decisionCase.id,
          role: participant.role,
          name: participant.name,
          token,
          status: 'COMPLETED',
        }
      });

      // Create responses
      for (const [questionId, value] of Object.entries(participant.responses)) {
        await prisma.response.create({
          data: {
            caseId: decisionCase.id,
            participantId: createdParticipant.id,
            questionId,
            answerType: typeof value === 'number' ? 'LIKERT' : 'SINGLE_SELECT',
            rawValue: typeof value === 'number' ? value : null,
            textValue: typeof value === 'string' ? value : null,
          }
        });
      }
    }

    // Update case status
    await prisma.decisionCase.update({
      where: { id: decisionCase.id },
      data: { 
        status: 'COMPLETED',
        firstResponseAt: new Date(),
      }
    });

    console.log(`   ✅ Created with ${testCase.participants.length} participant(s)`);
    console.log(`   Expected: ${testCase.expectedRecommendation || 'null'}`);
    if (testCase.expectedFlags.length > 0) {
      console.log(`   Flags: ${testCase.expectedFlags.join(', ')}`);
    }
    console.log('');
  }

  console.log(`\n🎉 Seeded ${TEST_CASES.length} test cases!`);
}

// =============================================================================
// MAIN
// =============================================================================

seedTestCases()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
