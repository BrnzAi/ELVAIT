'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle,
  FileText,
  Search,
  Shield,
  Target,
  Users,
  XCircle,
} from 'lucide-react';
import { UserMenu } from '@/components/auth';

const demoCases = [
  {
    title: 'Customer Service AI Automation',
    context: 'Should the team invest €200k in a tier-1 support chatbot?',
    result: 'GO',
    score: 87,
    tone: 'green',
    finding: 'Clear ownership, validated business value, realistic implementation risk.',
    action: 'Proceed with defined success metrics and implementation roadmap.',
  },
  {
    title: 'Marketing Automation Platform',
    context: 'Should marketing move to an enterprise automation platform?',
    result: 'FIX FIRST',
    score: 68,
    tone: 'amber',
    finding: 'ROI assumptions exist, but baseline metrics and stakeholder alignment are incomplete.',
    action: 'Run a pilot, document conversion baselines, and align KPIs before commitment.',
  },
  {
    title: 'ERP System Modernization',
    context: 'Should finance replace legacy SAP with S/4HANA Cloud?',
    result: 'NO-GO',
    score: 72,
    tone: 'red',
    finding: 'High apparent clarity is overridden by an ownership crisis across roles.',
    action: 'Define one accountable owner and decision rights before the project moves forward.',
  },
  {
    title: 'Digital Twin Factory',
    context: 'Should operations build a digital twin for manufacturing optimization?',
    result: 'NO-GO',
    score: 76,
    tone: 'red',
    finding: 'Both business and technical teams deny trade-offs, revealing capacity illusion.',
    action: 'Reassess capacity, decide what will be deprioritized, and secure explicit resources.',
  },
];

const resultCards = [
  {
    title: 'GO',
    icon: CheckCircle,
    className: 'border-brand-green/50 bg-brand-green/10',
    iconClass: 'bg-brand-green text-black',
    text: 'The project is structurally clear enough to proceed: goals, value, ownership, risks, and readiness are aligned.',
  },
  {
    title: 'FIX FIRST',
    icon: AlertTriangle,
    className: 'border-amber-400/60 bg-amber-400/10',
    iconClass: 'bg-amber-400 text-black',
    text: 'The idea may be valid, but concrete gaps must be closed before budget, people, or delivery work are committed.',
  },
  {
    title: 'NO-GO',
    icon: XCircle,
    className: 'border-brand-red/60 bg-brand-red/15',
    iconClass: 'bg-brand-red text-white',
    text: 'The project has structural risks that would likely cause failure, waste, or escalation if launched now.',
  },
];

const signalCards = [
  {
    icon: Users,
    title: 'Stakeholder misalignment',
    text: 'Compare executive, business, technical, and process-owner perspectives before they collide in delivery.',
  },
  {
    icon: Target,
    title: 'Unclear value logic',
    text: 'Separate documented business value from assumptions, wishes, and narrative confidence.',
  },
  {
    icon: Shield,
    title: 'Ownership & governance gaps',
    text: 'Expose who owns the outcome, the process, the decision, and the consequences if it fails.',
  },
  {
    icon: BarChart3,
    title: 'Readiness and capacity risk',
    text: 'Detect whether the organization is actually ready to absorb the project work and change.',
  },
];

