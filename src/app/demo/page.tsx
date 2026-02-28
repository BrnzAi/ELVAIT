'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, ArrowRight, CheckCircle, AlertTriangle, XCircle, 
  Brain, Users, BarChart3, FileText, Zap, Target, TrendingUp,
  Shield, Briefcase, Settings, ChevronRight, Play, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// =============================================================================
// DEMO SCENARIOS DATA
// =============================================================================

interface DemoScenario {
  id: string;
  name: string;
  description: string;
  variant: string;
  recommendation: 'GO' | 'CLARIFY' | 'NO_GO' | null;
  ics: number | null;
  context: {
    title: string;
    description: string;
    dCtx1: string;
    dCtx2: string;
    dCtx3: string;
    dCtx4: string;
  };
  dimensions: Record<string, number>;
  flags: { id: string; severity: 'CRITICAL' | 'WARN' | 'INFO'; description: string }[];
  gates: { gate: string; action: string; reason: string }[];
  blindSpots: { label: string; explanation: string; severity: string }[];
  checklistItems: string[];
  participants: { role: string; name: string; status: string }[];
}

const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'go-perfect',
    name: '🟢 Perfect GO',
    description: 'Full alignment, high clarity, ready to proceed',
    variant: 'CORE',
    recommendation: 'GO',
    ics: 87,
    context: {
      title: 'Customer Service AI Automation',
      description: 'Implement AI-powered chatbot for tier-1 customer support inquiries',
      dCtx1: 'Whether to invest €200k in AI chatbot for customer service',
      dCtx2: '40% reduction in tier-1 support tickets, faster response times',
      dCtx3: 'Continue manual handling, increasing costs by 15% annually',
      dCtx4: 'If customers reject AI interactions or accuracy is below 85%',
    },
    dimensions: { D1: 92, D2: 88, D3: 82, D4: 85, D5: 90 },
    flags: [],
    gates: [],
    blindSpots: [],
    checklistItems: [],
    participants: [
      { role: 'Executive', name: 'Sarah Chen (CEO)', status: 'COMPLETED' },
      { role: 'Business Owner', name: 'Michael Park', status: 'COMPLETED' },
      { role: 'Technical Owner', name: 'Emily Rodriguez', status: 'COMPLETED' },
    ]
  },
  {
    id: 'clarify-midrange',
    name: '🟡 CLARIFY - Mid-range',
    description: 'Partial clarity, needs alignment before proceeding',
    variant: 'CORE',
    recommendation: 'CLARIFY',
    ics: 68,
    context: {
      title: 'Marketing Automation Platform',
      description: 'Implement marketing automation for lead nurturing and campaign management',
      dCtx1: 'Whether to invest in HubSpot Marketing Hub Enterprise',
      dCtx2: '30% increase in qualified leads, better attribution',
      dCtx3: 'Manual email campaigns continue, inconsistent follow-up',
      dCtx4: 'Low adoption by marketing team, poor CRM integration',
    },
    dimensions: { D1: 72, D2: 65, D3: 58, D4: 70, D5: 75 },
    flags: [
      { id: 'PROOF_GAP', severity: 'WARN', description: 'Value claims lack documented evidence' }
    ],
    gates: [],
    blindSpots: [
      { label: 'Unvalidated ROI assumptions', explanation: 'Business case relies on assumptions without pilot data', severity: 'WARN' }
    ],
    checklistItems: [
      'Conduct pilot program to validate ROI assumptions',
      'Document current lead conversion metrics as baseline',
      'Align on success KPIs with all stakeholders'
    ],
    participants: [
      { role: 'Executive', name: 'James Wilson (CMO)', status: 'COMPLETED' },
      { role: 'Business Owner', name: 'Anna Lee', status: 'COMPLETED' },
      { role: 'Technical Owner', name: 'David Kim', status: 'COMPLETED' },
    ]
  },
  {
    id: 'clarify-gate-g1',
    name: '🟡 CLARIFY - Gate G1',
    description: 'High ICS but one dimension below threshold',
    variant: 'CORE',
    recommendation: 'CLARIFY',
    ics: 79,
    context: {
      title: 'Data Lake Implementation',
      description: 'Build centralized data lake on AWS for enterprise analytics',
      dCtx1: 'Whether to build a cloud data lake on AWS',
      dCtx2: 'Single source of truth, 10x faster insights',
      dCtx3: 'Continued data silos, slow reporting, duplicate efforts',
      dCtx4: 'Data quality issues, security concerns, low adoption',
    },
    dimensions: { D1: 90, D2: 85, D3: 45, D4: 82, D5: 88 },
    flags: [],
    gates: [
      { gate: 'G1', action: 'CLARIFY', reason: 'D3 (Organizational Readiness) below 50' }
    ],
    blindSpots: [
      { label: 'Team capacity concerns', explanation: 'Organization may lack bandwidth to support initiative', severity: 'CRITICAL' }
    ],
    checklistItems: [
      'Assess team capacity and identify resource gaps',
      'Define change management plan',
      'Establish data governance framework before proceeding'
    ],
    participants: [
      { role: 'Executive', name: 'Robert Taylor (CDO)', status: 'COMPLETED' },
      { role: 'Business Owner', name: 'Jennifer Brown', status: 'COMPLETED' },
      { role: 'Technical Owner', name: 'Chris Martinez', status: 'COMPLETED' },
    ]
  },
  {
    id: 'nogo-ownership',
    name: '🔴 NO_GO - Ownership Crisis',
    description: 'Critical ownership diffusion - no clear accountability',
    variant: 'CORE',
    recommendation: 'NO_GO',
    ics: 72,
    context: {
      title: 'ERP System Modernization',
      description: 'Replace legacy SAP R/3 with S/4HANA Cloud',
      dCtx1: 'Whether to migrate from SAP R/3 to S/4HANA Cloud',
      dCtx2: 'Unified data model, real-time reporting, mobile access',
      dCtx3: 'Increasing maintenance costs, end of support in 2027',
      dCtx4: 'Data migration failures, user adoption resistance, budget overrun',
    },
    dimensions: { D1: 78, D2: 75, D3: 68, D4: 70, D5: 72 },
    flags: [
      { id: 'OWNERSHIP_DIFFUSION', severity: 'CRITICAL', description: 'Three different owners identified across roles - no clear accountability' }
    ],
    gates: [
      { gate: 'G4', action: 'CLARIFY', reason: 'Ownership diffusion detected' }
    ],
    blindSpots: [
      { label: 'Accountability vacuum', explanation: 'Exec says "Executive sponsor", Business says "Business unit leader", Tech says "Not clearly defined"', severity: 'CRITICAL' }
    ],
    checklistItems: [
      'Establish single accountable owner with decision authority',
      'Define RACI matrix for all key decisions',
      'Get executive sign-off on ownership structure'
    ],
    participants: [
      { role: 'Executive', name: 'Mark Johnson (CFO)', status: 'COMPLETED' },
      { role: 'Business Owner', name: 'Lisa Wang', status: 'COMPLETED' },
      { role: 'Technical Owner', name: 'Tom Anderson', status: 'COMPLETED' },
    ]
  },
  {
    id: 'nogo-overconfidence',
    name: '🔴 NO_GO - Overconfidence',
    description: 'High claims with zero evidence - narrative inflation',
    variant: 'CORE',
    recommendation: 'NO_GO',
    ics: 74,
    context: {
      title: 'AI Sales Forecasting',
      description: 'ML-based sales prediction system for revenue planning',
      dCtx1: 'Whether to implement AI sales forecasting',
      dCtx2: '20% improvement in forecast accuracy',
      dCtx3: 'Continue with spreadsheet-based forecasts',
      dCtx4: 'If historical data quality is poor or sales patterns unpredictable',
    },
    dimensions: { D1: 80, D2: 78, D3: 70, D4: 68, D5: 75 },
    flags: [
      { id: 'NARRATIVE_INFLATION_RISK', severity: 'CRITICAL', description: 'High confidence claim (5/5) + Assumptions only + No consequence ownership' },
      { id: 'OVERCONFIDENCE', severity: 'CRITICAL', description: 'Confidence score 5/5 but evidence score 1/5 (no documentation)' }
    ],
    gates: [],
    blindSpots: [
      { label: 'Unsubstantiated ROI claims', explanation: 'Business Owner claims 20% accuracy improvement with no pilot data', severity: 'CRITICAL' },
      { label: 'No failure contingency', explanation: 'If forecast fails, response is "continue anyway" with no defined fallback', severity: 'CRITICAL' }
    ],
    checklistItems: [
      'Conduct pilot with measured baseline accuracy',
      'Document evidence for ROI claims',
      'Define clear failure criteria and contingency plan',
      'Assign consequence owner for forecast accuracy'
    ],
    participants: [
      { role: 'Executive', name: 'Patricia Davis (CRO)', status: 'COMPLETED' },
      { role: 'Business Owner', name: 'Kevin Zhang', status: 'COMPLETED' },
      { role: 'Technical Owner', name: 'Rachel Green', status: 'COMPLETED' },
    ]
  },
  {
    id: 'nogo-capacity',
    name: '🔴 NO_GO - Capacity Illusion',
    description: 'Both Business and Tech deny any trade-offs needed',
    variant: 'CORE',
    recommendation: 'NO_GO',
    ics: 76,
    context: {
      title: 'Digital Twin Factory',
      description: 'Implement digital twin for manufacturing optimization',
      dCtx1: 'Whether to build digital twin of production line',
      dCtx2: '15% increase in OEE, predictive maintenance capability',
      dCtx3: 'Continue reactive maintenance, higher downtime',
      dCtx4: 'If IoT data integration fails or model accuracy is low',
    },
    dimensions: { D1: 82, D2: 78, D3: 72, D4: 75, D5: 78 },
    flags: [
      { id: 'CAPACITY_ILLUSION_CONFIRMED', severity: 'CRITICAL', description: 'Both Business and Tech claim nothing will be deprioritized - unrealistic capacity assumption' }
    ],
    gates: [],
    blindSpots: [
      { label: 'Denial of trade-offs', explanation: 'Business: "Nothing will be deprioritized" + Tech: "Nothing critical will be impacted" — impossible unless both are underestimating effort', severity: 'CRITICAL' }
    ],
    checklistItems: [
      'Conduct capacity assessment with realistic effort estimates',
      'Identify what will be deprioritized or delayed',
      'Get explicit commitment on resource allocation',
      'Define escalation path for capacity conflicts'
    ],
    participants: [
      { role: 'Executive', name: 'William Chen (COO)', status: 'COMPLETED' },
      { role: 'Business Owner', name: 'Sandra Miller', status: 'COMPLETED' },
      { role: 'Technical Owner', name: 'John Smith', status: 'COMPLETED' },
    ]
  },
];

