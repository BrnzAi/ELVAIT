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

interface AssessmentProcess {
  id: string;
  name: string;
  description: string | null;
  weight: number;
  sortOrder: number;
}

interface Participant {
  id: string;
  role: string;
  email: string | null;
  name: string | null;
  token: string;
  status: string;
  surveyUrl: string;
  assignedProcesses?: AssessmentProcess[];
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
  processes: AssessmentProcess[];
  _count: { responses: number; participants: number };
  completedParticipants: number;
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
  const [selectedProcesses, setSelectedProcesses] = useState<string[]>([]);
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
      const needsProcessSelection = (role === 'PROCESS_OWNER' || role === 'USER') && caseData?.processes && caseData.processes.length > 0;
      
      const response = await fetch(`/api/cases/${params.id}/participants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          name: newParticipant.name || null,
          email: newParticipant.email || null,
          processIds: needsProcessSelection ? selectedProcesses : undefined
        })
      });
      
      if (!response.ok) throw new Error('Failed to add participant');
      
      setNewParticipant({ name: '', email: '' });
      setSelectedProcesses([]);
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
        <Loader2 className="w-8 h-8 animate-spin text-brand-green" />
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error || 'Case not found'}</p>
          <Link href="/" className="text-brand-green hover:underline mt-4 block">
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            <span>My Assessments</span>
          </Link>
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-brand-green" />
            <span className="font-semibold">Assessment</span>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            caseData.status === 'DRAFT' ? 'bg-gray-100 text-gray-700' :
            caseData.status === 'ACTIVE' ? 'bg-brand-green/10 text-brand-green' :
            'bg-green-100 text-green-700'
          }`}>
            {caseData.status}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Case Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">{caseData.decisionTitle}</h1>
              <p className="text-gray-600">{caseData.decisionDescription}</p>
            </div>
          </div>
          
          {/* Prominent Results Banner */}
          {caseData.completedParticipants > 0 && (
            <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-900">Results Available!</p>
                    <p className="text-sm text-green-700">{caseData.completedParticipants} participant{caseData.completedParticipants !== 1 ? 's' : ''} completed</p>
                  </div>
                </div>
                <Link href={`/cases/${caseData.id}/results`}>
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-6">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    View Results & Recommendation
                  </Button>
                </Link>
              </div>
            </div>
          )}
          
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
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Participants ({completedCount}/{totalParticipants} completed)
          </h2>
          
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-6">
            <div 
              className="h-full bg-brand-green transition-all"
              style={{ width: `${totalParticipants > 0 ? (completedCount / totalParticipants) * 100 : 0}%` }}
            />
          </div>

          <div className="space-y-4">
            {participantsByRole.map(({ role, label, participants }) => (
              <div key={role} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">{label}</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (addingRole === role) {
                        setAddingRole(null);
                        setSelectedProcesses([]);
                      } else {
                        setAddingRole(role);
                        // Default to all processes for PROCESS_OWNER and USER roles
                        if ((role === 'PROCESS_OWNER' || role === 'USER') && caseData?.processes) {
                          setSelectedProcesses(caseData.processes.map(p => p.id));
                        } else {
                          setSelectedProcesses([]);
                        }
                      }
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>

                {addingRole === role && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
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
                    
                    {/* Process selection for PROCESS_OWNER and USER roles */}
                    {(role === 'PROCESS_OWNER' || role === 'USER') && caseData?.processes && caseData.processes.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Assign to processes:
                        </label>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {caseData.processes.map(process => (
                            <label key={process.id} className="flex items-start gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedProcesses.includes(process.id)}
                                onChange={e => {
                                  if (e.target.checked) {
                                    setSelectedProcesses(prev => [...prev, process.id]);
                                  } else {
                                    setSelectedProcesses(prev => prev.filter(id => id !== process.id));
                                  }
                                }}
                                className="mt-1"
                              />
                              <div>
                                <div className="text-sm font-medium">{process.name}</div>
                                {process.description && (
                                  <div className="text-xs text-gray-500">{process.description}</div>
                                )}
                              </div>
                            </label>
                          ))}
                        </div>
                        {selectedProcesses.length === 0 && (
                          <p className="text-xs text-red-600">At least one process must be selected</p>
                        )}
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => addParticipant(role)}
                        disabled={(role === 'PROCESS_OWNER' || role === 'USER') && selectedProcesses.length === 0}
                      >
                        Create Link
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => {
                        setAddingRole(null);
                        setSelectedProcesses([]);
                      }}>
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
                      <div key={p.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {p.status === 'COMPLETED' ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : p.status === 'IN_PROGRESS' ? (
                            <Circle className="w-5 h-5 text-amber-500 fill-amber-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-brand-grey" />
                          )}
                          <div>
                            <p className="text-sm font-medium">
                              {p.name || p.email || 'Anonymous'}
                            </p>
                            <p className="text-xs text-gray-500">{p.status.toLowerCase()}</p>
                            {p.assignedProcesses && p.assignedProcesses.length > 0 && (
                              <p className="text-xs text-gray-500">
                                Processes: {p.assignedProcesses.map(proc => proc.name).join(', ')}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyLink(p.surveyUrl, p.token)}
                            className="flex items-center gap-1 text-sm text-brand-green hover:text-black"
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
        <div className="bg-white rounded-xl border border-gray-200 p-6">
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
