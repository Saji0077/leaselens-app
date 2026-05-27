// Progress indicator component showing "Step X of 4"


interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full mb-8">
      {/* Step text */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-semibold text-gray-700">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm font-medium text-purple-600">
          {Math.round(progress)}% complete
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out shadow-lg"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Step dots */}
      <div className="flex justify-between mt-4">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div
            key={step}
            className={`
              w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
              transition-all duration-300 shadow-md
              ${step <= currentStep
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'bg-gray-200 text-gray-500'
              }
              ${step === currentStep ? 'ring-4 ring-purple-200 scale-110' : ''}
            `}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}