// =============================================================================
// COMPONENTS
// =============================================================================

const DIMENSION_CONFIG: Record<string, { label: string; icon: typeof Target }> = {
  D1: { label: 'Strategic Intent', icon: Target },
  D2: { label: 'Value & Economics', icon: TrendingUp },
  D3: { label: 'Organizational Readiness', icon: Users },
  D4: { label: 'Risk & Dependencies', icon: Shield },
  D5: { label: 'Decision Governance', icon: Briefcase },
  P: { label: 'Process Readiness', icon: Settings },
};

function ICSGauge({ score }: { score: number }) {
  const getColor = () => {
    if (score >= 75) return 'text-green-500';
    if (score >= 55) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="relative w-48 h-48">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50" cy="50" r="40"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-gray-200"
        />
        <circle
          cx="50" cy="50" r="40"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeDasharray={`${(score / 100) * 251.2} 251.2`}
          strokeLinecap="round"
          className={`${getColor()} transition-all duration-1000`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-5xl font-bold ${getColor()}`}>{score}</span>
        <span className="text-sm text-brand-grey">ICS Score</span>
      </div>
    </div>
  );
}

function RecommendationBadge({ recommendation }: { recommendation: 'GO' | 'CLARIFY' | 'NO_GO' | null }) {
  if (recommendation === 'GO') {
    return (
      <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border-2 border-green-200">
        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
          <CheckCircle className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-green-700">GO</h3>
          <p className="text-sm text-green-600">Ready to Proceed</p>
        </div>
      </div>
    );
  }
  if (recommendation === 'CLARIFY') {
    return (
      <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border-2 border-amber-200">
        <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-amber-700">CLARIFY</h3>
          <p className="text-sm text-amber-600">Action Required</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border-2 border-red-200">
      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
        <XCircle className="w-7 h-7 text-white" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-red-700">NO-GO</h3>
        <p className="text-sm text-red-600">Do Not Proceed</p>
      </div>
    </div>
  );
}

function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={`h-2 rounded-full transition-all ${
            i === currentStep ? 'w-8 bg-brand-green' : 
            i < currentStep ? 'w-2 bg-brand-green' : 'w-2 bg-gray-300'
          }`}
        />
      ))}
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function DemoPage() {
  const [step, setStep] = useState(0);
  const [selectedScenario, setSelectedScenario] = useState<DemoScenario | null>(null);

  const totalSteps = 5;

  // Step 0: Intro
  if (step === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              Back
            </Link>
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-brand-green" />
              <span className="font-semibold">Interactive Demo</span>
            </div>
            <div />
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green/10 rounded-full text-black text-brand-green/80 mb-6">
              <Play className="w-4 h-4" />
              Demo Mode
            </div>
            <h1 className="text-4xl font-bold mb-4">See How Clarity Kit Works</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Walk through the assessment process and see how different scenarios lead to GO, CLARIFY, or NO-GO recommendations.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-200 mb-8">
            <h2 className="text-xl font-semibold mb-6">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-brand-green/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-brand-green" />
                </div>
                <h3 className="font-semibold mb-2">1. Collect</h3>
                <p className="text-sm text-gray-600">
                  Gather structured input from executives, business owners, and technical leads
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">2. Analyze</h3>
                <p className="text-sm text-gray-600">
                  Detect contradictions, score dimensions, identify blind spots automatically
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">3. Decide</h3>
                <p className="text-sm text-gray-600">
                  Get a clear GO, CLARIFY, or NO-GO with specific action items
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Button onClick={() => setStep(1)} size="lg" className="w-full">
              <Eye className="w-5 h-5 mr-2" />
              View Scenarios
            </Button>
            <Link href="/demo/login" className="w-full">
              <Button variant="outline" size="lg" className="w-full">
                <Users className="w-5 h-5 mr-2" />
                Try as Different Roles
              </Button>
            </Link>
          </div>

          <p className="text-center text-sm text-brand-grey mt-4">
            <strong>Scenarios:</strong> See pre-built results for GO, CLARIFY, and NO-GO outcomes<br />
            <strong>Roles:</strong> Experience the survey from Executive, Business Owner, or Tech perspectives
          </p>
        </main>
      </div>
    );
  }

  // Step 1: Select Scenario
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <button onClick={() => setStep(0)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <span className="font-semibold">Choose a Scenario</span>
            <div />
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-8">
          <StepIndicator currentStep={0} totalSteps={totalSteps} />
          
          <h1 className="text-2xl font-bold text-center mb-2">Select a Demo Scenario</h1>
          <p className="text-center text-gray-600 mb-8">
            Each scenario demonstrates different outcomes based on stakeholder responses
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {DEMO_SCENARIOS.map(scenario => (
              <button
                key={scenario.id}
                onClick={() => {
                  setSelectedScenario(scenario);
                  setStep(2);
                }}
                className={`p-5 rounded-xl border-2 text-left transition-all hover:border-brand-green ${
                  scenario.recommendation === 'GO' 
                    ? 'border-green-200 bg-green-50/50' 
                    : scenario.recommendation === 'CLARIFY'
                      ? 'border-amber-200 bg-amber-50/50'
                      : 'border-red-200 bg-red-50/50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold">{scenario.name}</h3>
                  <span className="text-sm text-brand-grey">{scenario.variant}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-brand-grey">ICS: {scenario.ics ?? 'N/A'}</span>
                  {scenario.flags.length > 0 && (
                    <span className="text-red-600">{scenario.flags.length} flag(s)</span>
                  )}
                </div>
                <div className="mt-3 text-sm font-medium text-brand-green flex items-center gap-1">
                  View results <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (!selectedScenario) return null;

  // Step 2: Context
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <button onClick={() => setStep(1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <span className="font-semibold">Decision Context</span>
            <div />
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-8">
          <StepIndicator currentStep={1} totalSteps={totalSteps} />

          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h1 className="text-2xl font-bold mb-2">{selectedScenario.context.title}</h1>
            <p className="text-gray-600 mb-6">{selectedScenario.context.description}</p>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-brand-grey mb-1">What decision are we making?</p>
                <p className="font-medium">{selectedScenario.context.dCtx1}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-brand-grey mb-1">What does success look like?</p>
                <p className="font-medium">{selectedScenario.context.dCtx2}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-brand-grey mb-1">What if we do nothing?</p>
                <p className="font-medium">{selectedScenario.context.dCtx3}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-brand-grey mb-1">What could make this a mistake?</p>
                <p className="font-medium">{selectedScenario.context.dCtx4}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Participants</h2>
            <div className="space-y-3">
              {selectedScenario.participants.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-sm text-brand-grey">{p.role}</p>
                    </div>
                  </div>
                  <span className="text-sm text-green-600">Completed</span>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={() => setStep(3)} className="w-full">
            View Analysis
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </main>
      </div>
    );
  }

  // Step 3: Dimensions
  if (step === 3) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <button onClick={() => setStep(2)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <span className="font-semibold">Dimension Scores</span>
            <div />
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-8">
          <StepIndicator currentStep={2} totalSteps={totalSteps} />

          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold mb-6">Clarity Dimensions</h2>
            <div className="space-y-4">
              {Object.entries(selectedScenario.dimensions).map(([dim, score]) => {
                const config = DIMENSION_CONFIG[dim];
                if (!config) return null;
                const Icon = config.icon;
                
                return (
                  <div key={dim} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5 text-brand-green" />
                        <span className="font-medium">{config.label}</span>
                      </div>
                      <span className={`font-bold ${
                        score >= 75 ? 'text-green-600' : score >= 50 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {score}/100
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          score >= 75 ? 'bg-green-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    {score < 50 && (
                      <p className="text-sm text-red-600 mt-2">⚠️ Below threshold - triggers Gate G1</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <Button onClick={() => setStep(4)} className="w-full">
            View Flags & Gates
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </main>
      </div>
    );
  }

  // Step 4: Flags & Gates
  if (step === 4) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <button onClick={() => setStep(3)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <span className="font-semibold">Flags & Gates</span>
            <div />
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-8">
          <StepIndicator currentStep={3} totalSteps={totalSteps} />

          {/* Flags */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Detected Flags</h2>
            {selectedScenario.flags.length === 0 ? (
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-green-700">No flags detected - clean signal!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedScenario.flags.map((flag, i) => (
                  <div 
                    key={i}
                    className={`p-4 rounded-lg border-l-4 ${
                      flag.severity === 'CRITICAL' 
                        ? 'bg-red-50 border-red-500'
                        : 'bg-amber-50 border-amber-500'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        flag.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {flag.severity}
                      </span>
                      <span className="font-mono text-sm">{flag.id}</span>
                    </div>
                    <p className="text-sm text-gray-700">{flag.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Gates */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Gating Rules</h2>
            {selectedScenario.gates.length === 0 ? (
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-green-700">All gates passed!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedScenario.gates.map((gate, i) => (
                  <div key={i} className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold">{gate.gate}</span>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs">
                        → {gate.action}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{gate.reason}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Blind Spots */}
          {selectedScenario.blindSpots.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Blind Spots</h2>
              <div className="space-y-3">
                {selectedScenario.blindSpots.map((spot, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-1">{spot.label}</h3>
                    <p className="text-sm text-gray-600">{spot.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button onClick={() => setStep(5)} className="w-full">
            View Final Recommendation
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </main>
      </div>
    );
  }

  // Step 5: Final Result
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => setStep(4)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <span className="font-semibold">Final Recommendation</span>
          <div />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <StepIndicator currentStep={4} totalSteps={totalSteps} />

        {/* Result Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {selectedScenario.ics !== null && (
              <ICSGauge score={selectedScenario.ics} />
            )}
            <div className="flex-1">
              <RecommendationBadge recommendation={selectedScenario.recommendation} />
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Why this recommendation?</h3>
                {selectedScenario.recommendation === 'GO' && (
                  <p className="text-sm text-gray-600">
                    ICS ≥ 75, no critical flags, all gates passed. High clarity exists across all dimensions with strong stakeholder alignment.
                  </p>
                )}
                {selectedScenario.recommendation === 'CLARIFY' && (
                  <p className="text-sm text-gray-600">
                    {selectedScenario.gates.length > 0 
                      ? `Gate ${selectedScenario.gates[0].gate} triggered: ${selectedScenario.gates[0].reason}`
                      : 'ICS in 55-74 range - partial clarity exists but gaps need addressing before proceeding.'
                    }
                  </p>
                )}
                {selectedScenario.recommendation === 'NO_GO' && (
                  <p className="text-sm text-gray-600">
                    {selectedScenario.flags.filter(f => f.severity === 'CRITICAL').length > 0
                      ? `Critical flag detected: ${selectedScenario.flags.find(f => f.severity === 'CRITICAL')?.id}. Must be resolved before proceeding.`
                      : 'ICS below 55 - fundamental clarity gaps exist that would jeopardize success.'
                    }
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Checklist */}
        {selectedScenario.checklistItems.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Action Checklist</h2>
            <div className="space-y-3">
              {selectedScenario.checklistItems.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-brand-green/10 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-brand-green text-white flex items-center justify-center text-sm font-medium flex-shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-sm">{item}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Button variant="outline" onClick={() => setStep(1)} className="w-full">
            <Eye className="w-4 h-4 mr-2" />
            Try Another Scenario
          </Button>
          <Link href="/create" className="w-full">
            <Button className="w-full">
              <Zap className="w-4 h-4 mr-2" />
              Start Real Assessment
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
