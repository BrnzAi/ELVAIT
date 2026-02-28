'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Settings, Users, Building2, ClipboardList, Factory,
  Workflow, Shield, HelpCircle, LayoutDashboard, ChevronRight,
  LogOut, Bell, Menu, X, Search, Plus, Edit, Trash2,
  Globe, MapPin, Calendar, TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// =============================================================================
// DEMO DATA
// =============================================================================

interface Organization {
  id: string;
  name: string;
  industry: string;
  size: string;
  location: string;
  users: number;
  assessments: number;
  joinedAt: string;
  status: 'active' | 'trial' | 'suspended';
}

const ORGANIZATIONS: Organization[] = [
  { id: '1', name: 'Acme Corp', industry: 'Technology', size: 'Enterprise (1000+)', location: 'San Francisco, CA', users: 24, assessments: 12, joinedAt: 'Jan 2025', status: 'active' },
  { id: '2', name: 'TechStart', industry: 'SaaS', size: 'Startup (10-50)', location: 'Austin, TX', users: 8, assessments: 5, joinedAt: 'Jan 2025', status: 'active' },
  { id: '3', name: 'Global Inc', industry: 'Manufacturing', size: 'Enterprise (1000+)', location: 'Chicago, IL', users: 45, assessments: 18, joinedAt: 'Dec 2024', status: 'active' },
  { id: '4', name: 'Startup Co', industry: 'FinTech', size: 'Startup (10-50)', location: 'New York, NY', users: 12, assessments: 7, joinedAt: 'Feb 2025', status: 'trial' },
  { id: '5', name: 'MegaCorp', industry: 'Healthcare', size: 'Enterprise (1000+)', location: 'Boston, MA', users: 67, assessments: 28, joinedAt: 'Nov 2024', status: 'active' },
  { id: '6', name: 'Innovate.io', industry: 'AI/ML', size: 'Mid-size (50-200)', location: 'Seattle, WA', users: 19, assessments: 9, joinedAt: 'Jan 2025', status: 'active' },
];

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/demo/admin' },
  { label: 'Users', icon: Users, href: '/demo/admin/users' },
  { label: 'Organizations', icon: Building2, href: '/demo/admin/organizations', active: true },
  { label: 'Assessments', icon: ClipboardList, href: '/demo/admin/assessments' },
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
              <span className="text-[10px] text-brand-grey font-medium tracking-wider uppercase">ELVAIT</span>
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden p-2 text-brand-grey hover:text-white rounded-lg hover:bg-white/5">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="px-3 text-[10px] font-semibold text-brand-grey uppercase tracking-wider mb-2">Management</p>
          {NAV_ITEMS.map(item => (
            <Link key={item.label} href={item.href} className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${item.active ? 'bg-white/[0.08] text-white shadow-sm' : 'text-brand-grey hover:bg-white/[0.04] hover:text-white'}`}>
              <item.icon className={`h-5 w-5 transition-colors ${item.active ? 'text-brand-green' : 'text-brand-grey group-hover:text-brand-green'}`} />
              {item.label}
              {item.active && <ChevronRight className="ml-auto h-4 w-4 text-brand-green" />}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/[0.06]">
          <Link href="/demo/login" className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors group mb-3">
            <div className="p-2 rounded-lg bg-teal-500/20"><LogOut className="h-4 w-4 text-teal-400" /></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Switch User</p>
              <p className="text-xs text-brand-grey">Back to role selection</p>
            </div>
          </Link>
        </div>
      </div>
    </aside>
  );
}

export default function AdminOrganizationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrgs = ORGANIZATIONS.filter(org =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(20,184,166,0.1),transparent_50%)]" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(13,148,136,0.08),transparent_50%)]" />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="fixed top-0 left-0 right-0 z-30 lg:hidden bg-white/[0.02] backdrop-blur-xl border-b border-white/[0.06]">
        <div className="flex items-center justify-between h-16 px-4">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-brand-grey hover:text-white rounded-lg hover:bg-white/5"><Menu className="h-6 w-6" /></button>
          <span className="text-lg font-semibold">Organizations</span>
          <button className="p-2 text-brand-grey hover:text-white rounded-lg hover:bg-white/5"><Bell className="h-5 w-5" /></button>
        </div>
      </div>

      <main className="lg:pl-72 pt-16 lg:pt-0 relative z-10 min-h-screen">
        <div className="hidden lg:block border-b border-white/[0.06] bg-white/[0.01]">
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/demo/admin" className="text-brand-green hover:text-brand-green/80 font-medium">Admin</Link>
              <ChevronRight className="w-4 h-4 text-gray-600" />
              <span className="text-white">Organizations</span>
            </div>
          </div>
        </div>

        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Organizations</h1>
              <p className="text-brand-grey text-sm mt-1">Manage organizations and their subscriptions</p>
            </div>
            <Button><Plus className="w-4 h-4 mr-2" />Add Organization</Button>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-grey" />
              <Input placeholder="Search organizations..." className="pl-9 bg-white/5 border-white/10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredOrgs.map(org => (
              <div key={org.id} className="bg-white/[0.02] backdrop-blur-sm rounded-xl border border-white/[0.06] p-5 hover:border-brand-green/30 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-clarity-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
                    {org.name.charAt(0)}
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    org.status === 'active' ? 'bg-green-500/20 text-green-400' :
                    org.status === 'trial' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>{org.status}</span>
                </div>
                <h3 className="font-semibold text-lg mb-1">{org.name}</h3>
                <p className="text-sm text-brand-grey mb-4">{org.industry} • {org.size}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-brand-grey">
                    <MapPin className="w-4 h-4" />{org.location}
                  </div>
                  <div className="flex items-center gap-2 text-brand-grey">
                    <Users className="w-4 h-4" />{org.users} users
                  </div>
                  <div className="flex items-center gap-2 text-brand-grey">
                    <ClipboardList className="w-4 h-4" />{org.assessments} assessments
                  </div>
                  <div className="flex items-center gap-2 text-brand-grey">
                    <Calendar className="w-4 h-4" />Joined {org.joinedAt}
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-white/[0.06]">
                  <Button variant="outline" size="sm" className="flex-1"><Edit className="w-4 h-4 mr-1" />Edit</Button>
                  <Button variant="outline" size="sm"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </div>

          {filteredOrgs.length === 0 && (
            <div className="p-12 text-center text-brand-grey">
              <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No organizations found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
