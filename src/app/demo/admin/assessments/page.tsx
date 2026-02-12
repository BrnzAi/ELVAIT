'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Settings, Users, Building2, ClipboardList, Factory,
  Workflow, Shield, HelpCircle, LayoutDashboard, ChevronRight,
  LogOut, Bell, Menu, X, Search, Plus, Eye, Trash2,
  CheckCircle, AlertTriangle, XCircle, Clock, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Assessment {
  id: string;
  title: string;
  organization: string;
  variant: 'QUICK' | 'CORE' | 'FULL' | 'ENTERPRISE';
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED';
  recommendation: 'GO' | 'CLARIFY' | 'NO_GO' | null;
  ics: number | null;
  participants: number;
  responses: number;
  createdAt: string;
  completedAt: string | null;
}

const ASSESSMENTS: Assessment[] = [
  { id: '1', title: 'Customer Service AI', organization: 'Acme Corp', variant: 'CORE', status: 'COMPLETED', recommendation: 'GO', ics: 87, participants: 5, responses: 5, createdAt: 'Feb 10, 2025', completedAt: 'Feb 12, 2025' },
  { id: '2', title: 'ERP Modernization', organization: 'Global Inc', variant: 'FULL', status: 'COMPLETED', recommendation: 'NO_GO', ics: 45, participants: 8, responses: 8, createdAt: 'Feb 5, 2025', completedAt: 'Feb 10, 2025' },
  { id: '3', title: 'Marketing Automation', organization: 'TechStart', variant: 'CORE', status: 'ACTIVE', recommendation: null, ics: null, participants: 4, responses: 2, createdAt: 'Feb 8, 2025', completedAt: null },
  { id: '4', title: 'Data Lake Project', organization: 'Startup Co', variant: 'QUICK', status: 'COMPLETED', recommendation: 'CLARIFY', ics: 68, participants: 3, responses: 3, createdAt: 'Feb 1, 2025', completedAt: 'Feb 3, 2025' },
  { id: '5', title: 'Supply Chain Optimization', organization: 'MegaCorp', variant: 'ENTERPRISE', status: 'ACTIVE', recommendation: null, ics: null, participants: 12, responses: 7, createdAt: 'Feb 9, 2025', completedAt: null },
  { id: '6', title: 'HR Process Automation', organization: 'Innovate.io', variant: 'CORE', status: 'DRAFT', recommendation: null, ics: null, participants: 0, responses: 0, createdAt: 'Feb 11, 2025', completedAt: null },
  { id: '7', title: 'Predictive Maintenance', organization: 'Global Inc', variant: 'FULL', status: 'COMPLETED', recommendation: 'GO', ics: 92, participants: 6, responses: 6, createdAt: 'Jan 28, 2025', completedAt: 'Feb 5, 2025' },
];

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/demo/admin' },
  { label: 'Users', icon: Users, href: '/demo/admin/users' },
  { label: 'Organizations', icon: Building2, href: '/demo/admin/organizations' },
  { label: 'Assessments', icon: ClipboardList, href: '/demo/admin/assessments', active: true },
  { label: 'Industries', icon: Factory, href: '/demo/admin/industries' },
  { label: 'Process Types', icon: Workflow, href: '/demo/admin/process-types' },
  { label: 'Roles', icon: Shield, href: '/demo/admin/roles' },
  { label: 'Questions', icon: HelpCircle, href: '/demo/admin/questions' },
];

