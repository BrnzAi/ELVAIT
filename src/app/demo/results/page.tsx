'use client';
import Image from 'next/image';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, CheckCircle, AlertTriangle, XCircle,
  TrendingUp, Users, Target, Shield, Lightbulb, FileText,
  ChevronDown, ChevronRight, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportToPDF, PDFExportData } from '@/lib/pdf-export';

// =============================================================================
// DEMO RESULTS DATA
// =============================================================================

interface DimensionScore {
  name: string;
  code: string;
  score: number;
  weight: number;
  description: string;
  insights: string[];
}

interface Flag {
  code: string;
  name: string;
  severity: 'critical' | 'warning' | 'info';
  description: string;
  triggered: boolean;
}

const DIMENSION_SCORES: DimensionScore[] = [
  {
    name: 'Strategic Alignment',
    code: 'D1',
    score: 82,
    weight: 0.20,
    description: 'Alignment with organizational strategy and objectives',
    insights: ['Strong executive sponsorship identified', 'Clear connection to revenue goals', 'Some stakeholders unclear on success metrics']
  },
  {
    name: 'Value Clarity',
    code: 'D2',
    score: 74,
    weight: 0.25,
    description: 'Clarity of expected benefits and value proposition',
    insights: ['ROI documented but assumptions need validation', 'Baseline metrics exist for comparison', 'Value ownership could be clearer']
  },
  {
    name: 'Organizational Readiness',
    code: 'D3',
    score: 68,
    weight: 0.20,
    description: 'Capacity and capability to execute',
    insights: ['Technical team has relevant experience', 'Some resource conflicts identified', 'Change management plan needed']
  },
  {
    name: 'Risk Awareness',
    code: 'D4',
    score: 71,
    weight: 0.20,
    description: 'Understanding and mitigation of risks',
    insights: ['Integration risks acknowledged', 'Timeline risks underestimated', 'Vendor dependency not fully addressed']
  },
  {
    name: 'Accountability',
    code: 'D5',
    score: 85,
    weight: 0.15,
    description: 'Clear ownership and decision-making authority',
    insights: ['Executive sponsor identified', 'RACI defined for core roles', 'Escalation path established']
  }
];

const FLAGS: Flag[] = [
  { code: 'TM-1', name: 'Misaligned on Problem', severity: 'info', description: 'Stakeholders have different views on the core problem', triggered: false },
  { code: 'TM-2', name: 'Value Not Quantified', severity: 'warning', description: 'Expected value lacks concrete metrics', triggered: true },
  { code: 'TM-3', name: 'No Accountability Owner', severity: 'critical', description: 'No single person accountable for outcomes', triggered: false },
  { code: 'TM-4', name: 'Resource Conflict', severity: 'warning', description: 'Initiative competes with other priorities', triggered: true },
  { code: 'TM-5', name: 'Technical Debt Risk', severity: 'info', description: 'Legacy systems may complicate integration', triggered: true },
  { code: 'TM-6', name: 'Change Resistance', severity: 'info', description: 'End users express concerns about adoption', triggered: false },
];

const BLIND_SPOTS = [
  {
    title: 'Timeline Optimism Gap',
    description: 'Business and technical owners have a 40% variance in expected timeline. Technical team estimates 6 months; business expects 4 months.',
    severity: 'warning'
  },
  {
    title: 'Training Requirements Unclear',
    description: 'No responses addressed user training or change management support needs.',
    severity: 'info'
  }
];

const CHECKLIST = [
  { item: 'Validate ROI assumptions with finance team', completed: false, priority: 'high' },
  { item: 'Align timeline expectations across stakeholders', completed: false, priority: 'high' },
  { item: 'Define clear success metrics with owners', completed: true, priority: 'medium' },
  { item: 'Document resource allocation plan', completed: false, priority: 'medium' },
  { item: 'Create change management communication plan', completed: false, priority: 'low' },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function calculateICS(): number {
  return Math.round(
    DIMENSION_SCORES.reduce((sum, d) => sum + (d.score * d.weight), 0)
  );
}

function getRecommendation(ics: number, flags: Flag[]): 'GO' | 'CLARIFY' | 'NO_GO' {
  const criticalFlags = flags.filter(f => f.triggered && f.severity === 'critical').length;
  if (criticalFlags > 0 || ics < 50) return 'NO_GO';
  if (ics >= 75 && criticalFlags === 0) return 'GO';
  return 'CLARIFY';
}

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
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ color }}>{score}</span>
        <span className="text-xs text-gray-400">ICS</span>
      </div>
    </div>
  );
}