const toneStyles: Record<string, string> = {
  green: 'border-brand-green bg-brand-green/10 text-brand-green',
  amber: 'border-amber-400 bg-amber-400/10 text-amber-300',
  red: 'border-brand-red bg-brand-red/10 text-brand-red',
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="relative overflow-hidden bg-brand-darkgrey text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(178,220,39,0.16),transparent_35%)]" />

        <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <Image src="/logo-full.png" alt="ELVAIT" width={140} height={40} className="h-8 w-auto" priority />
          <div className="flex items-center gap-5 text-sm md:text-base">
            <Link href="#demo-cases" className="text-white/80 hover:text-white transition">
              Demo cases
            </Link>
            <Link href="https://elvait.ai/demo" className="text-white/80 hover:text-white transition">
              Product demo
            </Link>
            <UserMenu />
          </div>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32 text-center">
          <p className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/85 text-sm mb-8">
            <Search className="w-4 h-4 text-brand-green" />
            First step in project management &amp; preparation
          </p>

          <p className="text-4xl md:text-6xl font-extrabold text-brand-green mb-6 leading-tight">
            Clarity Before Projects
          </p>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold max-w-5xl mx-auto leading-tight mb-8">
            Know if a project is ready before you commit budget, people, or delivery time.
          </h1>

          <p className="text-lg md:text-xl text-white/75 max-w-3xl mx-auto mb-6 leading-relaxed">
            ELVAIT Clarity Engine turns early project ideas into a structured readiness signal — exposing unclear goals,
            hidden assumptions, stakeholder misalignment, ownership gaps, and delivery risks before the demo session or kickoff.
          </p>

          <p className="text-lg md:text-xl text-white font-semibold max-w-3xl mx-auto mb-10">
            Not only for IT: use it as the first preparation step for automation, AI, transformation, operations, process, and strategic initiatives.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="#demo-cases"
              className="w-full sm:w-auto px-8 py-4 bg-brand-green text-black rounded-xl font-semibold text-lg hover:bg-brand-green/80 transition flex items-center justify-center gap-2"
            >
              View demo cases &amp; results
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="https://elvait.ai/demo"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition"
            >
              Open product demo
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="py-20 bg-white border-b border-brand-grey-medium">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-6">
              {signalCards.map((item) => (
                <div key={item.title} className="rounded-2xl border border-brand-grey-medium bg-white p-6 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-brand-grey-light flex items-center justify-center mb-5">
                    <item.icon className="w-6 h-6 text-black" />
                  </div>
                  <h2 className="text-xl font-bold mb-3">{item.title}</h2>
                  <p className="text-brand-grey leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="demo-cases" className="py-24 bg-brand-grey-light">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand-red mb-4">Demo cases &amp; results</p>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-5">See what the product reveals before your demo session.</h2>
              <p className="text-xl text-brand-grey">
                Each case shows how the Clarity Engine converts stakeholder input into a concrete project-readiness result,
                with score, risk pattern, and next action.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {demoCases.map((item) => (
                <article key={item.title} className="bg-white rounded-3xl border border-brand-grey-medium shadow-lg p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                      <p className="text-brand-grey">{item.context}</p>
                    </div>
                    <div className={`shrink-0 rounded-2xl border px-4 py-3 text-center ${toneStyles[item.tone]}`}>
                      <div className="text-xs uppercase tracking-wider font-bold">Result</div>
                      <div className="text-xl font-extrabold text-current">{item.result}</div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-[120px_1fr] gap-6 items-center">
                    <div className="rounded-2xl bg-brand-darkgrey text-white p-5 text-center">
                      <div className="text-4xl font-extrabold">{item.score}</div>
                      <div className="text-xs text-white/60 uppercase tracking-wider">Clarity score</div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-black mb-1">What ELVAIT found</p>
                        <p className="text-brand-grey">{item.finding}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-black mb-1">Recommended next step</p>
                        <p className="text-brand-grey">{item.action}</p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="https://elvait.ai/demo"
                className="inline-flex items-center gap-2 px-7 py-4 bg-black text-white rounded-xl font-semibold hover:bg-black/80 transition"
              >
                Open full product demo
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        <section className="py-24 bg-brand-darkgrey text-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand-green mb-4">Outcome model</p>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-5">One clear readiness signal after structured input.</h2>
              <p className="text-xl text-white/70">
                Results are designed for project preparation: what is ready, what must be clarified, and what should not proceed yet.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {resultCards.map((item) => (
                <div key={item.title} className={`rounded-3xl p-8 border-2 ${item.className}`}>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 ${item.iconClass}`}>
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-white/70 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <FileText className="w-12 h-12 mx-auto text-brand-red mb-6" />
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Use ELVAIT before the project becomes expensive.</h2>
            <p className="text-xl text-brand-grey max-w-3xl mx-auto mb-10">
              Prepare the demo conversation with concrete examples, visible risk patterns, and a shared language for project readiness.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="#demo-cases"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-green text-black rounded-xl font-semibold text-lg hover:bg-brand-green/80 transition"
              >
                Explore demo cases
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-brand-grey-light text-black rounded-xl font-semibold text-lg hover:bg-brand-grey-medium transition"
              >
                Book a demo session
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-10 bg-brand-darkgrey text-brand-grey">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <Image src="/logo-full.png" alt="ELVAIT" width={120} height={34} className="h-6 w-auto" />
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <Link href="#demo-cases" className="hover:text-white transition">Demo cases</Link>
            <Link href="https://elvait.ai/demo" className="hover:text-white transition">Product demo</Link>
            <Link href="/contact" className="hover:text-white transition">Contact</Link>
          </div>
          <div className="text-sm">© 2026 ELVAIT. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
