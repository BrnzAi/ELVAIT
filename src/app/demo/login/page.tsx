'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Brain, Shield, Briefcase, Users, Code, UserCircle, 
  CheckCircle, ArrowRight, Info, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// =============================================================================
// DEMO USER PERSONAS
// =============================================================================

interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'EXEC' | 'BUSINESS_OWNER' | 'TECH_OWNER' | 'USER' | 'PROCESS_OWNER';
  roleLabel: string;
  description: string;
  organization: string;
  avatar: string;
  color: string;
  permissions: string[];
}

const DEMO_USERS: DemoUser[] = [
  {
    id: 'admin',
    name: 'Alex Administrator',
    email: 'admin@claritykit.demo',
    role: 'ADMIN',
    roleLabel: 'Administrator',
    description: 'Full system access - manage users, orgs, settings',
    organization: 'ClarityKit Platform',
    avatar: '👑',
    color: 'purple',
    permissions: ['View all assessments', 'Manage users', 'System settings', 'Analytics dashboard']
  },
  {
    id: 'exec',
    name: 'Emma Executive',
    email: 'emma.exec@acme.demo',
    role: 'EXEC',
    roleLabel: 'Executive Sponsor',
    description: 'Creates assessments, sees strategic dashboards',
    organization: 'Acme Corporation',
    avatar: '👔',
    color: 'blue',
    permissions: ['Create assessments', 'Invite participants', 'View results', 'Export reports']
  },
  {
    id: 'business',
    name: 'Brian Business',
    email: 'brian.owner@acme.demo',
    role: 'BUSINESS_OWNER',
    roleLabel: 'Business Owner',
    description: 'Completes surveys, provides process knowledge',
    organization: 'Acme Corporation',
    avatar: '📊',
    color: 'green',
    permissions: ['Complete assigned surveys', 'View own responses', 'See summary results']
  },
  {
    id: 'tech',
    name: 'Tanya Technical',
    email: 'tanya.tech@acme.demo',
    role: 'TECH_OWNER',
    roleLabel: 'Technical Owner',
    description: 'Answers technical feasibility questions',
    organization: 'Acme Corporation',
    avatar: '💻',
    color: 'cyan',
    permissions: ['Complete assigned surveys', 'View own responses', 'Technical assessment']
  },
  {
    id: 'user',
    name: 'Uma User',
    email: 'uma.enduser@acme.demo',
    role: 'USER',
    roleLabel: 'End User',
    description: 'Provides day-to-day process reality',
    organization: 'Acme Corporation',
    avatar: '👤',
    color: 'amber',
    permissions: ['Complete assigned surveys', 'Provide feedback']
  },
  {
    id: 'process',
    name: 'Pete Process',
    email: 'pete.process@acme.demo',
    role: 'PROCESS_OWNER',
    roleLabel: 'Process Owner',
    description: 'Assesses process maturity and automation readiness',
    organization: 'Acme Corporation',
    avatar: '⚙️',
    color: 'orange',
    permissions: ['Complete process surveys', 'Document workflows', 'Assess readiness']
  },
];

const ROLE_GROUPS = [
  {
    title: 'Platform Admin',
    subtitle: 'Full system access and management',
    icon: Shield,
    users: DEMO_USERS.filter(u => u.role === 'ADMIN')
  },
  {
    title: 'Executive Sponsor',
    subtitle: 'Creates and manages assessments',
    icon: Briefcase,
    users: DEMO_USERS.filter(u => u.role === 'EXEC')
  },
  {
    title: 'Survey Participants',
    subtitle: 'Responds to surveys with role-specific expertise',
    icon: Users,
    users: DEMO_USERS.filter(u => ['BUSINESS_OWNER', 'TECH_OWNER', 'USER', 'PROCESS_OWNER'].includes(u.role))
  }
];

// =============================================================================
// COMPONENTS
// =============================================================================