function DimensionBar({ dimension }: { dimension: DimensionScore }) {
  const [expanded, setExpanded] = useState(false);
  const color = dimension.score >= 75 ? 'bg-green-500' : dimension.score >= 50 ? 'bg-amber-500' : 'bg-red-500';
  
  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-4 flex-1">
          <span className="text-sm font-mono text-gray-500 w-8">{dimension.code}</span>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium">{dimension.name}</span>
              <span className={`font-bold ${dimension.score >= 75 ? 'text-green-400' : dimension.score >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                {dimension.score}
              </span>
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
          <p className="text-sm text-gray-400 mt-3 mb-3">{dimension.description}</p>
          <p className="text-xs text-gray-500 mb-2">Key Insights:</p>
          <ul className="space-y-1">
            {dimension.insights.map((insight, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <Lightbulb className="w-4 h-4 text-elvait-green mt-0.5 flex-shrink-0" />
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

export default function DemoResultsPage() {
  const [roleLabel, setRoleLabel] = useState('Participant');
  const ics = calculateICS();
  const recommendation = getRecommendation(ics, FLAGS);
  const triggeredFlags = FLAGS.filter(f => f.triggered);

  useEffect(() => {
    const storedUser = localStorage.getItem('demoUser');
    if (storedUser === 'business') setRoleLabel('Business Owner');
    else if (storedUser === 'tech') setRoleLabel('Technical Owner');
    else if (storedUser === 'user') setRoleLabel('End User');
    else if (storedUser === 'process') setRoleLabel('Process Owner');
    else if (storedUser === 'exec') setRoleLabel('Executive');
    else if (storedUser === 'admin') setRoleLabel('Admin');
  }, []);

  return (
    <div className="min-h-screen bg-elvait-black text-white">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(20,184,166,0.1),transparent_50%)]" />
      
      <header className="border-b border-gray-800 sticky top-0 bg-elvait-black/80 backdrop-blur-xl z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo-grey.jpg" alt="ELVAIT" width={24} height={24} className="h-6 w-auto" />
            <span className="font-semibold">Assessment Results</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => {
              const pdfData: PDFExportData = {
                title: 'Marketing Automation Platform',
                recommendation,
                ics,
                dimensions: DIMENSION_SCORES.map(d => ({
                  code: d.code,
                  name: d.name,
                  score: d.score
                })),
                flags: triggeredFlags.map(f => ({
                  code: f.code,
                  name: f.name,
                  severity: f.severity
                })),
                blindSpots: BLIND_SPOTS.map(b => ({
                  title: b.title,
                  description: b.description,
                  severity: b.severity
                })),
                checklist: CHECKLIST.map(c => ({
                  item: c.item,
                  priority: c.priority,
                  completed: c.completed
                }))
              };
              exportToPDF(pdfData);
            }}>
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Link href="/demo/survey" className="text-sm text-gray-400 hover:text-white flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Back to Survey
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 relative z-10">
        {/* Assessment Header */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-sm text-gray-400 mb-1">Assessment for</p>
              <h1 className="text-2xl font-bold mb-2">Marketing Automation Platform</h1>
              <p className="text-gray-400">Completed as {roleLabel} • Demo Results</p>
            </div>
            <ScoreRing score={ics} />
          </div>
        </div>

        {/* Recommendation Banner */}
        <div className={`rounded-xl p-6 mb-6 ${
          recommendation === 'GO' ? 'bg-green-500/10 border border-green-500/30' :
          recommendation === 'CLARIFY' ? 'bg-amber-500/10 border border-amber-500/30' :
          'bg-red-500/10 border border-red-500/30'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
              recommendation === 'GO' ? 'bg-green-500/20' :
              recommendation === 'CLARIFY' ? 'bg-amber-500/20' :
              'bg-red-500/20'
            }`}>
              {recommendation === 'GO' && <CheckCircle className="w-7 h-7 text-green-400" />}
              {recommendation === 'CLARIFY' && <AlertTriangle className="w-7 h-7 text-amber-400" />}
              {recommendation === 'NO_GO' && <XCircle className="w-7 h-7 text-red-400" />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-2xl font-bold ${
                  recommendation === 'GO' ? 'text-green-400' :
                  recommendation === 'CLARIFY' ? 'text-amber-400' :
                  'text-red-400'
                }`}>{recommendation.replace('_', '-')}</span>
              </div>
              <p className="text-gray-300">
                {recommendation === 'GO' && 'This initiative shows strong alignment and readiness. Proceed with confidence.'}
                {recommendation === 'CLARIFY' && 'Some items need attention before proceeding. Address the identified concerns.'}
                {recommendation === 'NO_GO' && 'Critical blockers identified. Do not proceed until resolved.'}
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
                <TrendingUp className="w-5 h-5 text-elvait-green" />
                Dimension Scores
              </h2>
              <div className="space-y-3">
                {DIMENSION_SCORES.map(d => (
                  <DimensionBar key={d.code} dimension={d} />
                ))}
              </div>
            </section>

            {/* Blind Spots */}
            {BLIND_SPOTS.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-elvait-green" />
                  Blind Spots Detected
                </h2>
                <div className="space-y-3">
                  {BLIND_SPOTS.map((spot, i) => (
                    <div key={i} className={`p-4 rounded-lg border ${
                      spot.severity === 'warning' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-elvait-green/50/10 border-blue-500/30'
                    }`}>
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
                <Shield className="w-5 h-5 text-elvait-green" />
                Flags ({triggeredFlags.length})
              </h2>
              {triggeredFlags.length === 0 ? (
                <p className="text-sm text-gray-500">No flags triggered</p>
              ) : (
                <div className="space-y-3">
                  {triggeredFlags.map(flag => (
                    <div key={flag.code} className={`p-3 rounded-lg ${
                      flag.severity === 'critical' ? 'bg-red-500/10 border border-red-500/30' :
                      flag.severity === 'warning' ? 'bg-amber-500/10 border border-amber-500/30' :
                      'bg-elvait-green/50/10 border border-blue-500/30'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-gray-500">{flag.code}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          flag.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                          flag.severity === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-elvait-green/10 text-elvait-green'
                        }`}>{flag.severity}</span>
                      </div>
                      <p className="font-medium text-sm">{flag.name}</p>
                      <p className="text-xs text-gray-400 mt-1">{flag.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Checklist */}
            <section className="bg-gray-900 rounded-xl border border-gray-800 p-5">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-elvait-green" />
                Action Checklist
              </h2>
              <div className="space-y-2">
                {CHECKLIST.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      item.completed ? 'border-green-500 bg-green-500/20' : 'border-gray-600'
                    }`}>
                      {item.completed && <CheckCircle className="w-3 h-3 text-green-400" />}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${item.completed ? 'text-gray-500 line-through' : ''}`}>{item.item}</p>
                      <span className={`text-xs ${
                        item.priority === 'high' ? 'text-red-400' :
                        item.priority === 'medium' ? 'text-amber-400' :
                        'text-gray-500'
                      }`}>{item.priority} priority</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Participant Summary */}
            <section className="bg-gray-900 rounded-xl border border-gray-800 p-5">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-elvait-green" />
                Participants
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Invited</span>
                  <span>5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Completed</span>
                  <span className="text-green-400">4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Pending</span>
                  <span className="text-amber-400">1</span>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/demo/login">
            <Button variant="outline">Try Another Role</Button>
          </Link>
          <Link href="/demo">
            <Button>Explore Full Demo</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
