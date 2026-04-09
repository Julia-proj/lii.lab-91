'use client'

import { Suspense } from 'react'
import { BookingProvider, useBooking, getTotalDuration, getTotalPrice } from './booking-context'
import { StepIndicator } from './step-indicator'
import { CategoryStep } from './category-step'
import { DateTimeStep } from './datetime-step'
import { ConfirmationStep } from './confirmation-step'
import { X, Clock } from 'lucide-react'
import { formatDuration } from '@/lib/format'

const STEPS = ['Servicio', 'Fecha y hora', 'Confirmar']

function SelectedServicesSidebar() {
  const { state, dispatch } = useBooking()

  const totalDuration = getTotalDuration(state.services, state.quantities)
  const totalPrice = getTotalPrice(state.services, state.quantities)

  const handleContinue = () => {
    if (state.services.length > 0) {
      dispatch({ type: 'CONFIRM_SERVICES' })
    }
  }

  return (
    <div className="hidden lg:block w-72 shrink-0">
      <div className="sticky top-24 bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-neutral-100">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">Tu selección</p>
        </div>

        <div className="px-5 py-4 min-h-[120px]">
          {state.services.length === 0 ? (
            <p className="text-sm text-neutral-500 text-center py-4">Selecciona un servicio</p>
          ) : (
            <ul className="space-y-2">
              {state.services.map((s) => (
                <li key={s._id} className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-800 leading-snug">{s.name}</p>
                    <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {formatDuration(s.duration)}
                      {(state.quantities[s._id] ?? 1) > 1 && (
                        <span className="ml-1">x{state.quantities[s._id]}</span>
                      )}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-neutral-900">
                      {(state.quantities[s._id] ?? 1) * s.price}€
                    </p>
                    <button
                      onClick={() => dispatch({ type: 'REMOVE_SERVICE', payload: s._id })}
                      className="text-neutral-300 hover:text-red-400 transition-colors mt-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {state.services.length > 0 && (
          <div className="px-5 py-4 border-t border-neutral-100 bg-neutral-50/50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs text-neutral-500">Total · {formatDuration(totalDuration)}</span>
              <span className="text-base font-semibold text-neutral-900">{totalPrice}€</span>
            </div>
            <button
              onClick={handleContinue}
              className="w-full bg-plum hover:bg-plum-hover text-white font-semibold py-3 rounded-xl transition-colors text-sm shadow-sm"
            >
              Continuar →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function WizardContent() {
  const { state } = useBooking()

  return (
    <div className="max-w-5xl mx-auto">
      <div className="max-w-3xl mx-auto lg:max-w-none">
        <StepIndicator currentStep={state.step} steps={STEPS} />
      </div>

      {state.step === 1 ? (
        <div className="flex gap-8 items-start">
          <div className="flex-1 min-w-0">
            <CategoryStep />
          </div>
          <SelectedServicesSidebar />
        </div>
      ) : (
        <div className="max-w-3xl mx-auto min-h-[400px]">
          {state.step === 2 && <DateTimeStep />}
          {state.step === 3 && <ConfirmationStep />}
        </div>
      )}
    </div>
  )
}

export function BookingWizard() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-lavender border-t-transparent rounded-full" />
      </div>
    }>
      <BookingProvider>
        <WizardContent />
      </BookingProvider>
    </Suspense>
  )
}