function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/[0.02] backdrop-blur-xl border-r border-white/[0.06] transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex h-full flex-col">
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
          <button onClick={onClose} className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"><X className="h-5 w-5" /></button>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Management</p>
          {NAV_ITEMS.map(item => (
            <Link key={item.label} href={item.href} className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${item.active ? 'bg-white/[0.08] text-white shadow-sm' : 'text-gray-400 hover:bg-white/[0.04] hover:text-white'}`}>
              <item.icon className={`h-5 w-5 ${item.active ? 'text-clarity-400' : 'text-gray-500 group-hover:text-clarity-400'}`} />
              {item.label}
              {item.active && <ChevronRight className="ml-auto h-4 w-4 text-clarity-400" />}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/[0.06]">
          <Link href="/demo/login" className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors mb-3">
            <div className="p-2 rounded-lg bg-teal-500/20"><LogOut className="h-4 w-4 text-teal-400" /></div>
            <div className="flex-1"><p className="text-sm font-medium text-white">Switch User</p><p className="text-xs text-gray-500">Back to role selection</p></div>
          </Link>
        </div>
      </div>
    </aside>
  );
}

export default function AdminAssessmentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredAssessments = ASSESSMENTS.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.organization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(20,184,166,0.1),transparent_50%)]" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(13,148,136,0.08),transparent_50%)]" />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="fixed top-0 left-0 right-0 z-30 lg:hidden bg-white/[0.02] backdrop-blur-xl border-b border-white/[0.06]">
        <div className="flex items-center justify-between h-16 px-4">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"><Menu className="h-6 w-6" /></button>
          <span className="text-lg font-semibold">Assessments</span>
          <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"><Bell className="h-5 w-5" /></button>
        </div>
      </div>

      <main className="lg:pl-72 pt-16 lg:pt-0 relative z-10 min-h-screen">
        <div className="hidden lg:block border-b border-white/[0.06] bg-white/[0.01]">
          <div className="px-8 py-4 flex items-center gap-2 text-sm">
            <Link href="/demo/admin" className="text-clarity-400 hover:text-clarity-300 font-medium">Admin</Link>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <span className="text-white">Assessments</span>
          </div>
        </div>

        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Assessments</h1>
              <p className="text-gray-400 text-sm mt-1">View and manage all assessments across organizations</p>
            </div>
            <Button><Plus className="w-4 h-4 mr-2" />New Assessment</Button>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
              <p className="text-2xl font-bold">{ASSESSMENTS.length}</p>
              <p className="text-sm text-gray-400">Total</p>
            </div>
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              <p className="text-2xl font-bold text-green-400">{ASSESSMENTS.filter(a => a.recommendation === 'GO').length}</p>
              <p className="text-sm text-gray-400">GO</p>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
              <p className="text-2xl font-bold text-amber-400">{ASSESSMENTS.filter(a => a.recommendation === 'CLARIFY').length}</p>
              <p className="text-sm text-gray-400">CLARIFY</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <p className="text-2xl font-bold text-red-400">{ASSESSMENTS.filter(a => a.recommendation === 'NO_GO').length}</p>
              <p className="text-sm text-gray-400">NO-GO</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input placeholder="Search assessments..." className="pl-9 bg-white/5 border-white/10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <div className="flex gap-2">
              {['all', 'DRAFT', 'ACTIVE', 'COMPLETED'].map(status => (
                <button key={status} onClick={() => setStatusFilter(status)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === status ? 'bg-clarity-500/20 text-clarity-400 border border-clarity-500/30' : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'}`}>
                  {status === 'all' ? 'All' : status}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/[0.02] backdrop-blur-sm rounded-xl border border-white/[0.06] overflow-hidden">
            <table className="w-full">
              <thead className="border-b border-white/[0.06]">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Assessment</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Variant</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Progress</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">ICS</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Result</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {filteredAssessments.map(assessment => (
                  <tr key={assessment.id} className="hover:bg-white/[0.02]">
                    <td className="p-4">
                      <p className="font-medium text-white">{assessment.title}</p>
                      <p className="text-xs text-gray-500">{assessment.organization} • {assessment.createdAt}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        assessment.variant === 'QUICK' ? 'bg-blue-500/20 text-blue-400' :
                        assessment.variant === 'CORE' ? 'bg-purple-500/20 text-purple-400' :
                        assessment.variant === 'FULL' ? 'bg-teal-500/20 text-teal-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>{assessment.variant}</span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                        assessment.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                        assessment.status === 'ACTIVE' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {assessment.status === 'COMPLETED' && <CheckCircle className="w-3 h-3" />}
                        {assessment.status === 'ACTIVE' && <Clock className="w-3 h-3" />}
                        {assessment.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-300">{assessment.responses}/{assessment.participants}</td>
                    <td className="p-4">
                      {assessment.ics !== null ? (
                        <span className={`font-bold ${assessment.ics >= 75 ? 'text-green-400' : assessment.ics >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{assessment.ics}</span>
                      ) : <span className="text-gray-500">—</span>}
                    </td>
                    <td className="p-4">
                      {assessment.recommendation ? (
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                          assessment.recommendation === 'GO' ? 'bg-green-500/20 text-green-400' :
                          assessment.recommendation === 'CLARIFY' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {assessment.recommendation === 'GO' && <CheckCircle className="w-3 h-3" />}
                          {assessment.recommendation === 'CLARIFY' && <AlertTriangle className="w-3 h-3" />}
                          {assessment.recommendation === 'NO_GO' && <XCircle className="w-3 h-3" />}
                          {assessment.recommendation}
                        </span>
                      ) : <span className="text-gray-500">—</span>}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg"><Eye className="w-4 h-4" /></button>
                        <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
