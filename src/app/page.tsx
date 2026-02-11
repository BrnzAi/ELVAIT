'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle, AlertTriangle, XCircle, Users, Brain, FileText, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-clarity-600 via-clarity-700 to-clarity-900" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        
        <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Clarity Kit</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/demo" className="text-white/80 hover:text-white transition">
              Demo
            </Link>
            <Link 
              href="/start"
              className="px-4 py-2 bg-white text-clarity-700 rounded-lg font-medium hover:bg-gray-100 transition"
            >
              Start Assessment
            </Link>
          </div>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/90 text-sm mb-8">
            <Zap className="w-4 h-4" />
            <span>Stop Automating Chaos</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            Clarity Before<br />
            <span className="text-clarity-200">Automation</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-10">
            Get clarity on <strong className="text-white">what</strong>, <strong className="text-white">whether</strong>, and <strong className="text-white">how</strong> to automate — before you invest.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/start"
              className="w-full sm:w-auto px-8 py-4 bg-white text-clarity-700 rounded-xl font-semibold text-lg hover:bg-gray-100 transition flex items-center justify-center gap-2"
            >
              Start Free Assessment
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/demo"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition"
            >
              View Demo Results
            </Link>
          </div>

          <p className="mt-8 text-white/60 text-sm">
            No credit card required • 15 minutes per stakeholder • Instant AI analysis
          </p>
        </div>
      </header>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '70%', label: 'of automation projects fail' },
              { value: '$1.2M', label: 'average wasted on failed initiatives' },
              { value: '287', label: 'days to detect misalignment' },
              { value: '15min', label: 'to gain clarity' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold text-clarity-600 dark:text-clarity-400">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Three phases to automation clarity</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Collect',
                description: 'Gather structured input from all stakeholders — executives, business owners, technical teams, and end users.',
                icon: Users,
                color: 'bg-blue-500',
              },
              {
                step: '2',
                title: 'Analyze',
                description: 'AI agents process responses, detect contradictions, score readiness, and identify blind spots.',
                icon: Brain,
                color: 'bg-purple-500',
              },
              {
                step: '3',
                title: 'Decide',
                description: 'Get a clear GO, FIX FIRST, or NO-GO recommendation with specific action items.',
                icon: FileText,
                color: 'bg-green-500',
              },
            ].map((phase, i) => (
              <div key={i} className="relative">
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-800 h-full">
                  <div className={`w-14 h-14 ${phase.color} rounded-xl flex items-center justify-center mb-6`}>
                    <phase.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Phase {phase.step}</div>
                  <h3 className="text-2xl font-bold mb-3">{phase.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{phase.description}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-gray-300 dark:text-gray-700" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Outcomes Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Clear Outcomes</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">No ambiguity — just actionable recommendations</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-8 border-2 border-green-200 dark:border-green-800">
              <div className="w-14 h-14 bg-go rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-go-dark dark:text-go-light mb-3">🟢 GO</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                High clarity exists. Proceed with automation — you have alignment, clear processes, and realistic expectations.
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>• Recommended automation approach</li>
                <li>• Success metrics defined</li>
                <li>• Implementation roadmap</li>
              </ul>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-8 border-2 border-amber-200 dark:border-amber-800">
              <div className="w-14 h-14 bg-fixfirst rounded-full flex items-center justify-center mb-6">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-fixfirst-dark dark:text-fixfirst-light mb-3">🟡 FIX FIRST</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Gaps identified. Address specific issues before proceeding — contradictions, unclear processes, or misaligned goals.
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>• Specific gaps to address</li>
                <li>• Resolution actions</li>
                <li>• Re-assessment criteria</li>
              </ul>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-8 border-2 border-red-200 dark:border-red-800">
              <div className="w-14 h-14 bg-nogo rounded-full flex items-center justify-center mb-6">
                <XCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-nogo-dark dark:text-nogo-light mb-3">🔴 NO-GO</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Fundamental issues exist. Automation would fail — revisit process design or strategic objectives first.
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>• Root cause analysis</li>
                <li>• Prerequisites for success</li>
                <li>• Alternative approaches</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-clarity-600 to-clarity-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Would you spend $2,000 to avoid a $1.2M mistake?
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Get clarity before you commit. Start your first assessment for free.
          </p>
          <Link 
            href="/start"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-clarity-700 rounded-xl font-semibold text-lg hover:bg-gray-100 transition"
          >
            Start Free Assessment
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-clarity-400" />
              <span className="text-white font-semibold">Clarity Kit</span>
              <span className="text-gray-500">by AIHackers</span>
            </div>
            <div className="text-sm">
              © 2026 AIHackers. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
