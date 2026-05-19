'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle,
  ClipboardList,
  FileText,
  Mail,
  PlayCircle,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const STEPS = [
  { label: 'Create assessment', icon: FileText },
  { label: 'Invite roles', icon: Users },
  { label: 'Collect responses', icon: ClipboardList },
  { label: 'Review results', icon: BarChart3 },
];

const CASE = {
  title: 'Marketing Automation Platform',
  description: 'Implement marketing automation for lead nurturing and campaign management.',
  decision: 'Whether to invest in HubSpot Marketing Hub Enterprise',
  success: '30% increase in qualified leads, better attribution, and faster campaign execution.',
  doingNothing: 'Manual email campaigns continue, inconsistent follow-up, and weak conversion visibility.',
  mistake: 'Low adoption by marketing team, poor CRM integration, and unvalidated ROI assumptions.',
  intake: '13 May 2026',
  surveyWindow: '14–18 May 2026',
  decisionReview: '21 May 2026',
};

const PARTICIPANTS = [
  { role: 'Executive Sponsor', name: 'James Wilson', email: 'james.wilson@acme.demo', status: 'Completed', score: 78 },
  { role: 'Business Owner', name: 'Anna Lee', email: 'anna.lee@acme.demo', status: 'Completed', score: 66 },
  { role: 'Technical Owner', name: 'David Kim', email: 'david.kim@acme.demo', status: 'Completed', score: 61 },
  { role: 'Process Owner', name: 'Maya Patel', email: 'maya.patel@acme.demo', status: 'Completed', score: 67 },
];

const RESPONSES = [
  { question: 'Expected benefits are clearly quantified', executive: 'Agree', business: 'Neutral', technical: 'Neutral' },
  { question: 'Evidence supports the expected value', executive: 'Pilot assumptions', business: 'Assumptions only', technical: 'No baseline yet' },
  { question: 'CRM integration risk is understood', executive: 'Mostly', business: 'Partly', technical: 'Needs discovery' },
  { question: 'Team has capacity for the change', executive: 'Yes', business: 'Unclear', technical: 'Resource conflict' },
];

const DIMENSIONS = [
  { label: 'Strategic Alignment', value: 72 },
  { label: 'Value Clarity', value: 65 },
  { label: 'Organizational Readiness', value: 58 },
  { label: 'Risk & Feasibility', value: 70 },
  { label: 'Ownership', value: 75 },
];

