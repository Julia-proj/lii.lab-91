'use client'

import { useEffect, useState } from 'react'
import { useBooking, getTotalDuration } from './booking-context'
import { DayPicker } from 'react-day-picker'
import type { DayButtonProps } from 'react-day-picker'
import { es } from 'date-fns/locale'
import { format, isBefore, startOfDay } from 'date-fns'
import { WEEK_SCHEDULE } from '@/lib/schedule'

function CalendarDayButton({ day: _day, modifiers, ...props }: DayButtonProps) {
  const base =
    'mx-auto w-9 h-9 rounded-full inline-flex items-center justify-center text-sm transition-all leading-none'

  let variant = 'text-neutral-700 hover:bg-[#f0e8f5]'
  if (modifiers.selected) {
    variant = 'bg-[#B48EC5] text-white hover:bg-[#a37ab5] shadow-sm'
  } else if (modifiers.disabled) {
    variant = 'text-neutral-300 cursor-not-allowed line-through'
  } else if (modifiers.outside) {
    variant = 'text-neutral-300'
  }

  const todayClass =
    modifiers.today && !modifiers.selected ? 'font-semibold text-[#9b7fa8]' : ''

  return (
    <button
      {...props}
      disabled={modifiers.disabled}
      className={`${base} ${variant} ${todayClass}`}
    />
  )
}

function computeEndTime(start: string, durationMin: number): string {
  const [h, m] = start.split(':').map(Number)
  const total = h * 60 + m + durationMin
  return `${Math.floor(total / 60).toString().padStart(2, '0')}:${(total % 60).toString().padStart(2, '0')}`
}

function formatDuration(min: number): string {
  const h = Math.floor(min / 60)
  const m = min % 60
  if (h === 0) return `${m}min`
  if (m === 0) return `${h}h`
  return `${h}h ${m}min`
}

