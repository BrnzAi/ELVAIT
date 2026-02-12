'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Brain, Settings, Users, Building2, ClipboardList, Factory,
  Workflow, Shield, HelpCircle, LayoutDashboard, ChevronRight,
  LogOut, Bell, Menu, X, TrendingUp, FileText, CheckCircle,
  AlertTriangle, XCircle, Search, Plus, MoreVertical, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// =============================================================================
// DEMO DATA
// =============================================================================

interface AdminStats {
  totalUsers: number;
  totalOrgs: number;
  totalAssessments: number;
  activeAssessments: number;
  goDecisions: number;
  clarifyDecisions: number;
  nogoDecisions: number;
}

const STATS: AdminStats = {
  totalUsers: 156,
  totalOrgs: 24,
  totalAssessments: 89,
  activeAssessments: 12,
  goDecisions: 34,
  clarifyDecisions: 28,
  nogoDecisions: 15
};

interface RecentUser {
  id: string;
  name: string;
  email: string;
  organization: string;
  role: string;
  status: 'active' | 'pending' | 'inactive';
  joinedAt: string;
}

const RECENT_USERS: RecentUser[] = [
  { id: '1', name: 'Sarah Chen', email: 'sarah@acme.com', organization: 'Acme Corp', role: 'Executive', status: 'active', joinedAt: '2 hours ago' },
  { id: '2', name: 'Michael Park', email: 'michael@techstart.io', organization: 'TechStart', role: 'Business Owner', status: 'active', joinedAt: '5 hours ago' },
  { id: '3', name: 'Emily Rodriguez', email: 'emily@globalinc.com', organization: 'Global Inc', role: 'Technical Owner', status: 'pending', joinedAt: '1 day ago' },
  { id: '4', name: 'James Wilson', email: 'james@startup.co', organization: 'Startup Co', role: 'Process Owner', status: 'active', joinedAt: '2 days ago' },
];

interface RecentAssessment {
  id: string;
  title: string;
  organization: string;
  variant: string;
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED';
  recommendation: 'GO' | 'CLARIFY' | 'NO_GO' | null;
  ics: number | null;
  createdAt: string;
}

const RECENT_ASSESSMENTS: RecentAssessment[] = [
  { id: '1', title: 'Customer Service AI', organization: 'Acme Corp', variant: 'CORE', status: 'COMPLETED', recommendation: 'GO', ics: 87, createdAt: '2 hours ago' },
  { id: '2', title: 'ERP Modernization', organization: 'Global Inc', variant: 'FULL', status: 'COMPLETED', recommendation: 'NO_GO', ics: 72, createdAt: '1 day ago' },
  { id: '3', title: 'Marketing Automation', organization: 'TechStart', variant: 'CORE', status: 'ACTIVE', recommendation: null, ics: null, createdAt: '2 days ago' },
  { id: '4', title: 'Data Lake Project', organization: 'Startup Co', variant: 'CORE', status: 'COMPLETED', recommendation: 'CLARIFY', ics: 68, createdAt: '3 days ago' },
];

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/demo/admin', active: true },
  { label: 'Users', icon: Users, href: '/demo/admin/users' },
  { label: 'Organizations', icon: Building2, href: '/demo/admin/organizations' },
  { label: 'Assessments', icon: ClipboardList, href: '/demo/admin/assessments' },
  { label: 'Industries', icon: Factory, href: '/demo/admin/industries' },
  { label: 'Process Types', icon: Workflow, href: '/demo/admin/process-types' },
  { label: 'Roles', icon: Shield, href: '/demo/admin/roles' },
  { label: 'Questions', icon: HelpCircle, href: '/demo/admin/questions' },
];

// =============================================================================
// COMPONENTS
// =============================================================================

function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/[0.02] backdrop-blur-xl border-r border-white/[0.06] transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-white/[0.06]">
          <Link href="/demo/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-clarity-500 to-teal-500 flex items-center justify-center shadow-lg shadow-clarity-500/25">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-clarity-400 to-teal-400 bg-clip-text text-transparent">Admin Panel</span>
              <span className="text-[10px] text-gray-500 font-medium tracking-wider uppercase">ELVAIT</span>
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Management</p>
          {NAV_ITEMS.map(item => (
            <Link
              key={item.label}
              href={item.href}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                item.active 
                  ? 'bg-white/[0.08] text-white shadow-sm' 
                  : 'text-gray-400 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              <item.icon className={`h-5 w-5 transition-colors ${item.active ? 'text-clarity-400' : 'text-gray-500 group-hover:text-clarity-400'}`} />
              {item.label}
              {item.active && <ChevronRight className="ml-auto h-4 w-4 text-clarity-400" />}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.06]">
          <Link href="/demo/login" className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors group mb-3">
            <div className="p-2 rounded-lg bg-teal-500/20">
              <LogOut className="h-4 w-4 text-teal-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Switch User</p>
              <p className="text-xs text-gray-500">Back to role selection</p>
            </div>
          </Link>
          <p className="text-xs text-gray-600 text-center">Admin v1.0 • ELVAIT Demo</p>
        </div>
      </div>
    </aside>
  );
}

