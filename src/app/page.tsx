'use client';
import { ElvaitLogo } from "@/components/ElvaitLogo";
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { UserMenu } from '@/components/auth';

const faqData = [
  {
    question: "What is ELVAIT?",
    answer: "ELVAIT is a decision-support platform that helps organizations evaluate AI and automation investments before committing resources. It collects structured input from multiple stakeholders and produces objective, rule-based GO/CLARIFY/NO-GO recommendations."
  },
  {
    question: "Can I try it without signing up?",
    answer: "Yes! You can create and run a full assessment without an account. You'll see the verdict, Investment Clarity Score, top 2 flags, and summary immediately. Create a free account to unlock role breakdowns, all flags, and the contradiction map."
  },
  {
    question: "What do I get with a free account?",
    answer: "Free accounts include 1 Quick Check assessment with up to 10 respondents. You get the basic GO/FIX FIRST/NO-GO verdict. Full results (role breakdown, all flags, contradiction map) and PDF reports require a paid plan starting at €199."
  },
  {
    question: "How much does it cost?",
    answer: "Start free with Quick Check (1 assessment, basic verdict). Try Out is €199 for 3 months (full assessment, credited toward Core). Core is €1,900/year (up to 10 assessments). Advanced is €3,500/year (up to 20 assessments, AI insights). Enterprise pricing is custom."
  },
  {
    question: "How does the scoring work?",
    answer: "The Investment Clarity Score (ICS) is calculated from 5 dimensions: Strategic Alignment (20%), Business Value (25%), Technical Feasibility (20%), Organizational Readiness (20%), and Risk Awareness (15%). Scores 75+ = GO, 50-74 = CLARIFY, below 50 = NO-GO."
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
    answer: "Yes. After signing up, you'll receive a verification email. Click the link to activate your account and unlock full access to your assessment results."
  },
  {
    question: "Can I upgrade my plan later?",
    answer: "Yes. You can upgrade anytime by contacting us. Moving from Free to Try Out, Core, Advanced, or Enterprise preserves all your existing assessments and data. The €199 Try Out fee is credited toward a Core subscription."
  },
  {
    question: "What happens to my data?",
    answer: "All traffic uses HTTPS. Survey links use unique, unguessable tokens. Data is processed securely and only visible to the assessment creator. We don't sell or share your data."
  },
  {
    question: "Why should Elvait be mandatory before IT and AI investments?",
    answer: "Elvait prevents capital lock-in by exposing structural misalignment, unrealistic ROI, and process gaps before budgets are committed. It introduces measurable stop-criteria and creates a standardized clarity gate for governance."
  },
  {
    question: "What value does Elvait provide for executives?",
    answer: "For CEOs: strategic alignment and execution confidence. For CFOs: capital allocation discipline and ROI credibility. For Owners and Boards: structurally defensible investments with audit-ready clarity."
  },
  {
    question: "How does Elvait solve the AI productivity paradox?",
    answer: "Elvait addresses the seven root causes of failed AI productivity — from structural misalignment and poor process readiness to governance gaps — by evaluating the clarity of the decision behind the technology, not the technology itself."
  },
  {
    question: "Why don't AI investments automatically lead to productivity gains?",
    answer: "Massive AI spending fails to deliver when organizations lack structural alignment, process readiness, data quality, adoption strategies, and governance frameworks. The gap is not technological — it is structural."
  }
];