export function DateTimeStep() {
  const { state, dispatch } = useBooking()
  const [blockedDates, setBlockedDates] = useState<string[]>([])
  const [calendarLoading, setCalendarLoading] = useState(true)
  const [slots, setSlots] = useState<string[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)

  const totalDuration = getTotalDuration(state.services, state.quantities)
  const firstService = state.services[0]

  useEffect(() => {
    fetch('/api/blocked-dates')
      .then((res) => res.json())
      .then((data) => setBlockedDates(data.map((d: { date: string }) => d.date)))
      .catch(console.error)
      .finally(() => setCalendarLoading(false))
  }, [])

  // Fetch available slots — use first service's ID but the API uses service.duration.
  // For multi-service, we pass totalDuration as a query param override.
  useEffect(() => {
    if (!state.date || state.services.length === 0) {
      setSlots([])
      return
    }
    setSlotsLoading(true)
    const params = new URLSearchParams({
      date: state.date,
      serviceId: firstService._id,
      ...(state.services.length > 1 ? { duration: String(totalDuration) } : {}),
    })
    fetch(`/api/available-slots?${params}`)
      .then((res) => res.json())
      .then((data) => setSlots(data.slots || []))
      .catch(console.error)
      .finally(() => setSlotsLoading(false))
  }, [state.date, state.services, firstService, totalDuration])

  const today = startOfDay(new Date())

  const isDisabled = (date: Date) => {
    if (isBefore(date, today)) return true
    const dow = date.getDay()
    if (!WEEK_SCHEDULE[dow]?.open) return true
    const dateStr = format(date, 'yyyy-MM-dd')
    if (blockedDates.includes(dateStr)) return true
    return false
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return
    dispatch({ type: 'SET_DATE', payload: format(date, 'yyyy-MM-dd') })
  }

  const formatDateStr = (dateStr: string) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  }

  const selectedDate = state.date ? new Date(state.date + 'T00:00:00') : undefined
  const morningSlots = slots.filter((s) => s < '14:00')
  const afternoonSlots = slots.filter((s) => s >= '15:00')

  if (calendarLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-[#CDB4DB] border-t-transparent rounded-full" />
      </div>
    )
  }

  const serviceNames = state.services.map((s) => s.name).join(' + ')

  const SlotPanel = () => (
    <div>
      {!state.date ? (
        <div className="hidden md:flex h-full items-center justify-center py-12">
          <p className="text-sm text-neutral-400 text-center">Selecciona una fecha<br />para ver los horarios disponibles</p>
        </div>
      ) : (
        <div>
          <p className="text-sm font-semibold text-neutral-700 mb-4 capitalize">
            {formatDateStr(state.date)}
          </p>

          {slotsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-[#CDB4DB] border-t-transparent rounded-full" />
            </div>
          ) : slots.length === 0 ? (
            <p className="text-sm text-neutral-500 py-4 bg-neutral-50 rounded-xl text-center">
              No hay horarios disponibles. Elige otra fecha.
            </p>
          ) : (
            <div className="space-y-5">
              {morningSlots.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-neutral-400 mb-2 uppercase tracking-widest">Mañana</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-2">
                    {morningSlots.map((slot) => {
                      const end = computeEndTime(slot, totalDuration)
                      return (
                        <button
                          key={slot}
                          onClick={() => dispatch({ type: 'SET_TIME', payload: slot })}
                          className={`py-2.5 px-1 text-sm rounded-xl border transition-all font-medium ${
                            state.timeSlot === slot
                              ? 'bg-[#B48EC5] text-white border-[#B48EC5] shadow-sm'
                              : 'border-neutral-200 hover:border-[#B48EC5] hover:shadow-sm bg-white text-neutral-700'
                          }`}
                        >
                          <span>{slot}</span>
                          <span className={`text-[10px] block ${state.timeSlot === slot ? 'text-white/70' : 'text-neutral-400'}`}>
                            — {end}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
              {afternoonSlots.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-neutral-400 mb-2 uppercase tracking-widest">Tarde</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-2">
                    {afternoonSlots.map((slot) => {
                      const end = computeEndTime(slot, totalDuration)
                      return (
                        <button
                          key={slot}
                          onClick={() => dispatch({ type: 'SET_TIME', payload: slot })}
                          className={`py-2.5 px-1 text-sm rounded-xl border transition-all font-medium ${
                            state.timeSlot === slot
                              ? 'bg-[#B48EC5] text-white border-[#B48EC5] shadow-sm'
                              : 'border-neutral-200 hover:border-[#B48EC5] hover:shadow-sm bg-white text-neutral-700'
                          }`}
                        >
                          <span>{slot}</span>
                          <span className={`text-[10px] block ${state.timeSlot === slot ? 'text-white/70' : 'text-neutral-400'}`}>
                            — {end}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )

  return (
    <div>
      <h2 className="font-serif text-xl mb-2 text-center">Elige fecha y hora</h2>
      {state.services.length > 0 && (
        <p className="text-sm text-neutral-500 mb-6 text-center">
          {serviceNames} &middot; {formatDuration(totalDuration)}
        </p>
      )}

      {/* Desktop: 2-column (calendar | slots) */}
      <div className="md:grid md:grid-cols-[auto_1fr] md:gap-8 md:items-start">
        {/* Calendar */}
        <div className="flex justify-center mb-6 md:mb-0">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => handleDateSelect(date)}
            disabled={isDisabled}
            locale={es}
            showOutsideDays={false}
            components={{ DayButton: CalendarDayButton }}
            className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm"
            classNames={{
              month_caption: 'font-serif text-base mb-3 text-center capitalize',
              nav: 'flex items-center justify-between mb-2',
              chevron: 'fill-[#CDB4DB]',
              day: 'text-center',
              weeks: 'mt-1',
              weekdays: 'text-xs text-neutral-400',
              weekday: 'w-10 text-center pb-1 font-normal',
            }}
          />
        </div>

        {/* Slots — shown right of calendar on desktop, below on mobile */}
        <div className="md:pt-1">
          {/* Mobile: only show when date selected */}
          <div className="md:hidden">
            {state.date && <SlotPanel />}
          </div>
          {/* Desktop: always rendered (shows prompt or slots) */}
          <div className="hidden md:block">
            <SlotPanel />
          </div>
        </div>
      </div>

      <button
        onClick={() => dispatch({ type: 'GO_TO_STEP', payload: 1 })}
        className="mt-8 text-sm text-[#9b7fa8] hover:text-[#7d6389] hover:underline block mx-auto font-medium"
      >
        Cambiar servicios
      </button>
    </div>
  )
}
