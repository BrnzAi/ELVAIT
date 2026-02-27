'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ArrowLeft, ArrowRight, Brain, Check, Users, Zap, FileText, AlertCircle, Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TIER_LIMITS, Tier } from '@/lib/tiers';
import ProcessEditor, { ProcessEntry } from '@/components/cases/ProcessEditor';

type KitVariant = 'QUICK_CHECK' | 'CORE' | 'FULL' | 'PROCESS_STANDALONE';

interface FormData {
  variant: KitVariant;
  decisionTitle: string;
  investmentType: string;
  decisionDescription: string;
  impactedAreas: string[];
  timeHorizon: string;
  estimatedInvestment: string;
  processes: ProcessEntry[];
  dCtx1: string;
  dCtx2: string;
  dCtx3: string;
  dCtx4: string;
}

const VARIANTS = [
  {
    id: 'QUICK_CHECK' as KitVariant,
    name: 'Quick Check',
    description: 'Rapid executive clarity signal focused on strategic intent. Tests whether the initiative is conceptually sound before involving the wider organization.',
    time: '15 min',
    roles: ['Decision Owners'],
    lenses: ['Strategy'],
    icon: Zap,
    color: 'blue'
  },
  {
    id: 'CORE' as KitVariant,
    name: 'Decision Clarity',
    description: 'Cross-functional alignment assessment across strategy, business logic, and technical feasibility. Identifies contradictions between intent, value expectations, and implementation reality — before investment commitment.',
    time: '45 min',
    roles: ['Decision Owners', 'Business Owners', 'Technical Owners'],
    lenses: ['Strategy', 'Business Value', 'Technical Feasibility'],
    icon: Brain,
    color: 'purple'
  },
  {
    id: 'FULL' as KitVariant,
    name: 'Full Assessment',
    description: 'The 360° Clarity Before Automation assessment. Evaluates strategic intent, value logic, technical feasibility, process stability, and operational reality — detecting structural risks before automation amplifies them.',
    time: '60+ min',
    roles: ['Decision Owners', 'Business Owners', 'Technical Owners', 'Process Owners', 'User Representatives'],
    lenses: ['Strategy', 'Business Value', 'Technical Feasibility', 'Process Readiness', 'Operational Reality'],
    icon: FileText,
    color: 'green'
  },
  {
    id: 'PROCESS_STANDALONE' as KitVariant,
    name: 'Process Readiness Scan',
    description: 'Focused assessment of process maturity and operational stability before digitization or automation. Ensures automation will not institutionalize inefficiencies or unclear ownership.',
    time: '20 min',
    roles: ['Process Owners'],
    lenses: ['Process Readiness'],
    icon: Users,
    color: 'amber'
  }
];

const INVESTMENT_TYPES = [
  'AI solution / automation',
  'Software / digital tool',
  'External consultancy / system integrator'
];

const TIME_HORIZONS = ['Immediate', '3-6 months', '>6 months'];

const INVESTMENT_SIZES = ['<€100k', '€100k-€500k', '€500k-€1m', '>€1m'];

const IMPACTED_AREAS = [
  'IT / Technology',
  'Operations',
  'Finance',
  'HR / People',
  'Sales',
  'Marketing',
  'Customer Service',
  'Legal / Compliance',
  'Executive / Strategy'
];

