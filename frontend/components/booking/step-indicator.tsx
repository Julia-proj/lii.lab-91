'use client'

interface StepIndicatorProps {
  currentStep: number
  steps: string[]
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((label, index) => {
        const stepNum = index + 1
        const isActive = stepNum === currentStep
        const isCompleted = stepNum < currentStep

        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#CDB4DB] text-white'
                    : isCompleted
                    ? 'bg-[#CDB4DB]/30 text-[#8e7f97]'
                    : 'bg-neutral-200 text-neutral-500'
                }`}
              >
                {isCompleted ? '✓' : stepNum}
              </div>
              <span
                className={`text-xs mt-1 ${
                  isActive ? 'text-neutral-900 font-medium' : 'text-neutral-500'
                }`}
              >
                {label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-10 sm:w-20 h-0.5 mx-2 ${
                  isCompleted ? 'bg-[#CDB4DB]/30' : 'bg-neutral-200'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
