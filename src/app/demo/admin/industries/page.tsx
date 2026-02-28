'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Settings, Users, Building2, ClipboardList, Factory,
  Workflow, Shield, HelpCircle, LayoutDashboard, ChevronRight,
  LogOut, Menu, X, Search, Plus, Edit, Trash2, Building, Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Industry {
  id: string;
  name: string;
  code: string;
  description: string;
  organizations: number;
  assessments: number;
  avgIcs: number | null;
}

const INDUSTRIES: Industry[] = [
  { id: '1', name: 'Technology', code: 'TECH', description: 'Software, hardware, and IT services', organizations: 8, assessments: 24, avgIcs: 78 },
  { id: '2', name: 'Healthcare', code: 'HLTH', description: 'Medical services, pharmaceuticals, biotechnology', organizations: 5, assessments: 18, avgIcs: 71 },
  { id: '3', name: 'Manufacturing', code: 'MANF', description: 'Production and industrial processes', organizations: 4, assessments: 15, avgIcs: 65 },
  { id: '4', name: 'Financial Services', code: 'FINC', description: 'Banking, insurance, investment', organizations: 6, assessments: 22, avgIcs: 82 },
  { id: '5', name: 'Retail', code: 'RETL', description: 'Consumer goods and e-commerce', organizations: 3, assessments: 9, avgIcs: 69 },
  { id: '6', name: 'Energy', code: 'ENGY', description: 'Oil, gas, renewables, utilities', organizations: 2, assessments: 7, avgIcs: 74 },
  { id: '7', name: 'Education', code: 'EDUC', description: 'Schools, universities, e-learning', organizations: 3, assessments: 8, avgIcs: null },
];

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/demo/admin' },
  { label: 'Users', icon: Users, href: '/demo/admin/users' },
  { label: 'Organizations', icon: Building2, href: '/demo/admin/organizations' },
  { label: 'Assessments', icon: ClipboardList, href: '/demo/admin/assessments' },
  { label: 'Industries', icon: Factory, href: '/demo/admin/industries', active: true },
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
              <span className="text-[10px] text-brand-grey font-medium tracking-wider uppercase">ELVAIT</span>
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden p-2 text-brand-grey hover:text-white rounded-lg hover:bg-white/5"><X className="h-5 w-5" /></button>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="px-3 text-[10px] font-semibold text-brand-grey uppercase tracking-wider mb-2">Management</p>
          {NAV_ITEMS.map(item => (
            <Link key={item.label} href={item.href} className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${item.active ? 'bg-white/[0.08] text-white shadow-sm' : 'text-brand-grey hover:bg-white/[0.04] hover:text-white'}`}>
              <item.icon className={`h-5 w-5 ${item.active ? 'text-brand-green' : 'text-brand-grey group-hover:text-brand-green'}`} />
              {item.label}
              {item.active && <ChevronRight className="ml-auto h-4 w-4 text-brand-green" />}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/[0.06]">
          <Link href="/demo/login" className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors mb-3">
            <div className="p-2 rounded-lg bg-teal-500/20"><LogOut className="h-4 w-4 text-teal-400" /></div>
            <div className="flex-1"><p className="text-sm font-medium text-white">Switch User</p><p className="text-xs text-brand-grey">Back to role selection</p></div>
          </Link>
        </div>
      </div>
    </aside>
  );
}

export default function AdminIndustriesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIndustries = INDUSTRIES.filter(i => 
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(20,184,166,0.1),transparent_50%)]" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(13,148,136,0.08),transparent_50%)]" />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="fixed top-0 left-0 right-0 z-30 lg:hidden bg-white/[0.02] backdrop-blur-xl border-b border-white/[0.06]">
        <div className="flex items-center justify-between h-16 px-4">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-brand-grey hover:text-white rounded-lg hover:bg-white/5"><Menu className="h-6 w-6" /></button>
          <span className="text-lg font-semibold">Industries</span>
          <div className="w-10" />
        </div>
      </div>

      <main className="lg:pl-72 pt-16 lg:pt-0 relative z-10 min-h-screen">
        <div className="hidden lg:block border-b border-white/[0.06] bg-white/[0.01]">
          <div className="px-8 py-4 flex items-center gap-2 text-sm">
            <Link href="/demo/admin" className="text-brand-green hover:text-brand-green/80 font-medium">Admin</Link>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <span className="text-white">Industries</span>
          </div>
        </div>

        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Industries</h1>
              <p className="text-brand-grey text-sm mt-1">Manage industry categories for assessments</p>
            </div>
            <Button><Plus className="w-4 h-4 mr-2" />Add Industry</Button>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-grey" />
              <Input placeholder="Search industries..." className="pl-9 bg-white/5 border-white/10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>

          <div className="bg-white/[0.02] backdrop-blur-sm rounded-xl border border-white/[0.06] overflow-hidden">
            <table className="w-full">
              <thead className="border-b border-white/[0.06]">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-brand-grey">Industry</th>
                  <th className="text-left p-4 text-sm font-medium text-brand-grey">Code</th>
                  <th className="text-left p-4 text-sm font-medium text-brand-grey">Organizations</th>
                  <th className="text-left p-4 text-sm font-medium text-brand-grey">Assessments</th>
                  <th className="text-left p-4 text-sm font-medium text-brand-grey">Avg ICS</th>
                  <th className="text-right p-4 text-sm font-medium text-brand-grey">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {filteredIndustries.map(industry => (
                  <tr key={industry.id} className="hover:bg-white/[0.02]">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-clarity-500/20 to-teal-500/20 flex items-center justify-center">
                          <Factory className="w-5 h-5 text-brand-green" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{industry.name}</p>
                          <p className="text-xs text-brand-grey">{industry.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4"><span className="px-2 py-1 rounded bg-white/5 text-sm font-mono text-brand-grey">{industry.code}</span></td>
                    <td className="p-4 text-brand-grey">{industry.organizations}</td>
                    <td className="p-4 text-brand-grey">{industry.assessments}</td>
                    <td className="p-4">
                      {industry.avgIcs !== null ? (
                        <span className={`font-bold ${industry.avgIcs >= 75 ? 'text-green-400' : industry.avgIcs >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{industry.avgIcs}</span>
                      ) : <span className="text-brand-grey">—</span>}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-brand-grey hover:text-white hover:bg-white/5 rounded-lg"><Edit className="w-4 h-4" /></button>
                        <button className="p-2 text-brand-grey hover:text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
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
