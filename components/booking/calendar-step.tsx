'use client'

import { useEffect, useState } from 'react'
import { useBooking } from './booking-context'
import { DayPicker } from 'react-day-picker'
import { es } from 'date-fns/locale'
import { format, isBefore, startOfDay } from 'date-fns'
import { WEEK_SCHEDULE } from '@/lib/schedule'

export function CalendarStep() {
  const { state, dispatch } = useBooking()
  const [blockedDates, setBlockedDates] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/blocked-dates')
      .then((res) => res.json())
      .then((data) => {
        setBlockedDates(data.map((d: { date: string }) => d.date))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const today = startOfDay(new Date())

  const isDisabled = (date: Date) => {
    // Past dates
    if (isBefore(date, today)) return true
    // Weekends (closed days)
    const dow = date.getDay()
    if (!WEEK_SCHEDULE[dow]?.open) return true
    // Blocked dates
    const dateStr = format(date, 'yyyy-MM-dd')
    if (blockedDates.includes(dateStr)) return true
    return false
  }

  const handleSelect = (date: Date | undefined) => {
    if (!date) return
    const dateStr = format(date, 'yyyy-MM-dd')
    dispatch({ type: 'SET_DATE', payload: dateStr })
  }

  const selectedDate = state.date ? new Date(state.date + 'T00:00:00') : undefined

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-[#CDB4DB] border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div>
      <h2 className="font-serif text-xl mb-2 text-center">Elige una fecha</h2>
      <p className="text-sm text-neutral-500 mb-6 text-center">
        Servicio: {state.service?.name}
      </p>

      <div className="flex justify-center">
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          disabled={isDisabled}
          locale={es}
          showOutsideDays={false}
          className="bg-white rounded-xl border border-neutral-200 p-4"
          classNames={{
            month_caption: 'font-serif text-lg mb-4 text-center capitalize',
            day: 'w-10 h-10 text-sm rounded-full transition-colors',
            selected: 'bg-[#CDB4DB] text-white hover:bg-[#bda0cb]',
            today: 'font-bold text-[#CDB4DB]',
            disabled: 'text-neutral-300 cursor-not-allowed',
            chevron: 'fill-[#CDB4DB]',
          }}
        />
      </div>

      <button
        onClick={() => dispatch({ type: 'GO_TO_STEP', payload: 1 })}
        className="mt-6 text-sm text-[#CDB4DB] hover:underline block mx-auto"
      >
        ← Cambiar servicio
      </button>
    </div>
  )
}
