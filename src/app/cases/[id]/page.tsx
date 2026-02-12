'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Brain, Users, Plus, Copy, Check, 
  ExternalLink, BarChart3, Clock, AlertCircle,
  CheckCircle, Circle, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Participant {
  id: string;
  role: string;
  email: string | null;
  name: string | null;
  token: string;
  status: string;
  surveyUrl: string;
}

interface CaseData {
  id: string;
  variant: string;
  status: string;
  decisionTitle: string;
  decisionDescription: string;
  investmentType: string;
  timeHorizon: string;
  dCtx1: string;
  dCtx2: string;
  dCtx3: string;
  dCtx4: string;
  createdAt: string;
  firstResponseAt: string | null;
  participants: Participant[];
  _count: { responses: number };
}

const ROLE_LABELS: Record<string, string> = {
  EXEC: 'Executive',
  BUSINESS_OWNER: 'Business Owner',
  TECH_OWNER: 'Technical Owner',
  USER: 'Functional User',
  PROCESS_OWNER: 'Process Owner'
};

const VARIANT_ROLES: Record<string, string[]> = {
  QUICK_CHECK: ['EXEC'],
  CORE: ['EXEC', 'BUSINESS_OWNER', 'TECH_OWNER'],
  FULL: ['EXEC', 'BUSINESS_OWNER', 'TECH_OWNER', 'PROCESS_OWNER'],
  PROCESS_STANDALONE: ['PROCESS_OWNER']
};

export default function CaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingRole, setAddingRole] = useState<string | null>(null);
  const [newParticipant, setNewParticipant] = useState({ name: '', email: '' });
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const fetchCase = async () => {
    try {
      const response = await fetch(`/api/cases/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch case');
      const data = await response.json();
      setCaseData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCase();
  }, [params.id]);

  const addParticipant = async (role: string) => {
    try {
      const response = await fetch(`/api/cases/${params.id}/participants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          name: newParticipant.name || null,
          email: newParticipant.email || null
        })
      });
      
      if (!response.ok) throw new Error('Failed to add participant');
      
      setNewParticipant({ name: '', email: '' });
      setAddingRole(null);
      fetchCase();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add participant');
    }
  };

  const copyLink = (url: string, token: string) => {
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-clarity-600" />
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error || 'Case not found'}</p>
          <Link href="/" className="text-clarity-600 hover:underline mt-4 block">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  const availableRoles = VARIANT_ROLES[caseData.variant] || [];
  const participantsByRole = availableRoles.map(role => ({
    role,
    label: ROLE_LABELS[role],
    participants: caseData.participants.filter(p => p.role === role)
  }));

  const completedCount = caseData.participants.filter(p => p.status === 'COMPLETED').length;
  const totalParticipants = caseData.participants.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-clarity-600" />
            <span className="font-semibold">Assessment</span>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            caseData.status === 'DRAFT' ? 'bg-gray-100 text-gray-700' :
            caseData.status === 'ACTIVE' ? 'bg-blue-100 text-blue-700' :
            'bg-green-100 text-green-700'
          }`}>
            {caseData.status}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Case Info */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">{caseData.decisionTitle}</h1>
              <p className="text-gray-600 dark:text-gray-400">{caseData.decisionDescription}</p>
            </div>
            {caseData._count.responses > 0 && (
              <Link href={`/cases/${caseData.id}/results`}>
                <Button>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Results
                </Button>
              </Link>
            )}
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {caseData.timeHorizon}
            </span>
            <span>•</span>
            <span>{caseData.investmentType}</span>
            <span>•</span>
            <span>{caseData.variant.replace('_', ' ')}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Participants ({completedCount}/{totalParticipants} completed)
          </h2>
          
          <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-6">
            <div 
              className="h-full bg-clarity-600 transition-all"
              style={{ width: `${totalParticipants > 0 ? (completedCount / totalParticipants) * 100 : 0}%` }}
            />
          </div>

          <div className="space-y-4">
            {participantsByRole.map(({ role, label, participants }) => (
              <div key={role} className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">{label}</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAddingRole(addingRole === role ? null : role)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>

                {addingRole === role && (
                  <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
                    <Input
                      placeholder="Name (optional)"
                      value={newParticipant.name}
                      onChange={e => setNewParticipant(p => ({ ...p, name: e.target.value }))}
                    />
                    <Input
                      placeholder="Email (optional)"
                      type="email"
                      value={newParticipant.email}
                      onChange={e => setNewParticipant(p => ({ ...p, email: e.target.value }))}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => addParticipant(role)}>
                        Create Link
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setAddingRole(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {participants.length === 0 ? (
                  <p className="text-sm text-gray-500">No participants added yet</p>
                ) : (
                  <div className="space-y-2">
                    {participants.map(p => (
                      <div key={p.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          {p.status === 'COMPLETED' ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : p.status === 'IN_PROGRESS' ? (
                            <Circle className="w-5 h-5 text-amber-500 fill-amber-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-300" />
                          )}
                          <div>
                            <p className="text-sm font-medium">
                              {p.name || p.email || 'Anonymous'}
                            </p>
                            <p className="text-xs text-gray-500">{p.status.toLowerCase()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyLink(p.surveyUrl, p.token)}
                            className="flex items-center gap-1 text-sm text-clarity-600 hover:text-clarity-700"
                          >
                            {copiedToken === p.token ? (
                              <>
                                <Check className="w-4 h-4" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                Copy Link
                              </>
                            )}
                          </button>
                          <a
                            href={p.surveyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Decision Context */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold mb-4">Decision Context</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">What decision are we actually trying to make?</p>
              <p>{caseData.dCtx1}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">What will be different if this decision succeeds?</p>
              <p>{caseData.dCtx2}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">What happens if we do nothing?</p>
              <p>{caseData.dCtx3}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">What would make this decision a mistake in hindsight?</p>
              <p>{caseData.dCtx4}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
