'use client';
import Image from 'next/image';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { CheckCircle, ArrowRight, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ThemeToggle } from '@/components/survey/ThemeToggle';
import { ElvaitLogo } from '@/components/survey/ElvaitLogo';

interface Question {
  question_id: string;
  text: string;
  answer_type: 'LIKERT' | 'SINGLE_SELECT' | 'MULTI_SELECT' | 'TEXT';
  options: string[] | null;
  order: number;
}

interface SurveyData {
  participant: {
    id: string;
    role: string;
    name: string | null;
    status: string;
  };
  context: {
    title: string;
    description: string;
    dCtx1: string;
    dCtx2: string;
    dCtx3: string;
    dCtx4: string;
    timeHorizon: string;
  };
  questions: Question[];
  processGroups?: Array<{
    processId: string;
    processName: string;
    processDescription: string | null;
    questions: Question[];
  }>;
  responses: Record<string, string | number>;
  progress: {
    total: number;
    completed: number;
    percentage: number;
  };
}

const LIKERT_OPTIONS = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly Agree' }
];

export default function SurveyPage() {
  const params = useParams();
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentProcessIndex, setCurrentProcessIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string | number>>({});
  const [saving, setSaving] = useState(false);
  const [showContext, setShowContext] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await fetch(`/api/survey/${params.token}`);
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to load survey');
        }
        const data = await response.json();
        setSurveyData(data);
        setResponses(data.responses || {});
        
        if (data.participant.status === 'COMPLETED') {
          setCompleted(true);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSurvey();
  }, [params.token]);

  const saveResponse = async (questionId: string, value: string | number, processId?: string) => {
    const responseKey = processId ? `${questionId}_${processId}` : questionId;
    setResponses(prev => ({ ...prev, [responseKey]: value }));
    
    setSaving(true);
    try {
      const payload: any = { questionId, value };
      if (processId) {
        payload.processId = processId;
      }
      
      const response = await fetch(`/api/survey/${params.token}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) throw new Error('Failed to save response');
      
      const result = await response.json();
      if (result.status === 'COMPLETED') {
        setCompleted(true);
      }
    } catch (err) {
      console.error('Failed to save:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-elvait-black">
        <Loader2 className="w-8 h-8 animate-spin text-elvait-green" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-elvait-black">
        <div className="text-center max-w-md px-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Unable to Load Survey</h1>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (completed || surveyData?.participant.status === 'COMPLETED') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-elvait-black">
        <div className="text-center max-w-md px-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Thank You!</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your responses have been recorded. The assessment initiator will be notified when all participants have completed their surveys.
          </p>
        </div>
      </div>
    );
  }

  if (!surveyData) return null;

  // Helper functions for process group logic
  const hasProcessGroups = surveyData.processGroups && surveyData.processGroups.length > 0;
  const isInProcessSection = hasProcessGroups && currentIndex >= surveyData.questions.length;
  
  // Current question calculation
  let currentQuestion: Question;
  let currentProcess: any = null;
  let questionIndexInProcess = 0;
  
  if (isInProcessSection) {
    const processGroups = surveyData.processGroups!;
    const adjustedIndex = currentIndex - surveyData.questions.length;
    const questionsPerProcess = processGroups[0].questions.length;
    const processIndex = Math.floor(adjustedIndex / questionsPerProcess);
    questionIndexInProcess = adjustedIndex % questionsPerProcess;
    
    currentProcess = processGroups[processIndex];
    currentQuestion = currentProcess.questions[questionIndexInProcess];
  } else {
    currentQuestion = surveyData.questions[currentIndex];
  }
  
  // Progress calculation
  const totalQuestions = hasProcessGroups 
    ? surveyData.questions.length + (surveyData.processGroups!.length * surveyData.processGroups![0].questions.length)
    : surveyData.questions.length;
  const answeredCount = Object.keys(responses).length;
  const progress = Math.round((answeredCount / totalQuestions) * 100);

  // Context View
  if (showContext) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-elvait-black">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image src="/logo-grey.jpg" alt="ELVAIT" width={24} height={24} className="h-6 w-auto" />
              <span className="font-semibold">Clarity Assessment</span>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <ElvaitLogo />
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-12">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8">
            <h1 className="text-2xl font-bold mb-2">{surveyData.context.title}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{surveyData.context.description}</p>
            
            <div className="space-y-4 mb-8">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">What decision are we actually trying to make?</p>
                <p className="font-medium">{surveyData.context.dCtx1}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">What will be different if this decision succeeds?</p>
                <p className="font-medium">{surveyData.context.dCtx2}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">What happens if we do nothing?</p>
                <p className="font-medium">{surveyData.context.dCtx3}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">What would make this decision a mistake in hindsight?</p>
                <p className="font-medium">{surveyData.context.dCtx4}</p>
              </div>
            </div>

            <div className="p-4 bg-elvait-green/5 dark:bg-elvait-green/10 rounded-lg mb-8">
              <p className="text-sm text-elvait-grey-dark dark:text-elvait-green">
                <strong>How your answers will be used:</strong> Your responses will be compared across roles to identify alignment, contradictions, and blind spots. This is not a performance evaluation — differences in perspective are signals, not errors.
              </p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">🔒 Data Privacy &amp; GDPR Consent</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                By participating in this survey, you consent to the processing of your responses for the purpose of organizational decision assessment. Your data is stored on EU servers (Google Cloud, Frankfurt, europe-west1), encrypted in transit and at rest, and processed in accordance with GDPR. Only your name, email, and survey responses are collected — no IP addresses or tracking data. Your responses are pseudonymised and analysed in aggregate across roles. You may request access to, correction, or deletion of your data at any time by contacting <a href="mailto:system@elvait.ai" className="text-elvait-green underline">system@elvait.ai</a>.
              </p>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-elvait-green focus:ring-elvait-green"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  I have read and agree to the processing of my data as described above.
                </span>
              </label>
            </div>

            <Button onClick={() => setShowContext(false)} size="lg" className="w-full" disabled={!consentGiven}>
              Start Survey ({totalQuestions} questions)
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Survey Questions View
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-elvait-black">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Image src="/logo-grey.jpg" alt="ELVAIT" width={20} height={20} className="h-5 w-auto" />
              <span className="text-sm font-medium">{surveyData.context.title}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                {currentIndex + 1} of {totalQuestions}
              </span>
              <ThemeToggle />
            </div>
          </div>
          <div className="h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-elvait-red transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8">
          {/* Process Header */}
          {currentProcess && (
            <div className="mb-6 p-4 bg-elvait-green/5 dark:bg-elvait-green/10 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-elvait-black dark:text-elvait-green">
                  Regarding: <strong>{currentProcess.processName}</strong>
                </h3>
                <span className="text-sm text-elvait-green-dark dark:text-elvait-green">
                  Process {Math.floor((currentIndex - surveyData.questions.length) / currentProcess.questions.length) + 1} of {surveyData.processGroups!.length}
                </span>
              </div>
              {currentProcess.processDescription && (
                <p className="text-sm text-elvait-grey-dark dark:text-elvait-green">{currentProcess.processDescription}</p>
              )}
            </div>
          )}
          
          <div className="mb-8">
            <span className="text-sm text-elvait-green font-medium">Question {currentIndex + 1}</span>
            <h2 className="text-xl font-semibold mt-2">{currentQuestion.text}</h2>
          </div>

          {/* Likert Scale */}
          {currentQuestion.answer_type === 'LIKERT' && (
            <div className="space-y-3">
              {LIKERT_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => saveResponse(currentQuestion.question_id, option.value, currentProcess?.processId)}
                  className={`w-full p-4 rounded-lg border text-left transition-all flex items-center gap-4 ${
                    (() => {
                      const responseKey = currentProcess?.processId 
                        ? `${currentQuestion.question_id}_${currentProcess.processId}` 
                        : currentQuestion.question_id;
                      return responses[responseKey] === option.value
                        ? 'border-elvait-green bg-elvait-green/5 dark:bg-elvait-black/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600';
                    })()
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    (() => {
                      const responseKey = currentProcess?.processId 
                        ? `${currentQuestion.question_id}_${currentProcess.processId}` 
                        : currentQuestion.question_id;
                      return responses[responseKey] === option.value
                        ? 'border-elvait-green bg-elvait-red'
                        : 'border-gray-300 dark:border-gray-600';
                    })()
                  }`}>
                    {(() => {
                      const responseKey = currentProcess?.processId 
                        ? `${currentQuestion.question_id}_${currentProcess.processId}` 
                        : currentQuestion.question_id;
                      return responses[responseKey] === option.value && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      );
                    })()}
                  </div>
                  <div>
                    <span className="font-medium">{option.value}</span>
                    <span className="text-gray-500 ml-2">— {option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Single Select */}
          {currentQuestion.answer_type === 'SINGLE_SELECT' && currentQuestion.options && (
            <div className="space-y-3">
              {currentQuestion.options.map(option => (
                <button
                  key={option}
                  onClick={() => saveResponse(currentQuestion.question_id, option, currentProcess?.processId)}
                  className={`w-full p-4 rounded-lg border text-left transition-all ${
                    (() => {
                      const responseKey = currentProcess?.processId 
                        ? `${currentQuestion.question_id}_${currentProcess.processId}` 
                        : currentQuestion.question_id;
                      return responses[responseKey] === option
                        ? 'border-elvait-green bg-elvait-green/5 dark:bg-elvait-black/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600';
                    })()
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* Text Input */}
          {currentQuestion.answer_type === 'TEXT' && (
            <div>
              <Textarea
                value={(() => {
                  const responseKey = currentProcess?.processId 
                    ? `${currentQuestion.question_id}_${currentProcess.processId}` 
                    : currentQuestion.question_id;
                  return responses[responseKey] as string || '';
                })()}
                onChange={e => {
                  const responseKey = currentProcess?.processId 
                    ? `${currentQuestion.question_id}_${currentProcess.processId}` 
                    : currentQuestion.question_id;
                  setResponses(prev => ({ ...prev, [responseKey]: e.target.value }));
                }}
                onBlur={() => {
                  const responseKey = currentProcess?.processId 
                    ? `${currentQuestion.question_id}_${currentProcess.processId}` 
                    : currentQuestion.question_id;
                  if (responses[responseKey]) {
                    saveResponse(currentQuestion.question_id, responses[responseKey], currentProcess?.processId);
                  }
                }}
                rows={5}
                placeholder="Enter your response..."
                className="text-base"
              />
              <p className="text-sm text-gray-500 mt-2">
                Your response will be classified into themes — it will not be shown to other participants.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
            <Button
              variant="outline"
              onClick={() => setCurrentIndex(i => i - 1)}
              disabled={currentIndex === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentIndex < totalQuestions - 1 ? (
              <Button
                onClick={() => setCurrentIndex(i => i + 1)}
                disabled={(() => {
                  const responseKey = currentProcess?.processId 
                    ? `${currentQuestion.question_id}_${currentProcess.processId}` 
                    : currentQuestion.question_id;
                  return !responses[responseKey];
                })()}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={() => {
                  const responseKey = currentProcess?.processId 
                    ? `${currentQuestion.question_id}_${currentProcess.processId}` 
                    : currentQuestion.question_id;
                  if (responses[responseKey]) {
                    saveResponse(currentQuestion.question_id, responses[responseKey], currentProcess?.processId);
                  }
                }}
                disabled={(() => {
                  const responseKey = currentProcess?.processId 
                    ? `${currentQuestion.question_id}_${currentProcess.processId}` 
                    : currentQuestion.question_id;
                  return !responses[responseKey] || saving;
                })()}
              >
                {saving ? 'Saving...' : 'Complete Survey'}
                {!saving && <CheckCircle className="w-4 h-4 ml-2" />}
              </Button>
            )}
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mt-6 flex justify-center gap-1">
          {surveyData.questions.map((q, i) => (
            <button
              key={q.question_id}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentIndex
                  ? 'w-6 bg-elvait-red'
                  : responses[q.question_id]
                    ? 'bg-elvait-green'
                    : 'bg-gray-300 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
      </main>

      {/* Saving indicator */}
      {saving && (
        <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-900 shadow-lg rounded-lg px-4 py-2 flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-elvait-green" />
          <span className="text-sm">Saving...</span>
        </div>
      )}
    </div>
  );
}
