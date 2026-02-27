'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Settings, Users, Building2, ClipboardList, Factory,
  Workflow, Shield, HelpCircle, LayoutDashboard, ChevronRight,
  LogOut, Menu, X, Search, Plus, Edit, Trash2, Check, Crown, Briefcase, Cpu, Cog, UserCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Role {
  id: string;
  name: string;
  code: string;
  description: string;
  permissions: string[];
  users: number;
  isSystem: boolean;
  icon: typeof Crown;
  color: string;
}

const ROLES: Role[] = [
  { id: '1', name: 'Executive', code: 'EXEC', description: 'C-level executives and senior leadership', permissions: ['view_results', 'view_dashboard', 'export_reports'], users: 24, isSystem: true, icon: Crown, color: 'amber' },
  { id: '2', name: 'Business Owner', code: 'BIZ', description: 'Business unit leads and process owners', permissions: ['view_results', 'create_assessment', 'invite_participants'], users: 35, isSystem: true, icon: Briefcase, color: 'blue' },
  { id: '3', name: 'Technical Owner', code: 'TECH', description: 'IT leads and technical architects', permissions: ['view_results', 'technical_assessment', 'integration_review'], users: 28, isSystem: true, icon: Cpu, color: 'purple' },
  { id: '4', name: 'Process Owner', code: 'PROC', description: 'Process managers and operations leads', permissions: ['view_results', 'process_assessment'], users: 31, isSystem: true, icon: Cog, color: 'teal' },
  { id: '5', name: 'Sponsor', code: 'SPON', description: 'Project sponsors and budget holders', permissions: ['view_results', 'approve_budget', 'strategic_alignment'], users: 18, isSystem: true, icon: UserCircle, color: 'green' },
  { id: '6', name: 'Admin', code: 'ADMIN', description: 'Platform administrators with full access', permissions: ['all'], users: 5, isSystem: true, icon: Shield, color: 'red' },
];

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/demo/admin' },
  { label: 'Users', icon: Users, href: '/demo/admin/users' },
  { label: 'Organizations', icon: Building2, href: '/demo/admin/organizations' },
  { label: 'Assessments', icon: ClipboardList, href: '/demo/admin/assessments' },
  { label: 'Industries', icon: Factory, href: '/demo/admin/industries' },
  { label: 'Process Types', icon: Workflow, href: '/demo/admin/process-types' },
  { label: 'Roles', icon: Shield, href: '/demo/admin/roles', active: true },
  { label: 'Questions', icon: HelpCircle, href: '/demo/admin/questions' },
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

const colorClasses: Record<string, string> = {
  amber: 'from-amber-500/20 to-orange-500/20 text-amber-400',
  blue: 'from-blue-500/20 to-cyan-500/20 text-elvait-green',
  purple: 'from-purple-500/20 to-violet-500/20 text-purple-400',
  teal: 'from-teal-500/20 to-cyan-500/20 text-teal-400',
  green: 'from-green-500/20 to-emerald-500/20 text-green-400',
  red: 'from-red-500/20 to-pink-500/20 text-red-400',
};

export default function AdminRolesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-elvait-black text-white">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(20,184,166,0.1),transparent_50%)]" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(13,148,136,0.08),transparent_50%)]" />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="fixed top-0 left-0 right-0 z-30 lg:hidden bg-white/[0.02] backdrop-blur-xl border-b border-white/[0.06]">
        <div className="flex items-center justify-between h-16 px-4">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"><Menu className="h-6 w-6" /></button>
          <span className="text-lg font-semibold">Roles</span>
          <div className="w-10" />
        </div>
      </div>

      <main className="lg:pl-72 pt-16 lg:pt-0 relative z-10 min-h-screen">
        <div className="hidden lg:block border-b border-white/[0.06] bg-white/[0.01]">
          <div className="px-8 py-4 flex items-center gap-2 text-sm">
            <Link href="/demo/admin" className="text-elvait-green hover:text-elvait-green font-medium">Admin</Link>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <span className="text-white">Roles</span>
          </div>
        </div>

        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Roles & Permissions</h1>
              <p className="text-gray-400 text-sm mt-1">Manage user roles and their access levels</p>
            </div>
            <Button><Plus className="w-4 h-4 mr-2" />Add Role</Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {ROLES.map(role => {
              const IconComponent = role.icon;
              return (
                <div key={role.id} className="bg-white/[0.02] backdrop-blur-sm rounded-xl border border-white/[0.06] p-5 hover:border-elvait-green/30 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[role.color]} flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    {role.isSystem && (
                      <span className="px-2 py-1 rounded bg-white/5 text-xs text-gray-400">System</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{role.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{role.description}</p>
                  
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Permissions</p>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 3).map(perm => (
                        <span key={perm} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 text-xs text-gray-300">
                          <Check className="w-3 h-3 text-green-400" />
                          {perm.replace(/_/g, ' ')}
                        </span>
                      ))}
                      {role.permissions.length > 3 && (
                        <span className="px-2 py-0.5 rounded bg-white/5 text-xs text-gray-400">
                          +{role.permissions.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                    <span className="text-sm text-gray-400">{role.users} users</span>
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg"><Edit className="w-4 h-4" /></button>
                      {!role.isSystem && (
                        <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
