'use client';

import Link from 'next/link';
import { ArrowLeft, CheckCircle, AlertTriangle, Download, Share2 } from 'lucide-react';

// Sample demo data - showing a "FIX FIRST" result
const demoData = {
  assessment: {
    name: 'Order Processing Automation',
    description: 'Evaluation of automating the order-to-fulfillment process',
    createdAt: '2026-02-08',
    completedAt: '2026-02-09',
  },
  score: 62,
  outcome: 'fix_first',
  dimensionScores: {
    processClarity: 68,
    outcomeClarity: 45,
    stakeholderAlignment: 72,
    dataReadiness: 55,
    technicalFeasibility: 82,
    changeReadiness: 65,
  },
  contradictions: [
    {
      type: 'goal_mismatch',
      severity: 'critical',
      title: 'Success Definition Gap',
      executive: 'Reduce processing time by 50%',
      user: 'Eliminate manual data entry',
      insight: 'These may not be the same goal — time reduction vs. effort reduction',
    },
    {
      type: 'process_disagreement',
      severity: 'high',
      title: 'Process Complexity Mismatch',
      executive: '5 main steps',
      user: '12 steps plus workarounds for exceptions',
      insight: 'True process may be significantly more complex than documented',
    },
    {
      type: 'timeline_conflict',
      severity: 'medium',
      title: 'Timeline Expectation Gap',
      executive: 'Live by Q2',
      user: '6-9 months minimum for integration',
      insight: 'Alignment needed on realistic delivery timeline',
    },
  ],
  risks: [
    {
      category: 'process',
      likelihood: 'high',
      impact: 'high',
      description: 'Undocumented exceptions may cause scope creep',
      mitigation: 'Process mapping workshop with end users before proceeding',
    },
    {
      category: 'people',
      likelihood: 'medium',
      impact: 'high',
      description: 'Misaligned success metrics may cause stakeholder disappointment',
      mitigation: 'Alignment session to agree on measurable outcomes',
    },
  ],
  recommendations: {
    summary: 'Address 3 critical gaps before proceeding with automation',
    actions: [
      'Conduct stakeholder alignment workshop to agree on success definition',
      'Map the actual process including all workarounds and exceptions',
      'Reconcile timeline expectations between executive and technical teams',
      'Define clear, measurable KPIs that all parties agree on',
    ],
    automationApproach: 'Re-assess after gaps are addressed. Process complexity suggests workflow automation over simple RPA.',
  },
  participants: [
    { role: 'Executive Sponsor', status: 'completed', completedAt: '2026-02-08 14:30' },
    { role: 'Business Owner', status: 'completed', completedAt: '2026-02-08 15:45' },
    { role: 'Technical Owner', status: 'completed', completedAt: '2026-02-09 09:15' },
    { role: 'End User (x3)', status: 'completed', completedAt: '2026-02-09 10:00' },
  ],
};

const dimensionLabels: Record<string, string> = {
  processClarity: 'Process Clarity',
  outcomeClarity: 'Outcome Clarity',
  stakeholderAlignment: 'Stakeholder Alignment',
  dataReadiness: 'Data Readiness',
  technicalFeasibility: 'Technical Feasibility',
  changeReadiness: 'Change Readiness',
};

function ScoreGauge({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;
  
  let color = 'text-go';
  if (score < 80) color = 'text-fixfirst';
  if (score < 40) color = 'text-nogo';

  return (
    <div className="relative w-40 h-40">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="80"
          cy="80"
          r="45"
          stroke="currentColor"
          strokeWidth="10"
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        <circle
          cx="80"
          cy="80"
          r="45"
          stroke="currentColor"
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${color} transition-all duration-1000 ease-out`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-4xl font-bold">{score}</span>
      </div>
    </div>
  );
}

function DimensionBar({ label, score }: { label: string; score: number }) {
  let color = 'bg-go';
  if (score < 80) color = 'bg-fixfirst';
  if (score < 60) color = 'bg-amber-400';
  if (score < 40) color = 'bg-nogo';

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-medium">{score}%</span>
      </div>
      <div className="progress-bar">
        <div 
          className={`progress-fill ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/mvp" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-bold text-lg">{demoData.assessment.name}</h1>
              <p className="text-sm text-gray-500">Demo Results</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-clarity-600 text-white rounded-lg hover:bg-clarity-700">
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Score Overview */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-800 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <ScoreGauge score={demoData.score} />
            
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-fixfirst/10 text-fixfirst rounded-full text-lg font-semibold mb-4">
                <AlertTriangle className="w-5 h-5" />
                🟡 FIX FIRST
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                {demoData.recommendations.summary}
              </p>
            </div>

            <div className="text-center md:text-right text-sm text-gray-500">
              <p>Completed: {demoData.assessment.completedAt}</p>
              <p>{demoData.participants.length} participants</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Dimensions & Contradictions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Dimension Scores */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold mb-6">Clarity Dimensions</h2>
              <div className="space-y-5">
                {Object.entries(demoData.dimensionScores).map(([key, score]) => (
                  <DimensionBar 
                    key={key} 
                    label={dimensionLabels[key]} 
                    score={score} 
                  />
                ))}
              </div>
            </div>

            {/* Contradictions */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold mb-6">
                ⚠️ {demoData.contradictions.length} Contradictions Detected
              </h2>
              <div className="space-y-6">
                {demoData.contradictions.map((c, i) => (
                  <div 
                    key={i} 
                    className={`p-4 rounded-xl border-2 ${
                      c.severity === 'critical' ? 'border-nogo/30 bg-nogo/5' :
                      c.severity === 'high' ? 'border-fixfirst/30 bg-fixfirst/5' :
                      'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${
                        c.severity === 'critical' ? 'bg-nogo/20 text-nogo' :
                        c.severity === 'high' ? 'bg-fixfirst/20 text-fixfirst' :
                        'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}>
                        {c.severity}
                      </span>
                      <h3 className="font-semibold">{c.title}</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mb-3 text-sm">
                      <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <span className="text-gray-500 text-xs">Executive says:</span>
                        <p className="font-medium">"{c.executive}"</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <span className="text-gray-500 text-xs">Users say:</span>
                        <p className="font-medium">"{c.user}"</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      → {c.insight}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Risks */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold mb-6">Risk Register</h2>
              <div className="space-y-4">
                {demoData.risks.map((risk, i) => (
                  <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        risk.likelihood === 'high' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {risk.likelihood} likelihood
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        risk.impact === 'high' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {risk.impact} impact
                      </span>
                    </div>
                    <p className="font-medium mb-2">{risk.description}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Mitigation:</strong> {risk.mitigation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Actions & Participants */}
          <div className="space-y-8">
            {/* Recommended Actions */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold mb-6">Recommended Actions</h2>
              <div className="space-y-3">
                {demoData.recommendations.actions.map((action, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-clarity-50 dark:bg-clarity-900/30 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-clarity-500 text-white flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-sm">{action}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <h4 className="font-medium mb-2">Automation Approach</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {demoData.recommendations.automationApproach}
                </p>
              </div>
            </div>

            {/* Participants */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold mb-6">Participants</h2>
              <div className="space-y-3">
                {demoData.participants.map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-go" />
                      <span className="font-medium">{p.role}</span>
                    </div>
                    <span className="text-xs text-gray-500">{p.completedAt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-clarity-600 to-clarity-700 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-2">Ready to assess your process?</h3>
              <p className="text-white/80 text-sm mb-4">
                Start your own clarity assessment in minutes.
              </p>
              <Link 
                href="/mvp/start"
                className="block text-center py-3 bg-white text-clarity-700 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Start Free Assessment
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