function FAQItem({ question, answer, isOpen, onClick }: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="border-b border-[#777777]/20">
      <button
        onClick={onClick}
        className="w-full py-5 flex items-center justify-between text-left hover:opacity-70 transition"
      >
        <span className="font-medium text-lg pr-4 text-black">{question}</span>
        <ChevronDown className={`w-5 h-5 text-black flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-5' : 'max-h-0'}`}>
        <p className="text-[#777777]">{answer}</p>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between" style={{ backgroundColor: '#ffffff' }}>
        <div className="flex items-center gap-3">
          <ElvaitLogo size="lg" />
        </div>
        <div className="flex items-center gap-6">
          <Link href="/pricing" className="text-[#777777] hover:text-black transition text-sm font-medium">
            Pricing
          </Link>
          <Link href="/dashboard" className="text-[#777777] hover:text-black transition text-sm font-medium">
            My Assessments
          </Link>
          <Link
            href="/create"
            className="px-5 py-2 bg-[#FF4C4C] text-white rounded-lg font-medium text-sm hover:bg-[#e03e3e] transition"
          >
            Start Assessment
          </Link>
          <UserMenu />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16" style={{ backgroundColor: '#ffffff' }}>
        <div className="mb-8">
          <span className="inline-block px-4 py-1.5 bg-[#D2FFB8] text-black text-xs font-semibold rounded-full tracking-wider uppercase">
            explore your possibilities with elvait
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-black leading-[1.1] mb-6 max-w-5xl">
          NOT EVERY CHALLENGE NEEDS AI.<br />
          BUT EVERY SUCCESSFUL AI INITIATIVE NEEDS{' '}
          <span className="inline-block bg-[#D2FFB8] px-3 py-1">ELVAIT</span>
        </h1>
      </section>

      {/* Welcome Block */}
      <section className="max-w-6xl mx-auto px-6 pb-24" style={{ backgroundColor: '#ffffff' }}>
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="md:w-1/3">
            <div className="inline-block bg-[#D2FFB8] px-4 py-2 font-bold text-black text-lg">
              WELCOME TO ELVAIT
            </div>
          </div>
          <div className="md:w-2/3">
            <p className="text-[#777777] text-lg leading-relaxed max-w-2xl">
              We bring clarity to decisions that matter. Before you invest in AI, automation, or digital transformation — ELVAIT helps you understand whether your organization is truly ready. Not through opinions. Through structured, multi-stakeholder analysis that exposes contradictions, blind spots, and false confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="max-w-6xl mx-auto px-6 pb-12" style={{ backgroundColor: '#ffffff' }}>
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-16">
          TOO MANY ORGANIZATIONS:
        </h2>

        <div className="space-y-12 mb-16">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="md:w-1/2">
              <div className="border-l-4 border-[#D2FFB8] pl-6">
                <h3 className="text-2xl md:text-3xl font-bold text-black">INVEST IN TOOLS &amp; AI</h3>
              </div>
            </div>
            <div className="md:w-1/2">
              <p className="text-[#777777] text-lg">→ before understanding their problems</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="md:w-1/2">
              <div className="border-l-4 border-[#D2FFB8] pl-6">
                <h3 className="text-2xl md:text-3xl font-bold text-black">AUTOMATE</h3>
              </div>
            </div>
            <div className="md:w-1/2">
              <p className="text-[#777777] text-lg">→ unclear or broken processes</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="md:w-1/2">
              <div className="border-l-4 border-[#D2FFB8] pl-6">
                <h3 className="text-2xl md:text-3xl font-bold text-black">RUN PILOTS</h3>
              </div>
            </div>
            <div className="md:w-1/2">
              <p className="text-[#777777] text-lg">→ without adoption or impact</p>
            </div>
          </div>
        </div>
      </section>

      {/* Result Banner */}
      <section className="max-w-6xl mx-auto px-6 pb-24" style={{ backgroundColor: '#ffffff' }}>
        <div className="bg-[#D2FFB8] py-6 px-8">
          <p className="text-xl md:text-2xl font-bold text-black text-center">
            THE RESULT IS COMPLEXITY — NOT VALUE
          </p>
        </div>
      </section>

      {/* Large ELVAIT Logo */}
      <section className="py-20 text-center" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-6xl md:text-8xl font-bold text-black tracking-tight">
            ELV<span className="inline-block bg-[#D2FFB8] px-2">[A]</span>IT
          </div>
        </div>
      </section>

      {/* Three Offerings */}
      <section className="max-w-6xl mx-auto px-6 py-24" style={{ backgroundColor: '#ffffff' }}>
        <div className="grid md:grid-cols-3 gap-0 items-center">
          <div className="text-center p-8 border border-[#777777]/20">
            <span className="inline-block px-3 py-1 bg-[#D2FFB8] text-black text-xs font-semibold rounded-full mb-4 uppercase">Explore</span>
            <h3 className="text-xl font-bold text-black mb-2">ELVAIT COMMUNITY</h3>
            <p className="text-[#777777] text-sm">Connect with peers navigating the same challenges</p>
          </div>

          <div className="text-center p-8 border border-[#777777]/20 relative">
            <div className="hidden md:block absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <ArrowRight className="w-6 h-6 text-[#FF4C4C]" />
            </div>
            <span className="inline-block px-3 py-1 bg-[#D2FFB8] text-black text-xs font-semibold rounded-full mb-4 uppercase">Explore</span>
            <h3 className="text-xl font-bold text-black mb-2">ELVAIT COHORTS</h3>
            <p className="text-[#777777] text-sm">Structured peer learning for AI decision-makers</p>
            <div className="hidden md:block absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2">
              <ArrowRight className="w-6 h-6 text-[#FF4C4C]" />
            </div>
          </div>

          <div className="text-center p-8 border border-[#777777]/20">
            <span className="inline-block px-3 py-1 bg-[#D2FFB8] text-black text-xs font-semibold rounded-full mb-4 uppercase">Explore</span>
            <h3 className="text-xl font-bold text-black mb-2">ELVAIT PARTNERS</h3>
            <p className="text-[#777777] text-sm">Expert-guided implementation and assessment</p>
          </div>
        </div>
      </section>

      {/* ELVAIT Community Section */}
      <section className="max-w-6xl mx-auto px-6 py-24 border-t border-[#777777]/20" style={{ backgroundColor: '#ffffff' }}>
        <div className="flex flex-col md:flex-row gap-16">
          <div className="md:w-1/2">
            <span className="inline-block px-3 py-1 bg-[#D2FFB8] text-black text-xs font-semibold rounded-full mb-6 uppercase">Community</span>
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">ELVAIT COMMUNITY</h2>
            <p className="text-[#777777] text-lg mb-8 leading-relaxed">
              A space for leaders who refuse to invest blindly. ELVAIT Community connects decision-makers who are navigating AI and automation investments — not to sell solutions, but to share clarity.
            </p>
            <ul className="space-y-4 text-[#777777]">
              <li className="flex items-start gap-3">
                <span className="text-[#FF4C4C] font-bold mt-0.5">→</span>
                <span>CTOs and IT leaders evaluating automation readiness</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#FF4C4C] font-bold mt-0.5">→</span>
                <span>CFOs questioning ROI assumptions on tech investments</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#FF4C4C] font-bold mt-0.5">→</span>
                <span>CEOs seeking structural alignment before committing capital</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#FF4C4C] font-bold mt-0.5">→</span>
                <span>Consultants and advisors who want better frameworks</span>
              </li>
            </ul>
          </div>
          <div className="md:w-1/2">
            <h3 className="text-xl font-bold text-black mb-8">How ELVAIT Community works</h3>
            <div className="space-y-8">
              <div className="border-l-4 border-[#D2FFB8] pl-6">
                <div className="text-sm font-bold text-[#777777] mb-1">STEP 01</div>
                <h4 className="text-lg font-bold text-black mb-2">Join &amp; Connect</h4>
                <p className="text-[#777777]">
                  Apply to join a curated group of peers. No vendors. No pitches. Just leaders who share your challenges and want to make better decisions.
                </p>
              </div>
              <div className="border-l-4 border-[#D2FFB8] pl-6">
                <div className="text-sm font-bold text-[#777777] mb-1">STEP 02</div>
                <h4 className="text-lg font-bold text-black mb-2">Engage &amp; Learn</h4>
                <p className="text-[#777777]">
                  Participate in structured discussions, case reviews, and shared assessments. Learn from others&apos; mistakes and successes — before making your own investment decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 border-t border-[#777777]/20" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-3xl md:text-5xl font-bold text-black leading-tight">
            &ldquo;THE VALUE ISN&apos;T IN ADVICE.<br />
            IT&apos;S IN <span className="bg-[#D2FFB8] px-2">REFLECTION</span> AND{' '}
            <span className="bg-[#D2FFB8] px-2">SHARED EXPERIENCE</span>.&rdquo;
          </p>
        </div>
      </section>

      {/* ELVAIT Cohorts Section */}
      <section className="max-w-6xl mx-auto px-6 py-24 border-t border-[#777777]/20" style={{ backgroundColor: '#ffffff' }}>
        <div className="mb-16">
          <span className="inline-block px-3 py-1 bg-[#D2FFB8] text-black text-xs font-semibold rounded-full mb-6 uppercase">Cohorts</span>
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">ELVAIT COHORTS</h2>
          <p className="text-[#777777] text-lg max-w-3xl leading-relaxed">
            Time-boxed, structured peer programs for leaders making high-stakes AI and automation decisions. Small groups. Real cases. No theory — just actionable clarity from people who&apos;ve been there.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'PEER CASE DISCUSSION',
              desc: 'Bring your real investment decision. Get structured feedback from peers who understand the stakes — not consultants selling the next engagement.',
            },
            {
              title: 'CLEAR STRUCTURE',
              desc: 'Every cohort follows a proven framework: assess, challenge, reflect, decide. No free-form brainstorming. Every session produces actionable output.',
            },
            {
              title: 'PEER NETWORK',
              desc: 'Build lasting relationships with decision-makers at your level. Cross-industry perspectives that challenge assumptions and broaden your lens.',
            },
            {
              title: 'ACCOUNTABILITY',
              desc: 'Commit to a decision timeline. Report back to your cohort. The peer pressure isn\'t social — it\'s structural. You make better decisions when someone is watching.',
            },
          ].map((pillar, i) => (
            <div key={i} className="border border-[#777777]/20 p-6">
              <div className="w-8 h-1 bg-[#D2FFB8] mb-4" />
              <h3 className="text-lg font-bold text-black mb-3">{pillar.title}</h3>
              <p className="text-[#777777] text-sm leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-[#777777]/20" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
            READY TO MAKE CONFIDENT DECISIONS?
          </h2>
          <p className="text-[#777777] text-lg mb-10 max-w-2xl mx-auto">
            Start with a free assessment. No signup required. See your clarity score instantly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF4C4C] text-white font-semibold text-lg hover:bg-[#e03e3e] transition"
            >
              Start Free Assessment
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-black text-black font-semibold text-lg hover:bg-black hover:text-white transition"
            >
              View Demo Results
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 border-t border-[#777777]/20" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">FREQUENTLY ASKED QUESTIONS</h2>
            <p className="text-[#777777] text-lg">Everything you need to know about ELVAIT</p>
          </div>

          <div className="border-t border-[#777777]/20">
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
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black text-[#777777]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ElvaitLogo size="md" />
              <span className="text-[#D2FFB8] font-semibold">ELVAIT</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
              <Link href="/pricing" className="hover:text-white transition">Pricing</Link>
              <Link href="/demo" className="hover:text-white transition">Demo</Link>
              <Link href="/contact" className="hover:text-white transition">Contact</Link>
              <Link href="/insights" className="hover:text-white transition">Insights</Link>
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