function UserCard({ user, isActive, onSelect }: { user: DemoUser; isActive: boolean; onSelect: () => void }) {
  const colorClasses: Record<string, string> = {
    purple: 'bg-purple-500/10 border-purple-500/30 hover:border-purple-500',
    blue: 'bg-brand-green/10 border-brand-green/30 hover:border-blue-500',
    green: 'bg-green-500/10 border-green-500/30 hover:border-green-500',
    cyan: 'bg-cyan-500/10 border-cyan-500/30 hover:border-cyan-500',
    amber: 'bg-amber-500/10 border-amber-500/30 hover:border-amber-500',
    orange: 'bg-orange-500/10 border-orange-500/30 hover:border-orange-500',
  };

  const badgeClasses: Record<string, string> = {
    purple: 'bg-purple-500 text-white',
    blue: 'bg-brand-green/100 text-white',
    green: 'bg-green-500 text-white',
    cyan: 'bg-cyan-500 text-white',
    amber: 'bg-amber-500 text-white',
    orange: 'bg-orange-500 text-white',
  };

  return (
    <div className={`p-4 rounded-xl border-2 transition-all ${colorClasses[user.color]} ${isActive ? 'ring-2 ring-brand-green' : ''}`}>
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-brand-grey-light flex items-center justify-center text-2xl">
          {user.avatar}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold">{user.name}</h4>
          <p className="text-sm text-brand-grey">{user.email}</p>
          <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${badgeClasses[user.color]}`}>
            {user.roleLabel}
          </span>
        </div>
      </div>
      <p className="text-sm text-brand-grey mb-3">{user.description}</p>
      <div className="text-xs text-brand-grey mb-3">
        <span className="uppercase tracking-wide">Organization</span>
        <p className="text-brand-grey font-medium">{user.organization}</p>
      </div>
      {isActive ? (
        <div className="flex items-center justify-center gap-2 py-2 bg-brand-green text-white rounded-lg font-medium">
          <CheckCircle className="w-4 h-4" />
          Currently Active
        </div>
      ) : (
        <button 
          onClick={onSelect}
          className="w-full flex items-center justify-center gap-2 py-2 bg-brand-grey-medium hover:bg-brand-grey rounded-lg text-sm transition-colors"
        >
          Login as {user.name.split(' ')[0]}
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function DemoLoginPage() {
  const router = useRouter();
  const [activeUser, setActiveUser] = useState<string>('business');
  const [isLoading, setIsLoading] = useState(false);

  const handleUserSelect = (userId: string) => {
    setIsLoading(true);
    setActiveUser(userId);
    
    // Store in localStorage for demo persistence
    localStorage.setItem('demoUser', userId);
    
    // Simulate login delay and route based on role
    setTimeout(() => {
      const user = DEMO_USERS.find(u => u.id === userId);
      if (user?.role === 'ADMIN') {
        router.push('/demo/admin');
      } else if (user?.role === 'EXEC') {
        router.push('/demo/dashboard');
      } else {
        router.push('/demo/survey');
      }
    }, 500);
  };

  const currentUser = DEMO_USERS.find(u => u.id === activeUser);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-brand-grey-medium">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-brand-green" />
            <div>
              <span className="font-bold text-lg text-brand-green">ELVAIT</span>
              <span className="text-xs text-brand-grey block">DEMO LOGIN</span>
            </div>
          </Link>
          {currentUser && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-grey-light rounded-lg">
              <span className="text-xs text-brand-grey">Currently logged in as</span>
              <span className="font-medium">{currentUser.name}</span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Demo Banner */}
        <div className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full w-fit mx-auto mb-8">
          <Info className="w-4 h-4 text-amber-500" />
          <span className="text-sm text-amber-400">Demo Environment - No Real Data</span>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose a Demo User</h1>
          <p className="text-brand-grey max-w-xl mx-auto">
            Select a role to explore ELVAIT from different perspectives. Each role has different permissions and views.
          </p>
        </div>

        {/* User Groups */}
        <div className="space-y-12">
          {ROLE_GROUPS.map((group, groupIndex) => (
            <div key={groupIndex}>
              <div className="flex items-center gap-3 mb-6">
                <group.icon className="w-6 h-6 text-brand-green" />
                <div>
                  <h2 className="text-xl font-semibold">{group.title}</h2>
                  <p className="text-sm text-brand-grey">{group.subtitle}</p>
                </div>
              </div>
              <div className={`grid gap-4 ${group.users.length > 2 ? 'md:grid-cols-3' : 'md:grid-cols-2 max-w-3xl'}`}>
                {group.users.map(user => (
                  <UserCard 
                    key={user.id}
                    user={user}
                    isActive={activeUser === user.id}
                    onSelect={() => handleUserSelect(user.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="mt-16 p-6 bg-white rounded-2xl border border-brand-grey-medium">
          <h3 className="font-semibold mb-4">How the demo works</h3>
          <div className="space-y-3 text-sm text-brand-grey">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-brand-green mt-0.5" />
              <span><strong className="text-white">Admin</strong> can access the admin panel, manage users, and view all assessments</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-brand-green mt-0.5" />
              <span><strong className="text-white">Executive Sponsor</strong> can create new assessments and invite participants</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-brand-green mt-0.5" />
              <span><strong className="text-white">Other roles</strong> see their assigned surveys and can complete them</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-brand-green mt-0.5" />
              <span>Switch between users anytime to see different perspectives</span>
            </div>
          </div>
        </div>

        {/* Back to main demo */}
        <div className="mt-8 text-center">
          <Link href="/demo" className="text-brand-green hover:text-brand-green/80 text-sm">
            ← Back to scenario-based demo
          </Link>
        </div>
      </main>

      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="w-8 h-8 border-2 border-brand-green border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p>Switching to {currentUser?.name}...</p>
          </div>
        </div>
      )}
    </div>
  );
}
