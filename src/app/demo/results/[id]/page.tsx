'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Brain, ArrowLeft, CheckCircle, AlertTriangle, XCircle,
  TrendingUp, Users, Target, Shield, Lightbulb, FileText,
  ChevronDown, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// =============================================================================
// DEMO DATA - Different assessments based on ID
// =============================================================================

interface Assessment {
  id: string;
  title: string;
  ics: number;
  recommendation: 'GO' | 'CLARIFY' | 'NO_GO';
  dimensions: { code: string; name: string; score: number; weight: number; insights: string[] }[];
  flags: { code: string; name: string; severity: 'critical' | 'warning' | 'info'; description: string }[];
  blindSpots: { title: string; description: string; severity: string }[];
}

const DEMO_ASSESSMENTS: Record<string, Assessment> = {
  '1': {
    id: '1',
    title: 'Customer Service AI Automation',
    ics: 87,
    recommendation: 'GO',
    dimensions: [
      { code: 'D1', name: 'Strategic Alignment', score: 92, weight: 0.20, insights: ['Clear executive mandate', 'Aligned with cost reduction targets', 'Customer satisfaction KPIs defined'] },
      { code: 'D2', name: 'Value Clarity', score: 88, weight: 0.25, insights: ['ROI model validated by finance', 'Baseline metrics established', '30% efficiency gain expected'] },
      { code: 'D3', name: 'Technical Feasibility', score: 85, weight: 0.20, insights: ['POC completed successfully', 'Integration path mapped', 'Vendor selected and vetted'] },
      { code: 'D4', name: 'Organizational Readiness', score: 82, weight: 0.20, insights: ['Change management plan in place', 'Training program designed', 'Phased rollout planned'] },
      { code: 'D5', name: 'Risk Awareness', score: 89, weight: 0.15, insights: ['Data privacy assessed', 'Fallback procedures defined', 'Escalation paths clear'] }
    ],
    flags: [],
    blindSpots: []
  },
  '2': {
    id: '2',
    title: 'ERP System Modernization',
    ics: 72,
    recommendation: 'NO_GO',
    dimensions: [
      { code: 'D1', name: 'Strategic Alignment', score: 78, weight: 0.20, insights: ['Board approved but scope unclear', 'Multiple competing priorities'] },
      { code: 'D2', name: 'Value Clarity', score: 65, weight: 0.25, insights: ['ROI assumptions questioned', 'Hidden costs emerging'] },
      { code: 'D3', name: 'Technical Feasibility', score: 58, weight: 0.20, insights: ['Legacy integration challenges', 'Data migration risks high'] },
      { code: 'D4', name: 'Organizational Readiness', score: 70, weight: 0.20, insights: ['Resource conflicts identified', 'Training timeline aggressive'] },
      { code: 'D5', name: 'Risk Awareness', score: 85, weight: 0.15, insights: ['Risks documented but not mitigated'] }
    ],
    flags: [
      { code: 'TM-3', name: 'Overconfidence', severity: 'critical', description: 'Technical complexity underestimated by leadership' },
      { code: 'TM-5', name: 'Ownership Diffusion', severity: 'warning', description: 'No clear accountability for data migration' }
    ],
    blindSpots: [
      { title: 'Integration Complexity', description: 'No plan for parallel systems during transition period', severity: 'warning' }
    ]
  },
  '3': {
    id: '3',
    title: 'Marketing Automation Platform',
    ics: 76,
    recommendation: 'CLARIFY',
    dimensions: [
      { code: 'D1', name: 'Strategic Alignment', score: 82, weight: 0.20, insights: ['Aligned with growth targets', 'Some stakeholder misalignment'] },
      { code: 'D2', name: 'Value Clarity', score: 74, weight: 0.25, insights: ['ROI documented but assumptions need validation'] },
      { code: 'D3', name: 'Technical Feasibility', score: 68, weight: 0.20, insights: ['Some resource conflicts identified'] },
      { code: 'D4', name: 'Organizational Readiness', score: 71, weight: 0.20, insights: ['Change management plan needed'] },
      { code: 'D5', name: 'Risk Awareness', score: 85, weight: 0.15, insights: ['Risks acknowledged, mitigation in progress'] }
    ],
    flags: [
      { code: 'TM-2', name: 'Value Not Quantified', severity: 'warning', description: 'Expected value lacks concrete metrics' },
      { code: 'TM-4', name: 'Resource Conflict', severity: 'warning', description: 'Initiative competes with other priorities' }
    ],
    blindSpots: [
      { title: 'Timeline Optimism', description: 'Business and technical owners have 40% variance in expected timeline', severity: 'warning' }
    ]
  },
  '4': {
    id: '4',
    title: 'Data Lake Implementation',
    ics: 68,
    recommendation: 'CLARIFY',
    dimensions: [
      { code: 'D1', name: 'Strategic Alignment', score: 75, weight: 0.20, insights: ['Supports analytics strategy', 'Competing with BI project'] },
      { code: 'D2', name: 'Value Clarity', score: 62, weight: 0.25, insights: ['Value proposition unclear to business'] },
      { code: 'D3', name: 'Technical Feasibility', score: 72, weight: 0.20, insights: ['Team has relevant experience'] },
      { code: 'D4', name: 'Organizational Readiness', score: 65, weight: 0.20, insights: ['Data governance gaps identified'] },
      { code: 'D5', name: 'Risk Awareness', score: 70, weight: 0.15, insights: ['Security risks need assessment'] }
    ],
    flags: [
      { code: 'TM-5', name: 'Ownership Diffusion', severity: 'warning', description: 'Data ownership across departments unclear' }
    ],
    blindSpots: [
      { title: 'Governance Gap', description: 'No data quality framework in place', severity: 'warning' }
    ]
  },
  '5': {
    id: '5',
    title: 'Process Mining Tool',
    ics: 45,
    recommendation: 'NO_GO',
    dimensions: [
      { code: 'D1', name: 'Strategic Alignment', score: 50, weight: 0.20, insights: ['Nice to have, not critical'] },
      { code: 'D2', name: 'Value Clarity', score: 40, weight: 0.25, insights: ['ROI not established'] },
      { code: 'D3', name: 'Technical Feasibility', score: 55, weight: 0.20, insights: ['Data quality concerns'] },
      { code: 'D4', name: 'Organizational Readiness', score: 42, weight: 0.20, insights: ['No resources allocated'] },
      { code: 'D5', name: 'Risk Awareness', score: 38, weight: 0.15, insights: ['Risks not assessed'] }
    ],
    flags: [
      { code: 'TM-1', name: 'Problem Misalignment', severity: 'critical', description: 'Stakeholders disagree on the problem being solved' },
      { code: 'TM-6', name: 'Capacity Illusion', severity: 'warning', description: 'Team already at capacity' }
    ],
    blindSpots: [
      { title: 'Sponsor Gap', description: 'No executive champion identified', severity: 'warning' }
    ]
  }
};