export default function CreateCasePage() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Case limit state
  const [checkingLimit, setCheckingLimit] = useState(true);
  const [limitReached, setLimitReached] = useState(false);
  const [caseCount, setCaseCount] = useState(0);
  const [userTier, setUserTier] = useState<Tier>('free');
  
  const [formData, setFormData] = useState<FormData>({
    variant: 'CORE',
    decisionTitle: '',
    investmentType: '',
    decisionDescription: '',
    impactedAreas: [],
    timeHorizon: '',
    estimatedInvestment: '',
    processes: [{ name: 'Main Process', description: '', weight: 100 }],
    dCtx1: '',
    dCtx2: '',
    dCtx3: '',
    dCtx4: ''
  });

  // Check case limit for authenticated users
  useEffect(() => {
    const checkCaseLimit = async () => {
      if (sessionStatus === 'loading') return;
      
      if (sessionStatus === 'authenticated') {
        try {
          const response = await fetch('/api/cases?countOnly=true');
          if (response.ok) {
            const data = await response.json();
            const count = data.count || 0;
            const tier = data.tier || 'free';
            setCaseCount(count);
            setUserTier(tier as Tier);
            
            const maxCases = TIER_LIMITS[tier as Tier]?.maxCases || 1;
            if (count >= maxCases) {
              setLimitReached(true);
            }
          }
        } catch (err) {
          console.error('Failed to check case limit:', err);
        }
      }
      
      setCheckingLimit(false);
    };
    
    checkCaseLimit();
  }, [sessionStatus]);

  const updateField = (field: keyof FormData, value: string | string[] | ProcessEntry[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const data = await response.json();
        if (data.details && Array.isArray(data.details)) {
          const messages = data.details.map((d: { message: string }) => d.message).join('. ');
          throw new Error(messages || data.error || 'Failed to create assessment');
        }
        throw new Error(data.error || 'Failed to create assessment');
      }
      
      const newCase = await response.json();
      router.push(`/cases/${newCase.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please check all fields and try again.');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return !!formData.variant;
      case 2: {
        const basicValid = formData.decisionTitle.length > 0 && 
                          formData.decisionTitle.length <= 120 &&
                          !!formData.investmentType &&
                          formData.decisionDescription.length > 0 &&
                          formData.decisionDescription.length <= 500 &&
                          formData.impactedAreas.length > 0 &&
                          !!formData.timeHorizon;
        
        // Check process validation for variants that need it
        if (formData.variant === 'FULL' || formData.variant === 'PROCESS_STANDALONE') {
          const processesValid = formData.processes.length >= 1 &&
                                formData.processes.length <= 5 &&
                                formData.processes.every(p => p.name.trim().length > 0 && p.name.length <= 80) &&
                                Math.abs(formData.processes.reduce((sum, p) => sum + p.weight, 0) - 100) < 0.1;
          
          // Check for unique process names
          const names = formData.processes.map(p => p.name.trim().toLowerCase());
          const uniqueNames = new Set(names);
          
          return basicValid && processesValid && names.length === uniqueNames.size;
        }
        
        return basicValid;
      }
      case 3: return formData.dCtx1.length > 0 && 
                     formData.dCtx2.length > 0 && 
                     formData.dCtx3.length > 0 && 
                     formData.dCtx4.length > 0;
      default: return true;
    }
  };

  // Show loading while checking limit
  if (checkingLimit && sessionStatus !== 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-clarity-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show upgrade prompt if limit reached
  if (limitReached) {
    const maxCases = TIER_LIMITS[userTier]?.maxCases || 1;
    
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-clarity-600" />
              <span className="font-semibold">New Assessment</span>
            </div>
            <div />
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-amber-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4">You've used your free assessment</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Your {userTier} plan includes {maxCases} active assessment{maxCases > 1 ? 's' : ''}.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              You currently have <strong>{caseCount}</strong> assessment{caseCount > 1 ? 's' : ''}.
            </p>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-8">
              <h2 className="font-semibold mb-4">Upgrade to create more assessments</h2>
              <div className="grid gap-4 text-left">
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Sparkles className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Try Out — €199/3 months</p>
                    <p className="text-sm text-gray-500">1 full assessment + PDF report (credited to Core)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Sparkles className="w-5 h-5 text-purple-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Core — €1,900/year</p>
                    <p className="text-sm text-gray-500">Up to 10 assessments + PDF reports</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Sparkles className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Advanced — €3,500/year</p>
                    <p className="text-sm text-gray-500">Up to 20 assessments + AI insights</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pricing">
                <Button size="lg">
                  See all plans
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/contact?plan=tryout">
                <Button variant="outline" size="lg">
                  Contact us
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-clarity-600" />
            <span className="font-semibold">New Assessment</span>
          </div>
          <div className="text-sm text-gray-500">Step {step} of 3</div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-6">
          <div className="h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-clarity-600 transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3 text-red-700 dark:text-red-400">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Step 1: Select Variant */}
        {step === 1 && (
          <div>
            <h1 className="text-3xl font-bold mb-2">Select Assessment Type</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Choose the assessment depth based on your decision complexity and available participants.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              {VARIANTS.map(variant => (
                <button
                  key={variant.id}
                  onClick={() => updateField('variant', variant.id)}
                  className={`p-6 rounded-xl border-2 text-left transition-all ${
                    formData.variant === variant.id
                      ? 'border-clarity-600 bg-clarity-50 dark:bg-clarity-900/20'
                      : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-${variant.color}-100 dark:bg-${variant.color}-900/30 flex items-center justify-center`}>
                      <variant.icon className={`w-6 h-6 text-${variant.color}-600`} />
                    </div>
                    {formData.variant === variant.id && (
                      <div className="w-6 h-6 rounded-full bg-clarity-600 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{variant.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{variant.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-500">⏱️ {variant.time}</span>
                    <span className="text-gray-500">👥 {variant.roles.length} role(s)</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {variant.roles.map(role => (
                      <span key={role} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                        {role}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {variant.lenses.map(lens => (
                      <span key={lens} className="px-2 py-0.5 bg-clarity-100 dark:bg-clarity-900/30 text-clarity-700 dark:text-clarity-300 rounded text-xs">
                        🔍 {lens}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Decision Context */}
        {step === 2 && (
          <div>
            <h1 className="text-3xl font-bold mb-2">Decision Context</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Describe the decision you're evaluating. This context will be shown to all participants.
            </p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Decision Title <span className="text-red-500">*</span>
                  <span className="text-gray-400 font-normal ml-2">({formData.decisionTitle.length}/120)</span>
                </label>
                <Input
                  value={formData.decisionTitle}
                  onChange={e => updateField('decisionTitle', e.target.value)}
                  maxLength={120}
                  placeholder="e.g., Customer Service AI Automation"
                />
                <p className="mt-1 text-sm text-gray-500">This cannot be changed after participants start responding.</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Investment Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {INVESTMENT_TYPES.map(type => (
                    <button
                      key={type}
                      onClick={() => updateField('investmentType', type)}
                      className={`p-3 rounded-lg border text-left text-sm transition-all ${
                        formData.investmentType === type
                          ? 'border-clarity-600 bg-clarity-50 dark:bg-clarity-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Decision Description <span className="text-red-500">*</span>
                  <span className="text-gray-400 font-normal ml-2">({formData.decisionDescription.length}/500)</span>
                </label>
                <Textarea
                  value={formData.decisionDescription}
                  onChange={e => updateField('decisionDescription', e.target.value)}
                  maxLength={500}
                  rows={4}
                  placeholder="Describe what you are considering investing in and why this decision exists now..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Impacted Areas <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {IMPACTED_AREAS.map(area => (
                    <button
                      key={area}
                      onClick={() => {
                        const current = formData.impactedAreas;
                        const updated = current.includes(area)
                          ? current.filter(a => a !== area)
                          : [...current, area];
                        updateField('impactedAreas', updated);
                      }}
                      className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${
                        formData.impactedAreas.includes(area)
                          ? 'border-clarity-600 bg-clarity-50 dark:bg-clarity-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
                <p className="mt-1 text-sm text-gray-500">Select all areas that will be impacted by this decision.</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Time Horizon <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                  {TIME_HORIZONS.map(horizon => (
                    <button
                      key={horizon}
                      onClick={() => updateField('timeHorizon', horizon)}
                      className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                        formData.timeHorizon === horizon
                          ? 'border-clarity-600 bg-clarity-50 dark:bg-clarity-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {horizon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Estimated Investment Size <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {INVESTMENT_SIZES.map(size => (
                    <button
                      key={size}
                      onClick={() => updateField('estimatedInvestment', formData.estimatedInvestment === size ? '' : size)}
                      className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                        formData.estimatedInvestment === size
                          ? 'border-clarity-600 bg-clarity-50 dark:bg-clarity-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Process Editor - only for variants that include Process Readiness */}
              {(formData.variant === 'FULL' || formData.variant === 'PROCESS_STANDALONE') && (
                <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                  <ProcessEditor
                    processes={formData.processes}
                    onChange={(processes) => updateField('processes', processes)}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Framing Questions */}
        {step === 3 && (
          <div>
            <h1 className="text-3xl font-bold mb-2">Decision Framing</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Answer these questions to establish clear decision context. Your answers will be shown to all participants.
            </p>
            
            <div className="space-y-6">
              <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                <label className="block text-sm font-medium mb-2">
                  D-CTX-1: What decision are we actually trying to make? <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={formData.dCtx1}
                  onChange={e => updateField('dCtx1', e.target.value)}
                  rows={3}
                  placeholder="Be specific about the decision, not the solution..."
                />
              </div>

              <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                <label className="block text-sm font-medium mb-2">
                  D-CTX-2: What will be different if this decision succeeds? <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={formData.dCtx2}
                  onChange={e => updateField('dCtx2', e.target.value)}
                  rows={3}
                  placeholder="Describe the measurable outcomes of success..."
                />
              </div>

              <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                <label className="block text-sm font-medium mb-2">
                  D-CTX-3: What happens if we do nothing? <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={formData.dCtx3}
                  onChange={e => updateField('dCtx3', e.target.value)}
                  rows={3}
                  placeholder="What are the consequences of inaction..."
                />
              </div>

              <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                <label className="block text-sm font-medium mb-2">
                  D-CTX-4: What would make this decision a mistake in hindsight? <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={formData.dCtx4}
                  onChange={e => updateField('dCtx4', e.target.value)}
                  rows={3}
                  placeholder="What risks or assumptions could prove fatal..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
          <Button
            variant="outline"
            onClick={() => setStep(s => s - 1)}
            disabled={step === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {step < 3 ? (
            <Button
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || loading}
            >
              {loading ? 'Creating...' : 'Create Assessment'}
              {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