function Stepper({ step }: { step: number }) {
  return (
    <div className="grid md:grid-cols-4 gap-3 mb-8">
      {STEPS.map((item, index) => {
        const Icon = item.icon;
        const active = index === step;
        const done = index < step;
        return (
          <div
            key={item.label}
            className={`rounded-2xl border p-4 transition-all ${
              active
                ? 'border-brand-green bg-brand-green/10 text-white'
                : done
                  ? 'border-green-500/40 bg-green-500/10 text-white'
                  : 'border-white/[0.08] bg-white/[0.03] text-brand-grey'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${active || done ? 'bg-brand-green text-black' : 'bg-white/[0.06]'}`}>
                {done ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider opacity-70">Step {index + 1}</p>
                <p className="font-semibold text-sm">{item.label}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DateCards() {
  return (
    <div className="grid md:grid-cols-3 gap-3">
      {[
        ['Intake', CASE.intake],
        ['Survey window', CASE.surveyWindow],
        ['Decision review', CASE.decisionReview],
      ].map(([label, value]) => (
        <div key={label} className="rounded-xl bg-brand-darkgrey border border-white/[0.08] p-4">
          <div className="flex items-center gap-2 text-brand-green mb-1">
            <Calendar className="w-4 h-4" />
            <p className="text-xs uppercase tracking-wider font-bold">{label}</p>
          </div>
          <p className="font-semibold text-white">{value}</p>
        </div>
      ))}
    </div>
  );
}

export default function FullDemoAssessmentPage() {
  const [step, setStep] = useState(0);
  const progress = useMemo(() => Math.round(((step + 1) / STEPS.length) * 100), [step]);

  return (
    <div className="min-h-screen bg-brand-darkgrey text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(178,220,39,0.14),transparent_35%)]" />
      <div className="relative z-10">
        <header className="border-b border-white/[0.08] bg-white/[0.02] backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/demo/login" className="flex items-center gap-2 text-brand-grey hover:text-white">
              <ArrowLeft className="w-5 h-5" />
              Back to demo login
            </Link>
            <div className="flex items-center gap-2 text-sm text-brand-grey">
              <PlayCircle className="w-5 h-5 text-brand-green" />
              Full product demo
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-10">
          <div className="mb-8">
            <p className="text-brand-green uppercase tracking-[0.25em] text-xs font-bold mb-3">As if you fully used ELVAIT</p>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Create and complete a full assessment demo</h1>
            <p className="text-brand-grey max-w-3xl text-lg">
              This walkthrough uses the real demo case with dates filled in, then simulates the full product flow: setup, role invitations, stakeholder responses, and final readiness result.
            </p>
          </div>

          <Stepper step={step} />

          <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden mb-8">
            <div className="h-full bg-brand-green rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>

          <section className="bg-white text-gray-900 rounded-3xl border border-white/[0.12] shadow-2xl p-6 md:p-8 min-h-[520px]">
            {step === 0 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">1. Assessment setup</h2>
                  <p className="text-gray-600">The form is pre-filled so Katia can see the complete product experience without inventing data.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-semibold">Assessment title</label>
                    <Input value={CASE.title} readOnly className="mt-2" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold">Assessment type</label>
                    <Input value="CORE readiness assessment" readOnly className="mt-2" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold">Description</label>
                  <Textarea value={CASE.description} readOnly className="mt-2 min-h-[90px]" />
                </div>
                <DateCards />
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    ['What decision are we making?', CASE.decision],
                    ['What does success look like?', CASE.success],
                    ['What if we do nothing?', CASE.doingNothing],
                    ['What could make this a mistake?', CASE.mistake],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                      <p className="text-sm text-gray-500 mb-1">{label}</p>
                      <p className="font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">2. Invite stakeholders</h2>
                  <p className="text-gray-600">ELVAIT collects role-specific perspectives instead of relying on one optimistic project narrative.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {PARTICIPANTS.map((person) => (
                    <div key={person.email} className="rounded-2xl border border-gray-200 p-5 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-brand-green/20 flex items-center justify-center">
                        <Mail className="w-6 h-6 text-brand-green" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="font-bold">{person.name}</h3>
                          <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Invited</span>
                        </div>
                        <p className="text-sm text-gray-500">{person.role}</p>
                        <p className="text-sm text-gray-500">{person.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl bg-brand-green/10 border border-brand-green/30 p-5">
                  <p className="font-semibold text-black">Demo email timeline</p>
                  <p className="text-gray-600 mt-1">Invites sent on {CASE.intake}. Responses collected during {CASE.surveyWindow}. Review scheduled for {CASE.decisionReview}.</p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">3. Completed role responses</h2>
                  <p className="text-gray-600">This screen simulates the product after every participant has answered their survey.</p>
                </div>
                <div className="grid md:grid-cols-4 gap-4">
                  {PARTICIPANTS.map((person) => (
                    <div key={person.email} className="rounded-2xl bg-gray-50 border border-gray-200 p-4 text-center">
                      <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="font-bold">{person.status}</p>
                      <p className="text-sm text-gray-500">{person.role}</p>
                      <p className="text-2xl font-extrabold mt-3">{person.score}</p>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">role signal</p>
                    </div>
                  ))}
                </div>
                <div className="overflow-hidden rounded-2xl border border-gray-200">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                      <tr>
                        <th className="p-4 text-left">Question signal</th>
                        <th className="p-4 text-left">Executive</th>
                        <th className="p-4 text-left">Business</th>
                        <th className="p-4 text-left">Technical</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {RESPONSES.map((row) => (
                        <tr key={row.question}>
                          <td className="p-4 font-medium">{row.question}</td>
                          <td className="p-4 text-gray-600">{row.executive}</td>
                          <td className="p-4 text-gray-600">{row.business}</td>
                          <td className="p-4 text-gray-600">{row.technical}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">4. Final readiness result</h2>
                    <p className="text-gray-600 max-w-2xl">The product turns the completed assessment into a decision signal, key risks, and next actions.</p>
                  </div>
                  <div className="rounded-2xl border border-amber-300 bg-amber-50 px-6 py-4 text-center">
                    <p className="text-xs uppercase tracking-wider text-amber-700 font-bold">Recommendation</p>
                    <p className="text-3xl font-extrabold text-amber-700">FIX FIRST</p>
                    <p className="text-sm text-amber-700">Clarity score 68/100</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {DIMENSIONS.map((dimension) => (
                    <div key={dimension.label} className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{dimension.label}</span>
                        <span className="font-bold">{dimension.value}/100</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full ${dimension.value >= 70 ? 'bg-green-500' : dimension.value >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${dimension.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                    <h3 className="font-bold text-amber-800 mb-2">What ELVAIT found</h3>
                    <p className="text-amber-900">ROI assumptions exist, but baseline metrics and CRM integration risks are not validated enough to commit budget.</p>
                  </div>
                  <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
                    <h3 className="font-bold text-green-800 mb-2">Recommended next step</h3>
                    <p className="text-green-900">Run a two-week pilot, document current conversion baselines, and align success KPIs before final approval.</p>
                  </div>
                </div>
                <Link href="/demo/results/2">
                  <Button size="lg" className="w-full">
                    Open detailed results dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </section>

          <div className="flex items-center justify-between mt-8">
            <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Link href="/demo/results/2">
                <Button>
                  Finish demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
