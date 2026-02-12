'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Brain, Loader2, AlertCircle, Download,
  CheckCircle, AlertTriangle, XCircle, TrendingUp,
  Users, Target, Shield, Briefcase, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BlindSpot {
  label: string;
  explanation: string;
  whoSeesIt: string[];
  whoDoesnt: string[];
  severity: 'CRITICAL' | 'WARN' | 'INFO';
  rank: number;
}

interface ChecklistItem {
  id: string;
  prompt: string;
  responsibleRole: string;
  status: string;
  priority: number;
}

interface Flag {
  flag_id: string;
  severity: 'CRITICAL' | 'WARN' | 'INFO';
  evidence: {
    description?: string;
  };
}

interface ResultsData {
  caseId: string;
  variant: string;
  ics: {
    value: number | null;
    label: string | null;
    breakdown: Record<string, { score: number | null; weight: number; contribution: number | null }>;
  };
  recommendation: {
    value: 'GO' | 'CLARIFY' | 'NO_GO' | null;
    reason: string;
    factors: string[];
  };
  dimensions: {
    case: Record<string, number | null>;
    byRole: Record<string, Record<string, number | null>>;
  };
  flags: {
    items: Flag[];
    counts: { critical: number; warn: number; info: number; total: number };
    hasCritical: boolean;
  };
  gates: {
    items: Array<{ gate: string; action: string; flag?: string }>;
    hasGates: boolean;
  };
  blindSpots: BlindSpot[];
  checklistItems: ChecklistItem[];
  narrative: {
    executive: string;
    keyFindings: string[];
    riskSummary: string;
    nextSteps: string;
    boardNarrative: string;
  };
  process: {
    score: number;
    readiness: string;
  } | null;
  generatedAt: string;
  responseCount: number;
  participantCount: number;
}

const DIMENSION_LABELS: Record<string, { label: string; icon: typeof Target }> = {
  D1: { label: 'Strategic Intent', icon: Target },
  D2: { label: 'Value & Economics', icon: TrendingUp },
  D3: { label: 'Organizational Readiness', icon: Users },
  D4: { label: 'Risk & Dependencies', icon: Shield },
  D5: { label: 'Decision Governance', icon: Briefcase },
  P: { label: 'Process Readiness', icon: Settings }
};

const ROLE_LABELS: Record<string, string> = {
  EXEC: 'Executive',
  BUSINESS_OWNER: 'Business Owner',
  TECH_OWNER: 'Technical Owner',
  USER: 'Functional User',
  PROCESS_OWNER: 'Process Owner'
};

