'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Settings, Users, Building2, ClipboardList, Factory,
  Workflow, Shield, HelpCircle, LayoutDashboard, ChevronRight,
  LogOut, Menu, X, Search, Plus, Edit, Eye, ChevronDown, ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Question {
  id: string;
  code: string;
  text: string;
  dimension: string;
  role: string;
  isReverse: boolean;
  variants: string[];
}

const QUESTIONS: Question[] = [
  { id: '1', code: 'Q-EXEC-01', text: 'This initiative aligns with our strategic priorities', dimension: 'D1 - Strategic Alignment', role: 'Executive', isReverse: false, variants: ['QUICK', 'CORE', 'FULL'] },
  { id: '2', code: 'Q-EXEC-02', text: 'We have clear success metrics defined', dimension: 'D1 - Strategic Alignment', role: 'Executive', isReverse: false, variants: ['CORE', 'FULL'] },
  { id: '3', code: 'Q-BIZ-01', text: 'The current process has well-documented steps', dimension: 'D2 - Process Clarity', role: 'Business Owner', isReverse: false, variants: ['QUICK', 'CORE', 'FULL'] },
  { id: '4', code: 'Q-BIZ-02', text: 'Process exceptions are rare and well-handled', dimension: 'D2 - Process Clarity', role: 'Business Owner', isReverse: false, variants: ['CORE', 'FULL'] },
  { id: '5', code: 'Q-TECH-01', text: 'Our systems can integrate with modern APIs', dimension: 'D3 - Technical Feasibility', role: 'Technical Owner', isReverse: false, variants: ['QUICK', 'CORE', 'FULL'] },
  { id: '6', code: 'Q-TECH-02', text: 'Legacy system dependencies create blockers', dimension: 'D3 - Technical Feasibility', role: 'Technical Owner', isReverse: true, variants: ['CORE', 'FULL'] },
  { id: '7', code: 'Q-PROC-01', text: 'Staff are ready for process changes', dimension: 'D4 - Change Readiness', role: 'Process Owner', isReverse: false, variants: ['QUICK', 'CORE', 'FULL'] },
  { id: '8', code: 'Q-SPON-01', text: 'Budget is allocated for this initiative', dimension: 'D5 - Resource Availability', role: 'Sponsor', isReverse: false, variants: ['CORE', 'FULL'] },
];

const DIMENSIONS = ['D1 - Strategic Alignment', 'D2 - Process Clarity', 'D3 - Technical Feasibility', 'D4 - Change Readiness', 'D5 - Resource Availability', 'P - Process Gate'];

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/demo/admin' },
  { label: 'Users', icon: Users, href: '/demo/admin/users' },
  { label: 'Organizations', icon: Building2, href: '/demo/admin/organizations' },
  { label: 'Assessments', icon: ClipboardList, href: '/demo/admin/assessments' },
  { label: 'Industries', icon: Factory, href: '/demo/admin/industries' },
  { label: 'Process Types', icon: Workflow, href: '/demo/admin/process-types' },
  { label: 'Roles', icon: Shield, href: '/demo/admin/roles' },
  { label: 'Questions', icon: HelpCircle, href: '/demo/admin/questions', active: true },
];

