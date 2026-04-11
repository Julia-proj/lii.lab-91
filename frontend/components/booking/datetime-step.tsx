'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useBooking, getTotalDuration } from './booking-context'
import { DayPicker } from 'react-day-picker'
import type { DayButtonProps } from 'react-day-picker'
import { es } from 'date-fns/locale'
import { format, isBefore, startOfDay } from 'date-fns'
import { WEEK_SCHEDULE } from '@/lib/schedule'
import { formatDuration } from '@/lib/format'
import { TimeSlotsGrid } from './time-slots-grid'

function CalendarDayButton({ day: _day, modifiers, ...props }: DayButtonProps) {
  const base = 'mx-auto w-9 h-9 rounded-full inline-flex items-center justify-center text-sm transition-all leading-none'
  let variant = 'text-neutral-700 hover:bg-lavender/20'
  if (modifiers.selected) variant = 'bg-plum text-white hover:bg-plum-hover shadow-sm'
  else if (modifiers.disabled) variant = 'text-neutral-300 cursor-not-allowed line-through'
  else if (modifiers.outside) variant = 'text-neutral-300'
  const todayClass = modifiers.today && !modifiers.selected ? 'font-semibold text-plum' : ''
  return <button {...props} disabled={modifiers.disabled} className={`${base} ${variant} ${todayClass}`} />
}

export function DateTimeStep() {
  const { state, dispatch } = useBooking()
  const [blockedDates, setBlockedDates] = useState<string[]>([])
  const [calendarLoading, setCalendarLoading] = useState(true)
  const [slots, setSlots] = useState<string[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  const totalDuration = getTotalDuration(state.services, state.quantities)
  const firstService = state.services[0]
  const firstServiceId = firstService?._id

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch('/api/blocked-dates')
        if (!res.ok) throw new Error('request_failed')
        const json = await res.json()
        if (!cancelled) setBlockedDates((json.data ?? []).map((d: { date: string }) => d.date))
      } catch {
        if (!cancelled) {
          setLoadError('Error al cargar los datos')
          toast.error('Error al cargar los datos')
        }
      } finally {
        if (!cancelled) setCalendarLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!state.date || state.services.length === 0 || !firstServiceId) { setSlots([]); return }
    let cancelled = false
    setSlotsLoading(true)
    const params = new URLSearchParams({
      date: state.date,
      serviceId: firstServiceId,
      ...(state.services.length > 1 ? { duration: String(totalDuration) } : {}),
    })
    const load = async () => {
      try {
        const res = await fetch(`/api/available-slots?${params}`)
        if (!res.ok) throw new Error('request_failed')
        const json = await res.json()
        if (!cancelled) setSlots(json.data?.slots ?? [])
      } catch {
        if (!cancelled) {
          setSlots([])
          toast.error('Error al cargar los datos')
        }
      } finally {
        if (!cancelled) setSlotsLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [state.date, state.services.length, firstServiceId, totalDuration])

  const today = startOfDay(new Date())

  const isDisabled = (date: Date) => {
    if (isBefore(date, today)) return true
    const dow = date.getDay()
    if (!WEEK_SCHEDULE[dow]?.open) return true
    const dateStr = format(date, 'yyyy-MM-dd')
    if (blockedDates.includes(dateStr)) return true
    return false
  }

  const selectedDate = state.date ? new Date(state.date + 'T00:00:00') : undefined
  const serviceNames = state.services.map((s) => s.name).join(' + ')

  if (calendarLoading) {
    return (
      <div className="flex justify-center py-12 animate-pulse">
        <div className="w-[300px] sm:w-[350px]">
          <div className="h-6 bg-black/5 rounded w-32 mb-6 mx-auto" />
          <div className="grid grid-cols-7 gap-1 mb-2">
            {[...Array(7)].map((_, i) => (
              <div key={`w-${i}`} className="h-4 bg-black/5 rounded w-full" />
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {[...Array(35)].map((_, i) => (
              <div key={`d-${i}`} className="aspect-square bg-black/5 rounded-full w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-red-500">{loadError}</p>
      </div>
    )
  }

  const handleTimeSlotSelect = (slot: string) => {
    dispatch({ type: 'SET_TIME', payload: slot })
    // UX: Ð¿Ð°ÑƒÐ·Ð° Ð´Ð»Ñ Ñ„Ð¸ÐºÑÐ°Ñ†Ð¸Ð¸ ÑÑ„Ñ„ÐµÐºÑ‚Ð° ÐºÐ½Ð¾Ð¿ÐºÐ¸ Ð¿ÐµÑ€ÐµÐ´ Ð¿Ð»Ð°Ð²Ð½Ñ‹Ð¼ Ð¿ÐµÑ€ÐµÑ…Ð¾Ð´Ð¾Ð¼
    setTimeout(() => {
      dispatch({ type: 'NEXT_STEP' })
    }, 450)
  }

  return (
    <div>
      <h2 className="font-serif text-xl mb-2 text-center">Elige fecha y hora</h2>
      {state.services.length > 0 && (
        <p className="text-sm text-neutral-500 mb-6 text-center">
          {serviceNames} &middot; {formatDuration(totalDuration)}
        </p>
      )}

      <div className="md:grid md:grid-cols-[auto_1fr] md:gap-8 md:items-start">
        <div className="flex justify-center mb-6 md:mb-0">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && dispatch({ type: 'SET_DATE', payload: format(date, 'yyyy-MM-dd') })}
            disabled={isDisabled}
            locale={es}
            showOutsideDays={false}
            components={{ DayButton: CalendarDayButton }}
            className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm"
            classNames={{
              month_caption: 'font-serif text-base mb-3 text-center capitalize',
              nav: 'flex items-center justify-between mb-2',
              chevron: 'fill-lavender',
              day: 'text-center',
              weeks: 'mt-1',
              weekdays: 'text-xs text-neutral-500',
              weekday: 'w-10 text-center pb-1 font-normal',
            }}
          />
        </div>

        <div className="md:pt-1">
          <div className="md:hidden">
            {state.date && (
              <TimeSlotsGrid
                date={state.date}
                slots={slots}
                slotsLoading={slotsLoading}
                selectedSlot={state.timeSlot}
                totalDuration={totalDuration}
                onSelectSlot={handleTimeSlotSelect}
              />
            )}
          </div>
          <div className="hidden md:block">
            <TimeSlotsGrid
              date={state.date}
              slots={slots}
              slotsLoading={slotsLoading}
              selectedSlot={state.timeSlot}
              totalDuration={totalDuration}
              onSelectSlot={handleTimeSlotSelect}
            />
          </div>
        </div>
      </div>

      <button
        onClick={() => dispatch({ type: 'GO_TO_STEP', payload: 1 })}
        className="mt-8 text-sm text-plum hover:text-plum-hover hover:underline block mx-auto font-medium"
      >
        Cambiar servicios
      </button>
    </div>
  )
}
