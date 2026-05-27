// Screen 5: Final Result Screen for LeaseLens

import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../Layout/AppLayout';
import { StepIndicator } from '../Progress/StepIndicator';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';

export function ResultScreen() {
  const navigate = useNavigate();
  const { state, resetApp } = useApp();
  const { analysisResult } = state;

  // Handle start new check
  const handleStartNew = () => {
    resetApp();
    navigate('/');
  };

  // Get risk level styling
  const getRiskStyling = (risk: string) => {
    switch (risk) {
      case 'low':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          badge: 'bg-green-500',
        };
      case 'medium':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          badge: 'bg-yellow-500',
        };
      case 'high':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          badge: 'bg-red-500',
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-800',
          badge: 'bg-gray-500',
        };
    }
  };

  // If no analysis result, show error
  if (!analysisResult) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Analysis Found</h2>
          <p className="text-gray-600 mb-6">Please start a new rental check.</p>
          <Button onClick={handleStartNew}>Start New Check</Button>
        </div>
      </AppLayout>
    );
  }

  const riskStyle = getRiskStyling(analysisResult.riskLevel);

  return (
    <AppLayout>
      <StepIndicator currentStep={4} totalSteps={4} />

      {/* Analysis status */}
      <div className={`rounded-2xl p-6 mb-6 ${riskStyle.bg} border-2 ${riskStyle.border}`}>
        <h2 className={`text-2xl font-bold ${riskStyle.text}`}>
          {analysisResult.message}
        </h2>
        {analysisResult.isSuccessful && (
          <p className={`text-sm mt-1 ${riskStyle.text} opacity-80`}>
            Based on your rental content and checklist answers
          </p>
        )}
      </div>

      {/* Risk level badge */}
      {analysisResult.isSuccessful && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Risk Assessment</p>
            <div className={`inline-flex items-center px-6 py-3 rounded-full ${riskStyle.badge} text-white font-bold text-xl`}>
              {analysisResult.riskLevel.toUpperCase()} RISK
            </div>
          </div>
        </div>
      )}

      {/* Results sections */}
      {analysisResult.isSuccessful && (
        <>
          {/* Red flags section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Key Red Flags Found</h3>
            </div>
            
            {analysisResult.redFlags.length > 0 ? (
              <ul className="space-y-3">
                {analysisResult.redFlags.map((flag, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                    <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-red-700">{flag}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-green-600 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                No major red flags detected in the text
              </p>
            )}
          </div>

          {/* Positive signs section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Positive Signs</h3>
            </div>
            
            {analysisResult.positiveSigns.length > 0 ? (
              <ul className="space-y-3">
                {analysisResult.positiveSigns.map((sign, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-green-700">{sign}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No positive signs detected - consider requesting more information</p>
            )}
          </div>

          {/* Next steps section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Smart Next Steps</h3>
            </div>
            
            <ul className="space-y-3">
              {analysisResult.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-blue-700">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* Disclaimer */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-5 border border-gray-200 mb-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-1">Important Disclaimer</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              This tool provides general rental information support only and is not legal advice. 
              For complex legal matters or disputes, please consult a qualified tenancy lawyer or 
              your state's residential tenancy authority.
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pb-20">
        <Button
          variant="secondary"
          onClick={() => navigate('/checklist')}
          className="flex-1"
        >
          Back to Checklist
        </Button>
        
        <Button
          onClick={handleStartNew}
          className="flex-1"
        >
          Start New Check
        </Button>
      </div>
    </AppLayout>
  );
}