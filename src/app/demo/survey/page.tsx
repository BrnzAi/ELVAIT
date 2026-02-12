'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Brain, ArrowLeft, ArrowRight, CheckCircle, Clock,
  AlertCircle, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

// =============================================================================
// DEMO DATA
// =============================================================================

interface DemoQuestion {
  id: string;
  text: string;
  type: 'LIKERT' | 'SINGLE_SELECT' | 'TEXT';
  options?: string[];
  dimension: string;
}

const ROLE_QUESTIONS: Record<string, DemoQuestion[]> = {
  BUSINESS_OWNER: [
    { id: 'B1', text: 'The expected benefits of this investment have been clearly quantified.', type: 'LIKERT', dimension: 'D2' },
    { id: 'B2', text: 'What evidence supports the expected value?', type: 'SINGLE_SELECT', options: ['A documented financial baseline', 'Measured results from a pilot', 'Assumptions only', 'No formal documentation'], dimension: 'D2' },
    { id: 'B3', text: 'If this initiative fails to deliver expected value, what happens?', type: 'SINGLE_SELECT', options: ['KPIs tracked, owner assigned', 'Monitoring exists, no owner', 'Continue anyway', 'Not defined'], dimension: 'D2' },
    { id: 'B4', text: 'Who is ultimately accountable for success?', type: 'SINGLE_SELECT', options: ['Executive sponsor', 'Business unit leader', 'Project manager', 'Not clearly defined'], dimension: 'D5' },
    { id: 'B5', text: 'The process we are trying to improve is well-documented and understood.', type: 'LIKERT', dimension: 'D3' },
    { id: 'B6', text: 'We have the organizational capacity to take on this initiative.', type: 'LIKERT', dimension: 'D3' },
    { id: 'B7', text: 'What will be deprioritized to make room for this initiative?', type: 'SINGLE_SELECT', options: ['Lower priority projects', 'Specific tasks identified', 'Nothing will be deprioritized', 'Not yet determined'], dimension: 'D3' },
    { id: 'B8', text: 'The risks of this initiative have been thoroughly assessed.', type: 'LIKERT', dimension: 'D4' },
    { id: 'B_OPEN', text: 'What is the biggest risk or concern that hasn\'t been fully addressed?', type: 'TEXT', dimension: 'OPEN' },
  ],
  TECH_OWNER: [
    { id: 'T1', text: 'We have the technical data and systems needed to support this initiative.', type: 'LIKERT', dimension: 'D1' },
    { id: 'T2', text: 'Our current technical infrastructure can support this solution.', type: 'LIKERT', dimension: 'D3' },
    { id: 'T3', text: 'The technical complexity of this initiative is well understood.', type: 'LIKERT', dimension: 'D4' },
    { id: 'T4', text: 'We have the technical expertise needed to implement and maintain this.', type: 'LIKERT', dimension: 'D3' },
    { id: 'T5', text: 'What technical resources will be impacted?', type: 'SINGLE_SELECT', options: ['Lower priority initiatives', 'Specific systems identified', 'Nothing critical will be impacted', 'Not yet assessed'], dimension: 'D3' },
    { id: 'T6', text: 'Integration with existing systems will be straightforward.', type: 'LIKERT', dimension: 'D4' },
    { id: 'T7', text: 'Security and compliance requirements are clearly defined.', type: 'LIKERT', dimension: 'D4' },
    { id: 'T8', text: 'Who is ultimately accountable for technical success?', type: 'SINGLE_SELECT', options: ['Executive sponsor', 'Technical lead', 'Shared responsibility', 'Not clearly defined'], dimension: 'D5' },
    { id: 'T_OPEN', text: 'What technical challenge or dependency concerns you most?', type: 'TEXT', dimension: 'OPEN' },
  ],
  USER: [
    { id: 'U1', text: 'I understand what this initiative is trying to achieve.', type: 'LIKERT', dimension: 'D1' },
    { id: 'U2', text: 'This initiative will make my work easier or more effective.', type: 'LIKERT', dimension: 'D2' },
    { id: 'U3', text: 'The current process we\'re trying to improve causes significant pain.', type: 'LIKERT', dimension: 'D3' },
    { id: 'U4', text: 'I\'m confident I can adapt to the changes this will bring.', type: 'LIKERT', dimension: 'D3' },
    { id: 'U5', text: 'My input has been considered in planning this initiative.', type: 'LIKERT', dimension: 'D5' },
    { id: 'U_OPEN', text: 'What worries you most about this change?', type: 'TEXT', dimension: 'OPEN' },
  ],
  PROCESS_OWNER: [
    { id: 'P1', text: 'The process is documented with clear steps and decision points.', type: 'LIKERT', dimension: 'P' },
    { id: 'P2', text: 'Process exceptions are well-understood and documented.', type: 'LIKERT', dimension: 'P' },
    { id: 'P3', text: 'The process has stable inputs and predictable outputs.', type: 'LIKERT', dimension: 'P' },
    { id: 'P4', text: 'Process ownership and accountability is clearly defined.', type: 'LIKERT', dimension: 'P' },
    { id: 'P5', text: 'Who owns this process?', type: 'SINGLE_SELECT', options: ['Executive sponsor', 'Department head', 'Process manager', 'Not clearly defined'], dimension: 'P' },
    { id: 'P6', text: 'Process metrics are tracked regularly.', type: 'LIKERT', dimension: 'P' },
    { id: 'P7', text: 'The process is ready for automation.', type: 'LIKERT', dimension: 'P' },
    { id: 'P_OPEN', text: 'What makes this process difficult to standardize or automate?', type: 'TEXT', dimension: 'OPEN' },
  ]
};