function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/[0.02] backdrop-blur-xl border-r border-white/[0.06] transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex h-full flex-col">
        <div className="flex h-20 items-center justify-between px-6 border-b border-white/[0.06]">
          <Link href="/demo/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-elvait-green flex items-center justify-center shadow-lg shadow-elvait-green/20">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-elvait-green">Admin Panel</span>
              <span className="text-[10px] text-gray-500 font-medium tracking-wider uppercase">ELVAIT</span>
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"><X className="h-5 w-5" /></button>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Management</p>
          {NAV_ITEMS.map(item => (
            <Link key={item.label} href={item.href} className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${item.active ? 'bg-white/[0.08] text-white shadow-sm' : 'text-gray-400 hover:bg-white/[0.04] hover:text-white'}`}>
              <item.icon className={`h-5 w-5 ${item.active ? 'text-elvait-green' : 'text-gray-500 group-hover:text-elvait-green'}`} />
              {item.label}
              {item.active && <ChevronRight className="ml-auto h-4 w-4 text-elvait-green" />}
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

export default function AdminQuestionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDimension, setExpandedDimension] = useState<string | null>('D1 - Strategic Alignment');

  const filteredQuestions = QUESTIONS.filter(q =>
    q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const questionsByDimension = DIMENSIONS.map(dim => ({
    dimension: dim,
    questions: filteredQuestions.filter(q => q.dimension === dim)
  })).filter(d => d.questions.length > 0);

  return (
    <div className="min-h-screen bg-elvait-black text-white">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(20,184,166,0.1),transparent_50%)]" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(13,148,136,0.08),transparent_50%)]" />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="fixed top-0 left-0 right-0 z-30 lg:hidden bg-white/[0.02] backdrop-blur-xl border-b border-white/[0.06]">
        <div className="flex items-center justify-between h-16 px-4">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"><Menu className="h-6 w-6" /></button>
          <span className="text-lg font-semibold">Questions</span>
          <div className="w-10" />
        </div>
      </div>

      <main className="lg:pl-72 pt-16 lg:pt-0 relative z-10 min-h-screen">
        <div className="hidden lg:block border-b border-white/[0.06] bg-white/[0.01]">
          <div className="px-8 py-4 flex items-center gap-2 text-sm">
            <Link href="/demo/admin" className="text-elvait-green hover:text-elvait-green font-medium">Admin</Link>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <span className="text-white">Questions</span>
          </div>
        </div>

        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Question Registry</h1>
              <p className="text-gray-400 text-sm mt-1">Manage assessment questions by dimension</p>
            </div>
            <Button><Plus className="w-4 h-4 mr-2" />Add Question</Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
              <p className="text-2xl font-bold">{QUESTIONS.length}</p>
              <p className="text-sm text-gray-400">Total Questions</p>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
              <p className="text-2xl font-bold">{DIMENSIONS.length}</p>
              <p className="text-sm text-gray-400">Dimensions</p>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
              <p className="text-2xl font-bold">{QUESTIONS.filter(q => q.isReverse).length}</p>
              <p className="text-sm text-gray-400">Reverse Scored</p>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input placeholder="Search questions..." className="pl-9 bg-white/5 border-white/10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>

          {/* Questions by Dimension */}
          <div className="space-y-4">
            {questionsByDimension.map(({ dimension, questions }) => (
              <div key={dimension} className="bg-white/[0.02] backdrop-blur-sm rounded-xl border border-white/[0.06] overflow-hidden">
                <button
                  onClick={() => setExpandedDimension(expandedDimension === dimension ? null : dimension)}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-elvait-red/20 flex items-center justify-center">
                      <HelpCircle className="w-4 h-4 text-elvait-green" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold">{dimension}</h3>
                      <p className="text-sm text-gray-500">{questions.length} questions</p>
                    </div>
                  </div>
                  {expandedDimension === dimension ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>

                {expandedDimension === dimension && (
                  <div className="border-t border-white/[0.06]">
                    {questions.map((q, idx) => (
                      <div key={q.id} className={`p-4 flex items-start gap-4 ${idx !== questions.length - 1 ? 'border-b border-white/[0.06]' : ''}`}>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded bg-white/5 text-xs font-mono text-gray-400">{q.code}</span>
                            <span className="px-2 py-0.5 rounded bg-elvait-green/10 text-xs text-elvait-green">{q.role}</span>
                            {q.isReverse && <span className="px-2 py-0.5 rounded bg-amber-500/20 text-xs text-amber-400">Reverse</span>}
                          </div>
                          <p className="text-gray-200">{q.text}</p>
                          <div className="flex gap-1 mt-2">
                            {q.variants.map(v => (
                              <span key={v} className="px-2 py-0.5 rounded bg-white/5 text-xs text-gray-500">{v}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg"><Eye className="w-4 h-4" /></button>
                          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg"><Edit className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
