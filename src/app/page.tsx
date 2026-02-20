'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, AlertTriangle, XCircle, Users, Brain, FileText, Zap, ChevronDown, Check, X } from 'lucide-react';
import { UserMenu } from '@/components/auth';

// FAQ Data
const faqData = [
  {
    question: "What is ELVAIT?",
    answer: "ELVAIT is a decision-support platform that helps organizations evaluate AI and automation investments before committing resources. It collects structured input from multiple stakeholders and produces objective, rule-based GO/CLARIFY/NO-GO recommendations."
  },
  {
    question: "How much does it cost?",
    answer: "Start free with 1 assessment. Starter plan is €79 per decision (up to 3 assessments). Professional is €149-299/month for unlimited assessments. Enterprise pricing is custom. No credit card required to start."
  },
  {
    question: "How does the scoring work?",
    answer: "The Investment Clarity Score (ICS) is calculated from 5 dimensions: Strategic Alignment (20%), Business Value (25%), Technical Feasibility (20%), Organizational Readiness (20%), and Risk Awareness (15%). Scores 75+ = GO, 50-74 = CLARIFY, below 50 = NO-GO."
  },
  {
    question: "What do I get with a free account?",
    answer: "Free accounts include 1 active assessment, up to 10 respondents, full role breakdown analysis, all flags and insights, and the contradiction map. PDF reports and custom questions require a paid plan."
  },
  {
    question: "How long does an assessment take?",
    answer: "5-15 minutes per participant depending on role. Quick Check (Executive only) takes 15 min total, Core assessment takes 45 min across 3 roles, Full assessment takes 60+ min across 4 roles."
  },
  {
    question: "Can participants see each other's answers?",
    answer: "No. Each participant only sees the decision context and their own questions. They cannot see other answers, scores, flags, or recommendations. Only the assessment creator can view full results."
  },
  {
    question: "What are flags?",
    answer: "Flags detect thinking maturity issues — patterns indicating unclear thinking or misalignment. Examples: Overconfidence, Cross-Role Mismatch, Ownership Diffusion. Critical flags can override recommendations to NO-GO."
  },
  {
    question: "Do I need to verify my email?",
    answer: "No. You can start using ELVAIT immediately after signing up. Email verification is optional and doesn't block access to your assessment results."
  },
  {
    question: "Can I upgrade my plan later?",
    answer: "Yes. Contact us anytime to upgrade from Free to Starter, Professional, or Enterprise. Your existing assessments and data will be preserved."
  },
  {
    question: "What happens to my data?",
    answer: "All traffic uses HTTPS. Survey links use unique, unguessable tokens. Data is processed securely and only visible to the assessment creator. We don't sell or share your data."
  }
];

// Pricing Data
const pricingPlans = [
  {
    name: 'Free',
    price: '€0',
    period: 'forever',
    description: 'Try your first assessment',
    features: [
      { name: 'Active assessments', value: '1', included: true },
      { name: 'Respondents per assessment', value: '10', included: true },
      { name: 'Role breakdown', value: true, included: true },
      { name: 'All flags & insights', value: true, included: true },
      { name: 'PDF Reports', value: false, included: false },
      { name: 'Custom questions', value: false, included: false },
    ],
    cta: 'Get Started',
    href: '/signup',
    highlighted: false,
  },
  {
    name: 'Starter',
    price: '€79',
    period: 'per decision',
    description: 'For important decisions',
    features: [
      { name: 'Active assessments', value: '3', included: true },
      { name: 'Respondents per assessment', value: '25', included: true },
      { name: 'Role breakdown', value: true, included: true },
      { name: 'All flags & insights', value: true, included: true },
      { name: 'PDF Reports', value: true, included: true },
      { name: 'Custom questions', value: false, included: false },
    ],
    cta: 'Contact Us',
    href: '/contact?plan=starter',
    highlighted: true,
  },
  {
    name: 'Professional',
    price: '€149–299',
    period: 'per month',
    description: 'For teams & consultants',
    features: [
      { name: 'Active assessments', value: 'Unlimited', included: true },
      { name: 'Respondents per assessment', value: '100', included: true },
      { name: 'Role breakdown', value: true, included: true },
      { name: 'All flags & insights', value: true, included: true },
      { name: 'PDF Reports', value: true, included: true },
      { name: 'Custom questions', value: 'Limited', included: true },
    ],
    cta: 'Contact Us',
    href: '/contact?plan=professional',
    highlighted: false,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'annual contract',
    description: 'For organizations',
    features: [
      { name: 'Active assessments', value: 'Unlimited', included: true },
      { name: 'Respondents per assessment', value: 'Unlimited', included: true },
      { name: 'Role breakdown', value: true, included: true },
      { name: 'All flags & insights', value: true, included: true },
      { name: 'PDF Reports', value: true, included: true },
      { name: 'Custom questions', value: 'Unlimited', included: true },
    ],
    cta: 'Contact Us',
    href: '/contact?plan=enterprise',
    highlighted: false,
  },
];

