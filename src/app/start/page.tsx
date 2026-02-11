'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Plus, X, Users, Mail, Brain } from 'lucide-react';

const roles = [
  { id: 'executive', label: 'Executive Sponsor', description: 'Strategic vision, budget, success criteria', required: true },
  { id: 'business_owner', label: 'Business Owner', description: 'Process knowledge, operational requirements', required: true },
  { id: 'technical_owner', label: 'Technical Owner', description: 'Systems, integrations, feasibility', required: true },
  { id: 'end_user', label: 'End User', description: 'Day-to-day reality, practical insights', required: true },
  { id: 'it_security', label: 'IT / Security', description: 'Security, compliance, data governance', required: false },
  { id: 'finance', label: 'Finance', description: 'Cost structure, ROI expectations', required: false },
];

const industries = [
  'Technology', 'Financial Services', 'Healthcare', 'Manufacturing', 
  'Retail', 'Logistics', 'Professional Services', 'Other'
];

const processTypes = [
  'Order Processing', 'Customer Onboarding', 'Invoice Processing', 
  'Data Entry', 'Approval Workflows', 'Reporting', 'Customer Support', 'Other'
];

interface Participant {
  id: string;
  role: string;
  email: string;
  name: string;
}

export default function StartPage() {
  const [step, setStep] = useState(1);
  const [assessmentName, setAssessmentName] = useState('');
  const [description, setDescription] = useState('');
  const [industry, setIndustry] = useState('');
  const [processType, setProcessType] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', role: 'executive', email: '', name: '' },
    { id: '2', role: 'business_owner', email: '', name: '' },
    { id: '3', role: 'technical_owner', email: '', name: '' },
    { id: '4', role: 'end_user', email: '', name: '' },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addParticipant = (roleId: string) => {
    setParticipants([
      ...participants,
      { id: Date.now().toString(), role: roleId, email: '', name: '' }
    ]);
  };

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  const updateParticipant = (id: string, field: 'email' | 'name', value: string) => {
    setParticipants(participants.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // In real implementation, this would call the API
    // For now, simulate a delay and redirect to demo
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Redirect to demo (in real implementation, would redirect to assessment page)
    window.location.href = '/mvp/demo';
  };

  const canProceed = () => {
    if (step === 1) {
      return assessmentName.trim().length > 0;
    }
    if (step === 2) {
      const requiredRoles = ['executive', 'business_owner', 'technical_owner', 'end_user'];
      const filledRoles = participants.filter(p => p.email.trim().length > 0);
      return requiredRoles.every(role => filledRoles.some(p => p.role === role));
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/mvp" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="font-bold text-lg">New Assessment</h1>
            <p className="text-sm text-gray-500">Step {step} of 3</p>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map(s => (
              <div 
                key={s}
                className={`w-8 h-1 rounded-full transition-colors ${
                  s <= step ? 'bg-clarity-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Step 1: Assessment Details */}
        {step === 1 && (
          <div className="animate-in">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-clarity-100 dark:bg-clarity-900/30 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-clarity-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Assessment Details</h2>
                  <p className="text-gray-500 text-sm">Tell us about the process you want to evaluate</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Assessment Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={assessmentName}
                    onChange={(e) => setAssessmentName(e.target.value)}
                    placeholder="e.g., Order Processing Automation"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-clarity-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the process and what you hope to achieve..."
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-clarity-500 focus:border-transparent outline-none transition resize-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Industry</label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-clarity-500 focus:border-transparent outline-none transition"
                    >
                      <option value="">Select industry...</option>
                      {industries.map(ind => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Process Type</label>
                    <select
                      value={processType}
                      onChange={(e) => setProcessType(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-clarity-500 focus:border-transparent outline-none transition"
                    >
                      <option value="">Select type...</option>
                      {processTypes.map(pt => (
                        <option key={pt} value={pt}>{pt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Participants */}
        {step === 2 && (
          <div className="animate-in">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Invite Stakeholders</h2>
                  <p className="text-gray-500 text-sm">Add participants for each role (minimum 4 required)</p>
                </div>
              </div>

              <div className="space-y-6">
                {roles.map(role => {
                  const roleParticipants = participants.filter(p => p.role === role.id);
                  
                  return (
                    <div key={role.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="font-medium">{role.label}</span>
                          {role.required && <span className="text-red-500 ml-1">*</span>}
                          <p className="text-xs text-gray-500">{role.description}</p>
                        </div>
                        <button
                          onClick={() => addParticipant(role.id)}
                          className="p-2 text-clarity-600 hover:bg-clarity-100 dark:hover:bg-clarity-900/30 rounded-lg transition"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>

                      {roleParticipants.length === 0 ? (
                        <button
                          onClick={() => addParticipant(role.id)}
                          className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 hover:border-clarity-400 hover:text-clarity-600 transition"
                        >
                          + Add {role.label}
                        </button>
                      ) : (
                        <div className="space-y-2">
                          {roleParticipants.map(p => (
                            <div key={p.id} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={p.name}
                                onChange={(e) => updateParticipant(p.id, 'name', e.target.value)}
                                placeholder="Name"
                                className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                              />
                              <input
                                type="email"
                                value={p.email}
                                onChange={(e) => updateParticipant(p.id, 'email', e.target.value)}
                                placeholder="Email"
                                className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                              />
                              <button
                                onClick={() => removeParticipant(p.id)}
                                className="p-2 text-gray-400 hover:text-red-500 transition"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Review & Launch */}
        {step === 3 && (
          <div className="animate-in">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Review & Launch</h2>
                  <p className="text-gray-500 text-sm">Confirm details and send survey invitations</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Summary */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <h3 className="font-medium mb-3">Assessment Summary</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Name:</dt>
                      <dd className="font-medium">{assessmentName || 'Untitled'}</dd>
                    </div>
                    {industry && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Industry:</dt>
                        <dd>{industry}</dd>
                      </div>
                    )}
                    {processType && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Process Type:</dt>
                        <dd>{processType}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                {/* Participants */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <h3 className="font-medium mb-3">
                    Participants ({participants.filter(p => p.email).length})
                  </h3>
                  <div className="space-y-2">
                    {participants.filter(p => p.email).map(p => {
                      const role = roles.find(r => r.id === p.role);
                      return (
                        <div key={p.id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">{role?.label}:</span>
                          <span>{p.name || p.email}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* What happens next */}
                <div className="p-4 bg-clarity-50 dark:bg-clarity-900/20 rounded-xl">
                  <h3 className="font-medium text-clarity-700 dark:text-clarity-300 mb-2">What happens next?</h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Each participant receives an email with their unique survey link</li>
                    <li>• Surveys take ~15 minutes to complete</li>
                    <li>• Once all respond, AI analysis runs automatically</li>
                    <li>• You'll receive results within 24 hours</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              step === 1 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-800'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {step < 3 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition ${
                canProceed()
                  ? 'bg-clarity-600 text-white hover:bg-clarity-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Launching...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Launch Assessment
                </>
              )}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
