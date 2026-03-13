'use client'

import { Suspense } from 'react'
import { BookingProvider, useBooking } from './booking-context'
import { StepIndicator } from './step-indicator'
import { CategoryStep } from './category-step'
import { DateTimeStep } from './datetime-step'
import { ConfirmationStep } from './confirmation-step'

const STEPS = ['Servicio', 'Fecha y hora', 'Confirmar']

function WizardContent() {
  const { state } = useBooking()

  return (
    <div className="max-w-3xl mx-auto">
      <StepIndicator currentStep={state.step} steps={STEPS} />

      <div className="min-h-[400px]">
        {state.step === 1 && <CategoryStep />}
        {state.step === 2 && <DateTimeStep />}
        {state.step === 3 && <ConfirmationStep />}
      </div>
    </div>
  )
}

export function BookingWizard() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-[#CDB4DB] border-t-transparent rounded-full" />
      </div>
    }>
      <BookingProvider>
        <WizardContent />
      </BookingProvider>
    </Suspense>
  )
}
