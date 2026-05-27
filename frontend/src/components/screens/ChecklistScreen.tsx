// Screen 4: Risk Checklist Screen for LeaseLens

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../Layout/AppLayout';
import { StepIndicator } from '../Progress/StepIndicator';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { analyzeRental } from '../../utils/analysis';

// Checklist question type
interface ChecklistQuestion {
  id: string;
  question: string;
  description: string;
}

// Checklist questions
const checklistQuestions: ChecklistQuestion[] = [
  {
    id: 'utilitiesMentioned',
    question: 'Are utilities clearly mentioned?',
    description: 'Electricity, gas, water, internet - who pays for what?',
  },
  {
    id: 'bondExplained',
    question: 'Is the bond amount and return process explained?',
    description: 'How much is the bond and when will it be returned?',
  },
  {
    id: 'maintenanceClear',
    question: 'Are maintenance responsibilities clear?',
    description: 'Who handles repairs and property maintenance?',
  },
  {
    id: 'breakLeaseTerms',
    question: 'Are break-lease terms included?',
    description: 'What happens if you need to leave early?',
  },
  {
    id: 'unusualPayments',
    question: 'Are there any unusual payment requests?',
    description: 'Cash only, wire transfers, cryptocurrency, or upfront fees?',
  },
];

export function ChecklistScreen() {
  const navigate = useNavigate();
  const { state, updateChecklistAnswers, setAnalysisResult } = useApp();
  const { checklistAnswers, rentalContent } = state;

  // Local state for answers
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({
    utilitiesMentioned: checklistAnswers.utilitiesMentioned,
    bondExplained: checklistAnswers.bondExplained,
    maintenanceClear: checklistAnswers.maintenanceClear,
    breakLeaseTerms: checklistAnswers.breakLeaseTerms,
    unusualPayments: checklistAnswers.unusualPayments,
  });

  // Handle answer change
  const handleAnswerChange = (questionId: string, value: boolean) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Check if all questions are answered
  const allAnswered = Object.values(answers).every(v => v !== null);

  // Handle continue to results
  const handleContinue = () => {
    if (!allAnswered) return;

    // Save answers to context
    updateChecklistAnswers({
      utilitiesMentioned: answers.utilitiesMentioned,
      bondExplained: answers.bondExplained,
      maintenanceClear: answers.maintenanceClear,
      breakLeaseTerms: answers.breakLeaseTerms,
      unusualPayments: answers.unusualPayments,
    });

    // Perform analysis
    const result = analyzeRental(rentalContent.text, {
      utilitiesMentioned: answers.utilitiesMentioned ?? false,
      bondExplained: answers.bondExplained ?? false,
      maintenanceClear: answers.maintenanceClear ?? false,
      breakLeaseTerms: answers.breakLeaseTerms ?? false,
      unusualPayments: answers.unusualPayments ?? false,
    });

    // Save result to context
    setAnalysisResult(result);

    // Navigate to results
    navigate('/results');
  };

  return (
    <AppLayout>
      <StepIndicator currentStep={3} totalSteps={4} />

      {/* Page title */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Quick checklist
        </h2>
        <p className="text-gray-600">
          Answer these questions based on the rental content you pasted.
        </p>
      </div>

      {/* Checklist card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 mb-6">
        <div className="space-y-6">
          {checklistQuestions.map((q, index) => (
            <div
              key={q.id}
              className="p-4 rounded-xl border-2 border-gray-100 hover:border-purple-200 transition-colors"
            >
              {/* Question number and text */}
              <div className="flex items-start gap-3 mb-3">
                <span className="flex-shrink-0 w-7 h-7 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-medium text-gray-900">{q.question}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{q.description}</p>
                </div>
              </div>

              {/* Yes/No buttons */}
              <div className="flex gap-3 ml-10">
                <button
                  type="button"
                  onClick={() => handleAnswerChange(q.id, true)}
                  className={`
                    flex-1 py-2.5 px-4 rounded-lg font-medium text-sm
                    transition-all duration-200
                    ${answers[q.id] === true
                      ? 'bg-green-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-700'
                    }
                  `}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => handleAnswerChange(q.id, false)}
                  className={`
                    flex-1 py-2.5 px-4 rounded-lg font-medium text-sm
                    transition-all duration-200
                    ${answers[q.id] === false
                      ? 'bg-red-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-700'
                    }
                  `}
                >
                  No
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Progress indicator */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {Object.values(answers).filter(v => v !== null).length} of {checklistQuestions.length} answered
            </span>
            <div className="flex gap-1">
              {checklistQuestions.map((q) => (
                <div
                  key={q.id}
                  className={`w-2 h-2 rounded-full ${
                    answers[q.id] !== null ? 'bg-purple-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info box */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 mb-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-1">
              Tip: If you're unsure
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              If the information is not clearly stated in the listing, answer "No". Missing information is often a warning sign.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between items-center pb-20">
        <Button
          variant="secondary"
          onClick={() => navigate('/rental-input')}
        >
          Back
        </Button>
        
        <Button
          onClick={handleContinue}
          disabled={!allAnswered}
        >
          View Results
        </Button>
      </div>
    </AppLayout>
  );
}