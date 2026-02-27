'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Settings, Users, Building2, ClipboardList, Factory,
  Workflow, Shield, HelpCircle, LayoutDashboard, ChevronRight,
  LogOut, Bell, Menu, X, Search, Plus, MoreVertical, Edit, Trash2,
  Mail, Check, XCircle, Filter, Download, Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// =============================================================================
// DEMO DATA
// =============================================================================

interface User {
  id: string;
  name: string;
  email: string;
  organization: string;
  role: string;
  status: 'active' | 'pending' | 'inactive';
  joinedAt: string;
  lastActive: string;
  assessments: number;
}

const USERS: User[] = [
  { id: '1', name: 'Sarah Chen', email: 'sarah@acme.com', organization: 'Acme Corp', role: 'Executive', status: 'active', joinedAt: 'Jan 15, 2025', lastActive: '2 hours ago', assessments: 5 },
  { id: '2', name: 'Michael Park', email: 'michael@techstart.io', organization: 'TechStart', role: 'Business Owner', status: 'active', joinedAt: 'Jan 18, 2025', lastActive: '5 hours ago', assessments: 3 },
  { id: '3', name: 'Emily Rodriguez', email: 'emily@globalinc.com', organization: 'Global Inc', role: 'Technical Owner', status: 'pending', joinedAt: 'Jan 20, 2025', lastActive: '1 day ago', assessments: 0 },
  { id: '4', name: 'James Wilson', email: 'james@startup.co', organization: 'Startup Co', role: 'Process Owner', status: 'active', joinedAt: 'Jan 22, 2025', lastActive: '2 days ago', assessments: 2 },
  { id: '5', name: 'Lisa Thompson', email: 'lisa@megacorp.com', organization: 'MegaCorp', role: 'Sponsor', status: 'active', joinedAt: 'Jan 25, 2025', lastActive: '1 hour ago', assessments: 8 },
  { id: '6', name: 'David Kim', email: 'david@innovate.io', organization: 'Innovate.io', role: 'Executive', status: 'inactive', joinedAt: 'Dec 10, 2024', lastActive: '30 days ago', assessments: 1 },
  { id: '7', name: 'Anna Martinez', email: 'anna@future.tech', organization: 'FutureTech', role: 'Technical Owner', status: 'active', joinedAt: 'Feb 1, 2025', lastActive: '3 hours ago', assessments: 4 },
  { id: '8', name: 'Robert Brown', email: 'robert@enterprise.com', organization: 'Enterprise Ltd', role: 'Business Owner', status: 'pending', joinedAt: 'Feb 5, 2025', lastActive: 'Never', assessments: 0 },
];

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/demo/admin' },
  { label: 'Users', icon: Users, href: '/demo/admin/users', active: true },
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
          <button onClick={onClose} className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5">
            <X className="h-5 w-5" />
          </button>
        </div>

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
              <item.icon className={`h-5 w-5 transition-colors ${item.active ? 'text-elvait-green' : 'text-gray-500 group-hover:text-elvait-green'}`} />
              {item.label}
              {item.active && <ChevronRight className="ml-auto h-4 w-4 text-elvait-green" />}
            </Link>
          ))}
        </nav>

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
        </div>
      </div>
    </aside>
  );
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function AdminUsersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredUsers = USERS.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.organization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-elvait-black text-white">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(20,184,166,0.1),transparent_50%)]" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(13,148,136,0.08),transparent_50%)]" />

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 z-30 lg:hidden bg-white/[0.02] backdrop-blur-xl border-b border-white/[0.06]">
        <div className="flex items-center justify-between h-16 px-4">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5">
            <Menu className="h-6 w-6" />
          </button>
          <span className="text-lg font-semibold">Users</span>
          <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5">
            <Bell className="h-5 w-5" />
          </button>
        </div>
      </div>

      <main className="lg:pl-72 pt-16 lg:pt-0 relative z-10 min-h-screen">
        {/* Breadcrumb */}
        <div className="hidden lg:block border-b border-white/[0.06] bg-white/[0.01]">
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/demo/admin" className="text-elvait-green hover:text-elvait-green font-medium">Admin</Link>
              <ChevronRight className="w-4 h-4 text-gray-600" />
              <span className="text-white">Users</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Users</h1>
              <p className="text-gray-400 text-sm mt-1">Manage platform users and their access</p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input 
                placeholder="Search users..." 
                className="pl-9 bg-white/5 border-white/10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {['all', 'active', 'pending', 'inactive'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-elvait-red/20 text-elvait-green border border-elvait-green/30'
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              <p className="text-2xl font-bold text-green-400">{USERS.filter(u => u.status === 'active').length}</p>
              <p className="text-sm text-gray-400">Active Users</p>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
              <p className="text-2xl font-bold text-amber-400">{USERS.filter(u => u.status === 'pending').length}</p>
              <p className="text-sm text-gray-400">Pending</p>
            </div>
            <div className="bg-gray-500/10 border border-gray-500/20 rounded-xl p-4">
              <p className="text-2xl font-bold text-gray-400">{USERS.filter(u => u.status === 'inactive').length}</p>
              <p className="text-sm text-gray-400">Inactive</p>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white/[0.02] backdrop-blur-sm rounded-xl border border-white/[0.06] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-white/[0.06]">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">User</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Organization</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Role</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Assessments</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Last Active</th>
                    <th className="text-right p-4 text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-white/[0.02]">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-elvait-green flex items-center justify-center text-white font-medium">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-white">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">{user.organization}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded bg-white/5 text-sm text-gray-300">{user.role}</span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                          user.status === 'active' ? 'bg-green-500/20 text-green-400' :
                          user.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {user.status === 'active' && <Check className="w-3 h-3" />}
                          {user.status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-300">{user.assessments}</td>
                      <td className="p-4 text-gray-400 text-sm">{user.lastActive}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg">
                            <Mail className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredUsers.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No users found matching your criteria</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">Showing {filteredUsers.length} of {USERS.length} users</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
