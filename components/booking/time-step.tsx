'use client'

import { useEffect, useState } from 'react'
import { useBooking } from './booking-context'

export function TimeStep() {
  const { state, dispatch } = useBooking()
  const [slots, setSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!state.date || !state.service) return

    setLoading(true)
    fetch(`/api/available-slots?date=${state.date}&serviceId=${state.service._id}`)
      .then((res) => res.json())
      .then((data) => setSlots(data.slots || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [state.date, state.service])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  }

  // Group slots by morning/afternoon
  const morningSlots = slots.filter((s) => s < '14:00')
  const afternoonSlots = slots.filter((s) => s >= '15:00')

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-[#CDB4DB] border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div>
      <h2 className="font-serif text-xl mb-2 text-center">Elige una hora</h2>
      <p className="text-sm text-neutral-500 mb-6 text-center capitalize">
        {state.date && formatDate(state.date)}
      </p>

      {slots.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-neutral-500 mb-4">No hay horarios disponibles para esta fecha.</p>
          <button
            onClick={() => dispatch({ type: 'GO_TO_STEP', payload: 2 })}
            className="text-sm text-[#CDB4DB] hover:underline"
          >
            Elegir otra fecha
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {morningSlots.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-neutral-500 mb-3">Mañana</h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {morningSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => dispatch({ type: 'SET_TIME', payload: slot })}
                    className={`py-2.5 px-3 text-sm rounded-full border transition-colors ${
                      state.timeSlot === slot
                        ? 'bg-[#CDB4DB] text-white border-[#CDB4DB]'
                        : 'border-neutral-200 hover:border-[#CDB4DB] bg-white'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          {afternoonSlots.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-neutral-500 mb-3">Tarde</h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {afternoonSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => dispatch({ type: 'SET_TIME', payload: slot })}
                    className={`py-2.5 px-3 text-sm rounded-full border transition-colors ${
                      state.timeSlot === slot
                        ? 'bg-[#CDB4DB] text-white border-[#CDB4DB]'
                        : 'border-neutral-200 hover:border-[#CDB4DB] bg-white'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => dispatch({ type: 'GO_TO_STEP', payload: 2 })}
        className="mt-6 text-sm text-[#CDB4DB] hover:underline block mx-auto"
      >
        ← Cambiar fecha
      </button>
    </div>
  )
}