// Default assessment for unknown IDs
const DEFAULT_ASSESSMENT: Assessment = {
  id: 'default',
  title: 'Demo Assessment',
  ics: 76,
  recommendation: 'CLARIFY',
  dimensions: [
    { code: 'D1', name: 'Strategic Alignment', score: 82, weight: 0.20, insights: ['Aligned with company goals'] },
    { code: 'D2', name: 'Value Clarity', score: 74, weight: 0.25, insights: ['ROI documented'] },
    { code: 'D3', name: 'Technical Feasibility', score: 68, weight: 0.20, insights: ['Some technical challenges'] },
    { code: 'D4', name: 'Organizational Readiness', score: 71, weight: 0.20, insights: ['Change management needed'] },
    { code: 'D5', name: 'Risk Awareness', score: 85, weight: 0.15, insights: ['Risks identified'] }
  ],
  flags: [
    { code: 'TM-2', name: 'Value Not Quantified', severity: 'warning', description: 'Expected value lacks concrete metrics' }
  ],
  blindSpots: []
};

// =============================================================================
// COMPONENTS
// =============================================================================

function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ color }}>{score}</span>
        <span className="text-xs text-gray-400">ICS</span>
      </div>
    </div>
  );
}

function DimensionBar({ dimension }: { dimension: Assessment['dimensions'][0] }) {
  const [expanded, setExpanded] = useState(false);
  const color = dimension.score >= 75 ? 'bg-green-500' : dimension.score >= 50 ? 'bg-amber-500' : 'bg-red-500';
  
  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors">
        <div className="flex items-center gap-4 flex-1">
          <span className="text-sm font-mono text-gray-500 w-8">{dimension.code}</span>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium">{dimension.name}</span>
              <span className={`font-bold ${dimension.score >= 75 ? 'text-green-400' : dimension.score >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{dimension.score}</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${dimension.score}%` }} />
            </div>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 ml-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-800">
          <ul className="space-y-1 mt-3">
            {dimension.insights.map((insight, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <Lightbulb className="w-4 h-4 text-clarity-400 mt-0.5 flex-shrink-0" />
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function DemoResultsByIdPage() {
  const params = useParams();
  const id = params.id as string;
  const assessment = DEMO_ASSESSMENTS[id] || DEFAULT_ASSESSMENT;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(20,184,166,0.1),transparent_50%)]" />
      
      <header className="border-b border-gray-800 sticky top-0 bg-gray-950/80 backdrop-blur-xl z-10 no-print">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-clarity-500" />
            <span className="font-semibold">Assessment Results</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Link href="/demo/dashboard" className="text-sm text-gray-400 hover:text-white flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 relative z-10 no-print">
        {/* Assessment Header */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-sm text-gray-400 mb-1">Assessment Results</p>
              <h1 className="text-2xl font-bold mb-2">{assessment.title}</h1>
              <p className="text-gray-400">Investment Clarity Score Analysis</p>
            </div>
            <ScoreRing score={assessment.ics} />
          </div>
        </div>

        {/* Recommendation Banner */}
        <div className={`rounded-xl p-6 mb-6 ${
          assessment.recommendation === 'GO' ? 'bg-green-500/10 border border-green-500/30' :
          assessment.recommendation === 'CLARIFY' ? 'bg-amber-500/10 border border-amber-500/30' :
          'bg-red-500/10 border border-red-500/30'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
              assessment.recommendation === 'GO' ? 'bg-green-500/20' :
              assessment.recommendation === 'CLARIFY' ? 'bg-amber-500/20' :
              'bg-red-500/20'
            }`}>
              {assessment.recommendation === 'GO' && <CheckCircle className="w-7 h-7 text-green-400" />}
              {assessment.recommendation === 'CLARIFY' && <AlertTriangle className="w-7 h-7 text-amber-400" />}
              {assessment.recommendation === 'NO_GO' && <XCircle className="w-7 h-7 text-red-400" />}
            </div>
            <div>
              <span className={`text-2xl font-bold ${
                assessment.recommendation === 'GO' ? 'text-green-400' :
                assessment.recommendation === 'CLARIFY' ? 'text-amber-400' :
                'text-red-400'
              }`}>{assessment.recommendation.replace('_', '-')}</span>
              <p className="text-gray-300 mt-1">
                {assessment.recommendation === 'GO' && 'This initiative shows strong alignment and readiness. Proceed with confidence.'}
                {assessment.recommendation === 'CLARIFY' && 'Some items need attention before proceeding. Address the identified concerns.'}
                {assessment.recommendation === 'NO_GO' && 'Critical blockers identified. Do not proceed until resolved.'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dimension Scores */}
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-clarity-400" />
                Dimension Scores
              </h2>
              <div className="space-y-3">
                {assessment.dimensions.map(d => (
                  <DimensionBar key={d.code} dimension={d} />
                ))}
              </div>
            </section>

            {/* Blind Spots */}
            {assessment.blindSpots.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-clarity-400" />
                  Blind Spots Detected
                </h2>
                <div className="space-y-3">
                  {assessment.blindSpots.map((spot, i) => (
                    <div key={i} className="p-4 rounded-lg border bg-amber-500/10 border-amber-500/30">
                      <h3 className="font-medium mb-1">{spot.title}</h3>
                      <p className="text-sm text-gray-300">{spot.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Triggered Flags */}
            <section className="bg-gray-900 rounded-xl border border-gray-800 p-5">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-clarity-400" />
                Flags ({assessment.flags.length})
              </h2>
              {assessment.flags.length === 0 ? (
                <p className="text-sm text-gray-500">No flags triggered ✓</p>
              ) : (
                <div className="space-y-3">
                  {assessment.flags.map(flag => (
                    <div key={flag.code} className={`p-3 rounded-lg ${
                      flag.severity === 'critical' ? 'bg-red-500/10 border border-red-500/30' :
                      flag.severity === 'warning' ? 'bg-amber-500/10 border border-amber-500/30' :
                      'bg-blue-500/10 border border-blue-500/30'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-gray-500">{flag.code}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          flag.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                          flag.severity === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>{flag.severity}</span>
                      </div>
                      <p className="font-medium text-sm">{flag.name}</p>
                      <p className="text-xs text-gray-400 mt-1">{flag.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Participants */}
            <section className="bg-gray-900 rounded-xl border border-gray-800 p-5">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-clarity-400" />
                Participants
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Completed</span>
                  <span className="text-green-400">3/3</span>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/demo/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
          <Link href="/demo">
            <Button>Explore Demo</Button>
          </Link>
        </div>
      </main>

      {/* Print-optimized layout */}
      <div className="hidden print:block">
        <div className="print-header">
          <div>
            <h1>ELVAIT Assessment Report</h1>
            <p className="subtitle">{assessment.title}</p>
          </div>
          <div className="text-right">
            <p className="subtitle">{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="print-section">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16pt' }}>
            <div className={`print-recommendation ${assessment.recommendation.toLowerCase().replace('_', '')}`}>
              <h3>{assessment.recommendation.replace('_', '-')}</h3>
              <p>{assessment.recommendation === 'GO' ? 'Ready to Proceed' : assessment.recommendation === 'CLARIFY' ? 'Action Required' : 'Do Not Proceed'}</p>
            </div>
            <div className="print-ics">
              <div className="score">{assessment.ics}</div>
              <div>/100</div>
              <div className="label">Investment Clarity Score</div>
            </div>
          </div>
        </div>

        <div className="print-section">
          <h2>Dimension Scores</h2>
          <div className="print-dimensions">
            {assessment.dimensions.map(d => (
              <div key={d.code} className="print-dimension">
                <div className="name">{d.name}</div>
                <div className="score">{d.score}<span style={{ fontSize: '10pt', fontWeight: 'normal' }}>/100</span></div>
                <div className="print-score-bar">
                  <div className={`fill ${d.score >= 75 ? 'high' : d.score >= 50 ? 'medium' : 'low'}`} style={{ width: `${d.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {assessment.blindSpots.length > 0 && (
          <div className="print-section">
            <h2>Blind Spots Detected</h2>
            {assessment.blindSpots.map((spot, i) => (
              <div key={i} style={{ marginBottom: '10pt', paddingLeft: '8pt', borderLeft: '3pt solid #f59e0b' }}>
                <strong>{spot.title}</strong>
                <p style={{ fontSize: '9pt', marginTop: '4pt' }}>{spot.description}</p>
              </div>
            ))}
          </div>
        )}

        {assessment.flags.length > 0 && (
          <div className="print-section">
            <h2>Triggered Flags ({assessment.flags.length})</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6pt' }}>
              {assessment.flags.map(flag => (
                <span key={flag.code} className={`print-flag ${flag.severity}`}>
                  {flag.code}: {flag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="print-footer">
          <p>Generated by ELVAIT • {new Date().toLocaleString()} • Demo Assessment</p>
          <p style={{ marginTop: '4pt' }}>Confidential — For authorized stakeholders only</p>
        </div>
      </div>
    </div>
  );
}
