'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Brain, Plus, Users, BarChart3, Clock, CheckCircle, 
  AlertTriangle, XCircle, ArrowRight, Eye, MoreVertical,
  FileText, TrendingUp, Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// =============================================================================
// DEMO DATA
// =============================================================================

interface DemoAssessment {
  id: string;
  title: string;
  variant: string;
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED';
  recommendation: 'GO' | 'CLARIFY' | 'NO_GO' | null;
  ics: number | null;
  participantsCompleted: number;
  participantsTotal: number;
  createdAt: string;
  completedAt: string | null;
}

const DEMO_ASSESSMENTS: DemoAssessment[] = [
  {
    id: '1',
    title: 'Customer Service AI Automation',
    variant: 'CORE',
    status: 'COMPLETED',
    recommendation: 'GO',
    ics: 87,
    participantsCompleted: 3,
    participantsTotal: 3,
    createdAt: '2026-02-05',
    completedAt: '2026-02-08'
  },
  {
    id: '2',
    title: 'ERP System Modernization',
    variant: 'FULL',
    status: 'COMPLETED',
    recommendation: 'NO_GO',
    ics: 72,
    participantsCompleted: 4,
    participantsTotal: 4,
    createdAt: '2026-02-01',
    completedAt: '2026-02-06'
  },
  {
    id: '3',
    title: 'Marketing Automation Platform',
    variant: 'CORE',
    status: 'ACTIVE',
    recommendation: null,
    ics: null,
    participantsCompleted: 2,
    participantsTotal: 3,
    createdAt: '2026-02-10',
    completedAt: null
  },
  {
    id: '4',
    title: 'Data Lake Implementation',
    variant: 'CORE',
    status: 'COMPLETED',
    recommendation: 'CLARIFY',
    ics: 68,
    participantsCompleted: 3,
    participantsTotal: 3,
    createdAt: '2026-01-28',
    completedAt: '2026-02-02'
  },
  {
    id: '5',
    title: 'Process Mining Tool',
    variant: 'QUICK_CHECK',
    status: 'DRAFT',
    recommendation: null,
    ics: null,
    participantsCompleted: 0,
    participantsTotal: 1,
    createdAt: '2026-02-11',
    completedAt: null
  }
];

// =============================================================================
// COMPONENTS
// =============================================================================

