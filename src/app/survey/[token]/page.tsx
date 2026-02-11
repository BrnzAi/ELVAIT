'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, ArrowLeft, ArrowRight, Brain } from 'lucide-react';

// Demo questions for business owner role
const demoQuestions = [
  {
    id: 'B1',
    category: 'process',
    question: 'Describe the current process in your own words',
    type: 'text',
    required: true,
  },
  {
    id: 'B2',
    category: 'scale',
    question: 'How many people are directly involved in executing this process?',
    type: 'choice',
    options: [
      { value: '1_2', label: '1-2 people' },
      { value: '3_5', label: '3-5 people' },
      { value: '6_10', label: '6-10 people' },
      { value: '11_25', label: '11-25 people' },
      { value: 'over_25', label: 'More than 25 people' },
    ],
    required: true,
  },
  {
    id: 'B3',
    category: 'complexity',
    question: 'How often do exceptions or special cases occur?',
    type: 'choice',
    options: [
      { value: 'rarely', label: 'Rarely (< 5%)' },
      { value: 'sometimes', label: 'Sometimes (5-20%)' },
      { value: 'often', label: 'Often (20-40%)' },
      { value: 'very_often', label: 'Very often (> 40%)' },
    ],
    required: true,
  },
  {
    id: 'B4',
    category: 'process',
    question: 'What triggers this process to start?',
    type: 'text',
    required: true,
  },
  {
    id: 'B5',
    category: 'process',
    question: 'What is the output when the process completes correctly?',
    type: 'text',
    required: true,
  },
  {
    id: 'B9',
    category: 'confidence',
    question: 'How confident are you that you know ALL the steps in this process?',
    type: 'scale',
    options: { min: 1, max: 5, labels: ['Not at all', 'Slightly', 'Moderately', 'Very', 'Completely'] },
    required: true,
  },
];

interface Response {
  questionId: string;
  value: any;
  confidence?: number;
}

export default function SurveyPage({ params }: { params: { token: string } }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Response[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = demoQuestions;
  const currentQuestion = questions[currentIndex];
  const currentResponse = responses.find(r => r.questionId === currentQuestion?.id);
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const updateResponse = (value: any, confidence?: number) => {
    const existing = responses.findIndex(r => r.questionId === currentQuestion.id);
    const newResponse = { questionId: currentQuestion.id, value, confidence };
    
    if (existing >= 0) {
      const updated = [...responses];
      updated[existing] = newResponse;
      setResponses(updated);
    } else {
      setResponses([...responses, newResponse]);
    }
  };

  const canProceed = () => {
    if (!currentQuestion.required) return true;
    if (!currentResponse) return false;
    if (typeof currentResponse.value === 'string') return currentResponse.value.trim().length > 0;
    return currentResponse.value !== undefined && currentResponse.value !== null;
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsComplete(true);
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl p-8 text-center shadow-lg">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Thank You!</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your responses have been recorded. The assessment will be analyzed once all participants complete their surveys.
          </p>
          <p className="text-sm text-gray-500">
            You can close this window.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-clarity-600" />
              <span className="font-semibold">Clarity Assessment</span>
            </div>
            <span className="text-sm text-gray-500">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-clarity-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-800 min-h-[400px]">
          <div className="text-sm text-clarity-600 font-medium mb-2 uppercase tracking-wide">
            {currentQuestion.category}
          </div>
          <h2 className="text-2xl font-bold mb-8">
            {currentQuestion.question}
            {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
          </h2>

          {/* Text Input */}
          {currentQuestion.type === 'text' && (
            <textarea
              value={currentResponse?.value || ''}
              onChange={(e) => updateResponse(e.target.value)}
              placeholder="Type your answer here..."
              rows={5}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-clarity-500 focus:border-transparent outline-none transition resize-none text-lg"
              autoFocus
            />
          )}

          {/* Choice Input */}
          {currentQuestion.type === 'choice' && currentQuestion.options && Array.isArray(currentQuestion.options) && (
            <div className="space-y-3">
              {currentQuestion.options.map((option: any) => (
                <button
                  key={option.value}
                  onClick={() => updateResponse(option.value)}
                  className={`survey-option w-full text-left ${
                    currentResponse?.value === option.value ? 'selected' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      currentResponse?.value === option.value 
                        ? 'border-clarity-500 bg-clarity-500' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {currentResponse?.value === option.value && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="font-medium">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Scale Input */}
          {currentQuestion.type === 'scale' && currentQuestion.options && !Array.isArray(currentQuestion.options) && (
            <div>
              <div className="flex justify-between mb-4">
                {(currentQuestion.options as any).labels?.map((label: string, i: number) => (
                  <span key={i} className="text-xs text-gray-500 text-center" style={{ width: '60px' }}>
                    {label}
                  </span>
                ))}
              </div>
              <div className="flex justify-between">
                {Array.from({ length: 5 }, (_, i) => i + 1).map(num => (
                  <button
                    key={num}
                    onClick={() => updateResponse(num)}
                    className={`scale-option ${currentResponse?.value === num ? 'selected' : ''}`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              currentIndex === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-800'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed() || isSubmitting}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition ${
              canProceed() && !isSubmitting
                ? 'bg-clarity-600 text-white hover:bg-clarity-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </>
            ) : currentIndex === questions.length - 1 ? (
              <>
                Complete Survey
                <CheckCircle className="w-4 h-4" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
