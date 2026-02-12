'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Settings, Users, Building2, ClipboardList, Factory,
  Workflow, Shield, HelpCircle, LayoutDashboard, ChevronRight,
  LogOut, Menu, X, Search, Plus, Edit, Trash2, Cog
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ProcessType {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  assessments: number;
  avgIcs: number | null;
}

const PROCESS_TYPES: ProcessType[] = [
  { id: '1', name: 'Customer Service', code: 'CS', category: 'Front Office', description: 'Customer support and service interactions', assessments: 12, avgIcs: 81 },
  { id: '2', name: 'Order Processing', code: 'OP', category: 'Operations', description: 'Order intake, fulfillment, and tracking', assessments: 8, avgIcs: 75 },
  { id: '3', name: 'Invoice Management', code: 'IM', category: 'Finance', description: 'Invoice creation, tracking, and reconciliation', assessments: 6, avgIcs: 78 },
  { id: '4', name: 'HR Onboarding', code: 'HR', category: 'Human Resources', description: 'Employee onboarding and documentation', assessments: 5, avgIcs: 69 },
  { id: '5', name: 'Supply Chain', code: 'SC', category: 'Operations', description: 'Procurement, logistics, and inventory', assessments: 9, avgIcs: 72 },
  { id: '6', name: 'Data Entry', code: 'DE', category: 'Back Office', description: 'Manual data entry and validation', assessments: 15, avgIcs: 85 },
  { id: '7', name: 'Quality Control', code: 'QC', category: 'Operations', description: 'Quality assurance and inspection', assessments: 4, avgIcs: 67 },
  { id: '8', name: 'Marketing Ops', code: 'MO', category: 'Marketing', description: 'Campaign management and analytics', assessments: 7, avgIcs: null },
];

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/demo/admin' },
  { label: 'Users', icon: Users, href: '/demo/admin/users' },
  { label: 'Organizations', icon: Building2, href: '/demo/admin/organizations' },
  { label: 'Assessments', icon: ClipboardList, href: '/demo/admin/assessments' },
  { label: 'Industries', icon: Factory, href: '/demo/admin/industries' },
  { label: 'Process Types', icon: Workflow, href: '/demo/admin/process-types', active: true },
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

export default function AdminProcessTypesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProcessTypes = PROCESS_TYPES.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [...new Set(PROCESS_TYPES.map(p => p.category))];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(20,184,166,0.1),transparent_50%)]" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(13,148,136,0.08),transparent_50%)]" />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="fixed top-0 left-0 right-0 z-30 lg:hidden bg-white/[0.02] backdrop-blur-xl border-b border-white/[0.06]">
        <div className="flex items-center justify-between h-16 px-4">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"><Menu className="h-6 w-6" /></button>
          <span className="text-lg font-semibold">Process Types</span>
          <div className="w-10" />
        </div>
      </div>

      <main className="lg:pl-72 pt-16 lg:pt-0 relative z-10 min-h-screen">
        <div className="hidden lg:block border-b border-white/[0.06] bg-white/[0.01]">
          <div className="px-8 py-4 flex items-center gap-2 text-sm">
            <Link href="/demo/admin" className="text-clarity-400 hover:text-clarity-300 font-medium">Admin</Link>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <span className="text-white">Process Types</span>
          </div>
        </div>

        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Process Types</h1>
              <p className="text-gray-400 text-sm mt-1">Define process categories for automation assessments</p>
            </div>
            <Button><Plus className="w-4 h-4 mr-2" />Add Process Type</Button>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(cat => (
              <span key={cat} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
                {cat} ({PROCESS_TYPES.filter(p => p.category === cat).length})
              </span>
            ))}
          </div>

          <div className="flex gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input placeholder="Search process types..." className="pl-9 bg-white/5 border-white/10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProcessTypes.map(process => (
              <div key={process.id} className="bg-white/[0.02] backdrop-blur-sm rounded-xl border border-white/[0.06] p-5 hover:border-clarity-500/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <Workflow className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="px-2 py-1 rounded bg-white/5 text-xs font-mono text-gray-400">{process.code}</span>
                </div>
                <h3 className="font-semibold mb-1">{process.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{process.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{process.category}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">{process.assessments} assessments</span>
                    {process.avgIcs !== null && (
                      <span className={`font-bold ${process.avgIcs >= 75 ? 'text-green-400' : process.avgIcs >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                        {process.avgIcs}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-white/[0.06]">
                  <Button variant="outline" size="sm" className="flex-1"><Edit className="w-4 h-4 mr-1" />Edit</Button>
                  <Button variant="outline" size="sm"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