const LIKERT_OPTIONS = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly Agree' }
];

const ROLE_LABELS: Record<string, { name: string; emoji: string }> = {
  BUSINESS_OWNER: { name: 'Business Owner', emoji: '📊' },
  TECH_OWNER: { name: 'Technical Owner', emoji: '💻' },
  USER: { name: 'End User', emoji: '👤' },
  PROCESS_OWNER: { name: 'Process Owner', emoji: '⚙️' }
};

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function DemoSurveyPage() {
  const [role, setRole] = useState<string>('BUSINESS_OWNER');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string | number>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [showContext, setShowContext] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('demoUser');
    if (storedUser === 'tech') setRole('TECH_OWNER');
    else if (storedUser === 'user') setRole('USER');
    else if (storedUser === 'process') setRole('PROCESS_OWNER');
    else setRole('BUSINESS_OWNER');
  }, []);

  const questions = ROLE_QUESTIONS[role] || ROLE_QUESTIONS.BUSINESS_OWNER;
  const currentQuestion = questions[currentIndex];
  const progress = Math.round(((currentIndex + (responses[currentQuestion?.id] ? 1 : 0)) / questions.length) * 100);
  const roleInfo = ROLE_LABELS[role] || ROLE_LABELS.BUSINESS_OWNER;

  const saveResponse = (questionId: string, value: string | number) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      setIsComplete(true);
    }
  };

  // Context View
  if (showContext) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <header className="border-b border-gray-800">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-2">
            <Brain className="w-6 h-6 text-clarity-500" />
            <span className="font-semibold">Clarity Assessment Survey</span>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-12">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">{roleInfo.emoji}</span>
              <div>
                <p className="text-sm text-gray-400">You're responding as</p>
                <p className="font-semibold text-lg">{roleInfo.name}</p>
              </div>
            </div>

            <h1 className="text-2xl font-bold mb-2">Marketing Automation Platform</h1>
            <p className="text-gray-400 mb-6">Implement marketing automation for lead nurturing and campaign management</p>
            
            <div className="space-y-4 mb-8">
              <div className="p-4 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">What decision are we making?</p>
                <p className="font-medium">Whether to invest in HubSpot Marketing Hub Enterprise</p>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">What does success look like?</p>
                <p className="font-medium">30% increase in qualified leads, better attribution</p>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">What if we do nothing?</p>
                <p className="font-medium">Manual email campaigns continue, inconsistent follow-up</p>
              </div>
            </div>

            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg mb-8">
              <p className="text-sm text-blue-300">
                <strong>How your answers will be used:</strong> Your responses will be compared across roles to identify alignment, contradictions, and blind spots. This is not a performance evaluation — differences in perspective are signals, not errors.
              </p>
            </div>

            <Button onClick={() => setShowContext(false)} size="lg" className="w-full">
              Start Survey ({questions.length} questions)
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <div className="mt-4 text-center">
            <Link href="/demo/login" className="text-clarity-400 hover:text-clarity-300 text-sm">
              ← Switch demo user
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Completed View
  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Survey Complete!</h1>
          <p className="text-gray-400 mb-8">
            Thank you for completing your assessment. Your responses have been recorded and will be analyzed with other participants' input.
          </p>
          <div className="space-y-3">
            <Link href="/demo/results" className="block">
              <Button className="w-full">View Your Results</Button>
            </Link>
            <Link href="/demo/login" className="block">
              <Button variant="outline" className="w-full">Try Another Role</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Survey Questions View
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 sticky top-0 bg-gray-950 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-clarity-500" />
              <span className="text-sm font-medium">Marketing Automation Platform</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{roleInfo.emoji}</span>
              <span className="text-sm text-gray-400">{currentIndex + 1} of {questions.length}</span>
            </div>
          </div>
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-clarity-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-8">
          <div className="mb-8">
            <span className="text-sm text-clarity-400 font-medium">Question {currentIndex + 1}</span>
            <h2 className="text-xl font-semibold mt-2">{currentQuestion.text}</h2>
          </div>

          {/* Likert Scale */}
          {currentQuestion.type === 'LIKERT' && (
            <div className="space-y-3">
              {LIKERT_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => saveResponse(currentQuestion.id, option.value)}
                  className={`w-full p-4 rounded-lg border text-left transition-all flex items-center gap-4 ${
                    responses[currentQuestion.id] === option.value
                      ? 'border-clarity-500 bg-clarity-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    responses[currentQuestion.id] === option.value
                      ? 'border-clarity-500 bg-clarity-500'
                      : 'border-gray-600'
                  }`}>
                    {responses[currentQuestion.id] === option.value && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <span className="font-medium">{option.value}</span>
                    <span className="text-gray-400 ml-2">— {option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Single Select */}
          {currentQuestion.type === 'SINGLE_SELECT' && currentQuestion.options && (
            <div className="space-y-3">
              {currentQuestion.options.map(option => (
                <button
                  key={option}
                  onClick={() => saveResponse(currentQuestion.id, option)}
                  className={`w-full p-4 rounded-lg border text-left transition-all ${
                    responses[currentQuestion.id] === option
                      ? 'border-clarity-500 bg-clarity-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* Text Input */}
          {currentQuestion.type === 'TEXT' && (
            <div>
              <Textarea
                value={responses[currentQuestion.id] as string || ''}
                onChange={e => setResponses(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                rows={5}
                placeholder="Enter your response..."
                className="bg-gray-800 border-gray-700 text-white"
              />
              <p className="text-sm text-gray-500 mt-2">
                Your response will be classified into themes — it will not be shown to other participants.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-800">
            <Button
              variant="outline"
              onClick={() => setCurrentIndex(i => i - 1)}
              disabled={currentIndex === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={!responses[currentQuestion.id]}
            >
              {currentIndex < questions.length - 1 ? 'Next' : 'Complete'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Progress dots */}
        <div className="mt-6 flex justify-center gap-1">
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentIndex
                  ? 'w-6 bg-clarity-500'
                  : responses[q.id]
                    ? 'bg-clarity-400'
                    : 'bg-gray-700'
              }`}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