// FAQ Item Component
function FAQItem({ question, answer, isOpen, onClick }: { 
  question: string; 
  answer: string; 
  isOpen: boolean; 
  onClick: () => void;
}) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={onClick}
        className="w-full py-5 flex items-center justify-between text-left hover:text-clarity-600 dark:hover:text-clarity-400 transition"
      >
        <span className="font-medium text-lg pr-4">{question}</span>
        <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-5' : 'max-h-0'}`}>
        <p className="text-gray-600 dark:text-gray-400">{answer}</p>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

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
            <Link href="/pricing" className="text-white/80 hover:text-white transition">
              Pricing
            </Link>
            <Link href="/dashboard" className="text-white/80 hover:text-white transition">
              My Assessments
            </Link>
            <Link 
              href="/signup"
              className="px-4 py-2 bg-white text-clarity-700 rounded-lg font-medium hover:bg-gray-100 transition"
            >
              Get Started
            </Link>
            <UserMenu />
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
              href="/signup"
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

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Start free. Upgrade when you need more.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {pricingPlans.map((plan, i) => (
              <div 
                key={i} 
                className={`bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 ${
                  plan.highlighted 
                    ? 'border-clarity-500 shadow-lg shadow-clarity-500/20' 
                    : 'border-gray-200 dark:border-gray-800'
                }`}
              >
                {plan.highlighted && (
                  <div className="text-xs font-semibold text-clarity-600 dark:text-clarity-400 mb-2">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">{plan.period}</span>
                </div>
                <Link
                  href={plan.href}
                  className={`block w-full py-2.5 px-4 rounded-lg font-medium text-center transition mb-6 ${
                    plan.highlighted
                      ? 'bg-clarity-600 text-white hover:bg-clarity-700'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {plan.cta}
                </Link>
                <ul className="space-y-3 text-sm">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2">
                      {feature.included ? (
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                      )}
                      <span className={feature.included ? '' : 'text-gray-400 dark:text-gray-500'}>
                        {feature.name}
                        {typeof feature.value === 'string' && feature.value !== 'true' && (
                          <span className="text-gray-500 dark:text-gray-400 ml-1">({feature.value})</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/pricing" className="text-clarity-600 dark:text-clarity-400 hover:underline font-medium">
              View full pricing comparison →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Everything you need to know about ELVAIT</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-950 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="px-6">
              {faqData.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFAQ === index}
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-clarity-600 to-clarity-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to make confident automation decisions?
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Join organizations that evaluate before they invest. Start your first assessment for free.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-clarity-700 rounded-xl font-semibold text-lg hover:bg-gray-100 transition"
            >
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/pricing"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition"
            >
              See Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-clarity-400" />
              <span className="text-white font-semibold">ELVAIT</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/pricing" className="hover:text-white transition">Pricing</Link>
              <Link href="/demo" className="hover:text-white transition">Demo</Link>
              <Link href="/contact" className="hover:text-white transition">Contact</Link>
            </div>
            <div className="text-sm">
              © 2026 ELVAIT. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