export default function ResultsPage() {
  const params = useParams();
  const [results, setResults] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/cases/${params.id}/results`);
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to load results');
        }
        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-clarity-600 mx-auto mb-4" />
          <p className="text-gray-600">Analyzing responses...</p>
        </div>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center max-w-md px-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Unable to Generate Results</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Link href={`/cases/${params.id}`}>
            <Button variant="outline">Back to Case</Button>
          </Link>
        </div>
      </div>
    );
  }

  const rec = results.recommendation.value;
  const ics = results.ics.value;

  const RecommendationBadge = () => {
    if (rec === 'GO') {
      return (
        <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border-2 border-green-200 dark:border-green-800">
          <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-green-700 dark:text-green-400">GO</h2>
            <p className="text-green-600 dark:text-green-500">Ready to Proceed</p>
          </div>
        </div>
      );
    }
    if (rec === 'CLARIFY') {
      return (
        <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border-2 border-amber-200 dark:border-amber-800">
          <div className="w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-amber-700 dark:text-amber-400">CLARIFY</h2>
            <p className="text-amber-600 dark:text-amber-500">Action Required</p>
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border-2 border-red-200 dark:border-red-800">
        <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center">
          <XCircle className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-red-700 dark:text-red-400">NO-GO</h2>
          <p className="text-red-600 dark:text-red-500">Do Not Proceed</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href={`/cases/${params.id}`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Case</span>
          </Link>
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-clarity-600" />
            <span className="font-semibold">Assessment Results</span>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Top Summary */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Recommendation */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-sm font-medium text-gray-500 mb-4">RECOMMENDATION</h2>
            <RecommendationBadge />
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">{results.recommendation.reason}</p>
          </div>

          {/* ICS Score */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-sm font-medium text-gray-500 mb-4">INVESTMENT CLARITY SCORE</h2>
            <div className="flex items-end gap-4">
              <div className="text-5xl font-bold text-clarity-600">
                {ics !== null ? ics.toFixed(0) : 'N/A'}
              </div>
              <div className="pb-2">
                <span className="text-gray-400">/100</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">{results.ics.label}</p>
              </div>
            </div>
            <div className="mt-4 h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${
                  ics !== null && ics >= 75 ? 'bg-green-500' :
                  ics !== null && ics >= 55 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${ics ?? 0}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0</span>
              <span>55</span>
              <span>75</span>
              <span>100</span>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Executive Summary</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{results.narrative.executive}</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Key Findings</h3>
              <ul className="space-y-2">
                {results.narrative.keyFindings.map((finding, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-clarity-600">•</span>
                    {finding}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Next Steps</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{results.narrative.nextSteps}</p>
            </div>
          </div>
        </div>

        {/* Dimension Scores */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Dimension Scores</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(results.dimensions.case).map(([dim, score]) => {
              if (dim === 'P' && score === null) return null;
              const config = DIMENSION_LABELS[dim];
              if (!config) return null;
              const Icon = config.icon;
              
              return (
                <div key={dim} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-clarity-600" />
                    <span className="text-sm font-medium">{config.label}</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">{score?.toFixed(0) ?? 'N/A'}</span>
                    <span className="text-gray-400 text-sm pb-1">/100</span>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        score !== null && score >= 75 ? 'bg-green-500' :
                        score !== null && score >= 50 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${score ?? 0}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Blind Spots */}
        {results.blindSpots.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Blind Spots & Risks</h2>
            <div className="space-y-4">
              {results.blindSpots.map((spot, i) => (
                <div 
                  key={i} 
                  className={`p-4 rounded-lg border-l-4 ${
                    spot.severity === 'CRITICAL' 
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-500' 
                      : spot.severity === 'WARN'
                        ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-500'
                        : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{spot.label}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{spot.explanation}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      spot.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                      spot.severity === 'WARN' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {spot.severity}
                    </span>
                  </div>
                  {(spot.whoSeesIt.length > 0 || spot.whoDoesnt.length > 0) && (
                    <div className="mt-3 flex gap-4 text-xs">
                      {spot.whoSeesIt.length > 0 && (
                        <span className="text-gray-500">
                          Sees it: {spot.whoSeesIt.map(r => ROLE_LABELS[r] || r).join(', ')}
                        </span>
                      )}
                      {spot.whoDoesnt.length > 0 && (
                        <span className="text-gray-500">
                          Doesn't see it: {spot.whoDoesnt.map(r => ROLE_LABELS[r] || r).join(', ')}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Checklist */}
        {results.checklistItems.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Action Checklist</h2>
            <div className="space-y-3">
              {results.checklistItems.map((item, i) => (
                <div key={item.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-clarity-100 dark:bg-clarity-900 flex items-center justify-center text-sm font-medium text-clarity-600">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{item.prompt}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Responsible: {ROLE_LABELS[item.responsibleRole] || item.responsibleRole}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Flags */}
        {results.flags.items.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold mb-4">
              Detected Signals 
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({results.flags.counts.critical} critical, {results.flags.counts.warn} warnings)
              </span>
            </h2>
            <div className="space-y-2">
              {results.flags.items.slice(0, 10).map((flag, i) => (
                <div key={i} className="flex items-center gap-3 p-2 text-sm">
                  <span className={`w-2 h-2 rounded-full ${
                    flag.severity === 'CRITICAL' ? 'bg-red-500' :
                    flag.severity === 'WARN' ? 'bg-amber-500' : 'bg-blue-500'
                  }`} />
                  <span className="font-mono text-xs text-gray-500">{flag.flag_id}</span>
                  {flag.evidence.description && (
                    <span className="text-gray-600 dark:text-gray-400 truncate">
                      — {flag.evidence.description}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Meta */}
        <div className="mt-8 text-center text-sm text-gray-400">
          Generated {new Date(results.generatedAt).toLocaleString()} • 
          {results.responseCount} responses from {results.participantCount} participants
        </div>
      </main>
    </div>
  );
}