function StatCard({ icon: Icon, label, value, trend }: { 
  icon: typeof BarChart3; 
  label: string; 
  value: string | number;
  trend?: { value: number; positive: boolean };
}) {
  return (
    <div className="bg-white rounded-xl p-5 border border-brand-grey-medium">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 bg-brand-grey-light rounded-lg">
          <Icon className="w-5 h-5 text-brand-green" />
        </div>
        {trend && (
          <span className={`text-xs font-medium ${trend.positive ? 'text-green-400' : 'text-red-400'}`}>
            {trend.positive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-brand-grey">{label}</p>
    </div>
  );
}

function AssessmentRow({ assessment }: { assessment: DemoAssessment }) {
  const getStatusBadge = () => {
    switch (assessment.status) {
      case 'COMPLETED':
        return <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">Completed</span>;
      case 'ACTIVE':
        return <span className="px-2 py-0.5 bg-brand-green/10 text-brand-green rounded text-xs">Active</span>;
      default:
        return <span className="px-2 py-0.5 bg-gray-500/20 text-brand-grey rounded text-xs">Draft</span>;
    }
  };

  const getRecommendationBadge = () => {
    if (!assessment.recommendation) return null;
    switch (assessment.recommendation) {
      case 'GO':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">
            <CheckCircle className="w-3 h-3" /> GO
          </span>
        );
      case 'CLARIFY':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs">
            <AlertTriangle className="w-3 h-3" /> CLARIFY
          </span>
        );
      case 'NO_GO':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs">
            <XCircle className="w-3 h-3" /> NO-GO
          </span>
        );
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white/50 hover:bg-white rounded-xl border border-brand-grey-medium transition-colors">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          assessment.recommendation === 'GO' ? 'bg-green-500/20' :
          assessment.recommendation === 'CLARIFY' ? 'bg-amber-500/20' :
          assessment.recommendation === 'NO_GO' ? 'bg-red-500/20' :
          'bg-brand-grey-light'
        }`}>
          <FileText className={`w-5 h-5 ${
            assessment.recommendation === 'GO' ? 'text-green-400' :
            assessment.recommendation === 'CLARIFY' ? 'text-amber-400' :
            assessment.recommendation === 'NO_GO' ? 'text-red-400' :
            'text-brand-grey'
          }`} />
        </div>
        <div>
          <h3 className="font-medium">{assessment.title}</h3>
          <div className="flex items-center gap-3 mt-1">
            {getStatusBadge()}
            <span className="text-xs text-brand-grey">{assessment.variant}</span>
            <span className="text-xs text-brand-grey">
              {assessment.participantsCompleted}/{assessment.participantsTotal} participants
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {assessment.ics !== null && (
          <div className="text-right">
            <p className="font-bold">{assessment.ics}</p>
            <p className="text-xs text-brand-grey">ICS Score</p>
          </div>
        )}
        {getRecommendationBadge()}
        <Link href={`/demo/results/${assessment.id}`}>
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
        </Link>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function DemoDashboardPage() {
  const [userName, setUserName] = useState('Emma Executive');

  useEffect(() => {
    const storedUser = localStorage.getItem('demoUser');
    if (storedUser === 'exec') {
      setUserName('Emma Executive');
    }
  }, []);

  const completedCount = DEMO_ASSESSMENTS.filter(a => a.status === 'COMPLETED').length;
  const goCount = DEMO_ASSESSMENTS.filter(a => a.recommendation === 'GO').length;
  const clarifyCount = DEMO_ASSESSMENTS.filter(a => a.recommendation === 'CLARIFY').length;
  const nogoCount = DEMO_ASSESSMENTS.filter(a => a.recommendation === 'NO_GO').length;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-brand-grey-medium sticky top-0 bg-black z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-brand-green" />
            <span className="font-bold text-lg text-brand-green">ELVAIT</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/demo/login">
              <Button variant="outline" size="sm">
                Switch User
              </Button>
            </Link>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-grey-light rounded-lg">
              <span className="text-2xl">👔</span>
              <div>
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-brand-grey">Executive Sponsor</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {userName.split(' ')[0]} 👋</h1>
          <p className="text-brand-grey">Here's an overview of your clarity assessments</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard 
            icon={FileText} 
            label="Total Assessments" 
            value={DEMO_ASSESSMENTS.length}
          />
          <StatCard 
            icon={CheckCircle} 
            label="GO Decisions" 
            value={goCount}
            trend={{ value: 20, positive: true }}
          />
          <StatCard 
            icon={AlertTriangle} 
            label="Need Clarification" 
            value={clarifyCount}
          />
          <StatCard 
            icon={XCircle} 
            label="NO-GO Decisions" 
            value={nogoCount}
          />
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Your Assessments</h2>
          <Link href="/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Assessment
            </Button>
          </Link>
        </div>

        {/* Assessments List */}
        <div className="space-y-3">
          {DEMO_ASSESSMENTS.map(assessment => (
            <AssessmentRow key={assessment.id} assessment={assessment} />
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="bg-white rounded-xl border border-brand-grey-medium divide-y divide-gray-800">
            <div className="p-4 flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm"><strong>Customer Service AI</strong> assessment completed with GO recommendation</p>
                <p className="text-xs text-brand-grey">2 hours ago</p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-brand-green" />
              </div>
              <div className="flex-1">
                <p className="text-sm"><strong>Brian Business</strong> completed their survey for Marketing Automation</p>
                <p className="text-xs text-brand-grey">4 hours ago</p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm"><strong>Data Lake</strong> assessment flagged for ownership diffusion</p>
                <p className="text-xs text-brand-grey">Yesterday</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to demo */}
        <div className="mt-8 text-center">
          <Link href="/demo/login" className="text-brand-green hover:text-brand-green/80 text-sm">
            ← Switch demo user
          </Link>
        </div>
      </main>
    </div>
  );
}