function StatCard({ icon: Icon, label, value, color, trend }: { 
  icon: typeof Users; 
  label: string; 
  value: number;
  color: string;
  trend?: { value: number; positive: boolean };
}) {
  const colorClasses: Record<string, string> = {
    blue: 'from-blue-500 to-cyan-500 shadow-blue-500/25',
    green: 'from-green-500 to-emerald-500 shadow-green-500/25',
    amber: 'from-amber-500 to-orange-500 shadow-amber-500/25',
    red: 'from-red-500 to-pink-500 shadow-red-500/25',
    purple: 'from-purple-500 to-violet-500 shadow-purple-500/25',
    teal: 'from-teal-500 to-cyan-500 shadow-teal-500/25',
  };

  return (
    <div className="bg-white/[0.02] backdrop-blur-sm rounded-xl p-5 border border-white/[0.06]">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            trend.positive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {trend.positive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-sm text-gray-400 mt-1">{label}</p>
    </div>
  );
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function AdminDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Background effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(20,184,166,0.1),transparent_50%)]" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(13,148,136,0.08),transparent_50%)]" />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 z-30 lg:hidden bg-white/[0.02] backdrop-blur-xl border-b border-white/[0.06]">
        <div className="flex items-center justify-between h-16 px-4">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5">
            <Menu className="h-6 w-6" />
          </button>
          <Link href="/demo/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-clarity-500 to-teal-500 flex items-center justify-center">
              <Settings className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-clarity-400 to-teal-400 bg-clip-text text-transparent">Admin</span>
          </Link>
          <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5">
            <Bell className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <main className="lg:pl-72 pt-16 lg:pt-0 relative z-10 min-h-screen">
        {/* Breadcrumb */}
        <div className="hidden lg:block border-b border-white/[0.06] bg-white/[0.01]">
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/demo/admin" className="text-clarity-400 font-medium">Admin</Link>
              <ChevronRight className="w-4 h-4 text-gray-600" />
              <span className="text-gray-400">Dashboard</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input placeholder="Search..." className="pl-9 w-64 bg-white/5 border-white/10" />
              </div>
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-gray-400 text-sm mt-1">Overview of ELVAIT platform activity</p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Assessment
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Users} label="Total Users" value={STATS.totalUsers} color="blue" trend={{ value: 12, positive: true }} />
            <StatCard icon={Building2} label="Organizations" value={STATS.totalOrgs} color="purple" trend={{ value: 8, positive: true }} />
            <StatCard icon={ClipboardList} label="Assessments" value={STATS.totalAssessments} color="teal" />
            <StatCard icon={TrendingUp} label="Active" value={STATS.activeAssessments} color="amber" />
          </div>

          {/* Decision breakdown */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-400">{STATS.goDecisions}</p>
                <p className="text-sm text-gray-400">GO Decisions</p>
              </div>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-400">{STATS.clarifyDecisions}</p>
                <p className="text-sm text-gray-400">CLARIFY</p>
              </div>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-400">{STATS.nogoDecisions}</p>
                <p className="text-sm text-gray-400">NO-GO</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Users */}
            <div className="bg-white/[0.02] backdrop-blur-sm rounded-xl border border-white/[0.06]">
              <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
                <h2 className="font-semibold">Recent Users</h2>
                <Link href="/demo/admin/users" className="text-sm text-clarity-400 hover:text-clarity-300">
                  View all →
                </Link>
              </div>
              <div className="divide-y divide-white/[0.06]">
                {RECENT_USERS.map(user => (
                  <div key={user.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-clarity-500 to-teal-500 flex items-center justify-center text-white font-medium">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.organization} • {user.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs ${
                        user.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        user.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {user.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{user.joinedAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Assessments */}
            <div className="bg-white/[0.02] backdrop-blur-sm rounded-xl border border-white/[0.06]">
              <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
                <h2 className="font-semibold">Recent Assessments</h2>
                <Link href="/demo/admin/assessments" className="text-sm text-clarity-400 hover:text-clarity-300">
                  View all →
                </Link>
              </div>
              <div className="divide-y divide-white/[0.06]">
                {RECENT_ASSESSMENTS.map(assessment => (
                  <div key={assessment.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        assessment.recommendation === 'GO' ? 'bg-green-500/20' :
                        assessment.recommendation === 'CLARIFY' ? 'bg-amber-500/20' :
                        assessment.recommendation === 'NO_GO' ? 'bg-red-500/20' :
                        'bg-gray-500/20'
                      }`}>
                        <FileText className={`w-5 h-5 ${
                          assessment.recommendation === 'GO' ? 'text-green-400' :
                          assessment.recommendation === 'CLARIFY' ? 'text-amber-400' :
                          assessment.recommendation === 'NO_GO' ? 'text-red-400' :
                          'text-gray-400'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium">{assessment.title}</p>
                        <p className="text-xs text-gray-500">{assessment.organization} • {assessment.variant}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      {assessment.ics !== null && (
                        <span className="font-medium">{assessment.ics}</span>
                      )}
                      {assessment.recommendation && (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${
                          assessment.recommendation === 'GO' ? 'bg-green-500/20 text-green-400' :
                          assessment.recommendation === 'CLARIFY' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {assessment.recommendation === 'GO' && <CheckCircle className="w-3 h-3" />}
                          {assessment.recommendation === 'CLARIFY' && <AlertTriangle className="w-3 h-3" />}
                          {assessment.recommendation === 'NO_GO' && <XCircle className="w-3 h-3" />}
                          {assessment.recommendation}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Back to demo */}
          <div className="mt-8 text-center">
            <Link href="/demo/login" className="text-clarity-400 hover:text-clarity-300 text-sm">
              ← Switch demo user
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
