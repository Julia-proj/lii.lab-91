'use client'

import { useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isToday,
  format, addMonths, subMonths,
} from 'date-fns'
import { es } from 'date-fns/locale'

interface Booking {
  _id: string
  date: string
  status: string
}

interface AgendaMonthCalendarProps {
  currentMonth: Date
  setCurrentMonth: (d: Date) => void
  selectedDay: string
  setSelectedDay: (d: string) => void
  bookingsByDay: Map<string, Booking[]>
  onDayClick?: () => void
}

export function AgendaMonthCalendar({
  currentMonth,
  setCurrentMonth,
  selectedDay,
  setSelectedDay,
  bookingsByDay,
  onDayClick,
}: AgendaMonthCalendarProps) {
  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 })
    const end   = endOfWeek(endOfMonth(currentMonth),     { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [currentMonth])

  return (
    <div className="bg-white dark:bg-card shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-2xl border border-black/[0.04] dark:border-white/5 overflow-hidden order-2 lg:order-1">
      {/* Month navigation */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-neutral-50 dark:border-white/5">
        <button
          onClick={() => {
            const prev = subMonths(currentMonth, 1)
            setCurrentMonth(prev)
            setSelectedDay(format(startOfMonth(prev), 'yyyy-MM-dd'))
          }}
          className="p-2 sm:p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-neutral-500" />
        </button>
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 capitalize">
            {format(currentMonth, 'MMMM yyyy', { locale: es })}
          </h2>
          <button
            onClick={() => {
              const now = new Date()
              setCurrentMonth(now)
              setSelectedDay(now.toISOString().split('T')[0])
              onDayClick?.()
            }}
            className="text-[10px] font-medium text-plum/70 hover:text-plum border border-plum/20 hover:border-plum/40 rounded-md px-1.5 py-0.5 transition-colors"
          >
            Hoy
          </button>
        </div>
        <button
          onClick={() => {
            const next = addMonths(currentMonth, 1)
            setCurrentMonth(next)
            setSelectedDay(format(startOfMonth(next), 'yyyy-MM-dd'))
          }}
          className="p-2 sm:p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/8 transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-neutral-500" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-neutral-50 dark:border-white/5">
        {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'].map((d, i) => (
          <div key={d} className={`py-2.5 text-center text-[10px] uppercase tracking-widest font-medium ${i >= 5 ? 'text-neutral-300 dark:text-neutral-600 bg-neutral-50/70 dark:bg-white/[0.025]' : 'text-neutral-400'}`}>{d}</div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day) => {
          const dayStr = format(day, 'yyyy-MM-dd')
          const active = (bookingsByDay.get(dayStr) || []).filter((b) => b.status !== 'cancelada')
          const inMonth = isSameMonth(day, currentMonth)
          const isSel  = selectedDay === dayStr
          const isT    = isToday(day)
          const hasPending   = active.some((b) => b.status === 'pendiente')
          const hasConfirmed = !hasPending && active.some((b) => b.status === 'confirmada')
          const isWeekend = day.getDay() === 0 || day.getDay() === 6

          return (
            <button
              key={dayStr}
              onClick={() => { setSelectedDay(dayStr); onDayClick?.() }}
              className={`relative py-1.5 sm:py-2 px-0.5 min-h-[40px] sm:min-h-[50px] flex flex-col items-center gap-0.5 transition-colors border-b border-r border-neutral-50 dark:border-white/4 last:border-r-0 ${
                isSel && isT
                  ? 'bg-plum/12 dark:bg-plum/22'
                  : isSel
                    ? 'bg-plum/8 dark:bg-plum/15'
                    : isT
                      ? 'bg-plum/5 dark:bg-plum/10'
                      : isWeekend
                        ? 'bg-neutral-50/80 dark:bg-white/[0.04] hover:bg-neutral-100/70 dark:hover:bg-white/[0.07]'
                        : 'hover:bg-neutral-50 dark:hover:bg-white/4'
              } ${!inMonth ? 'opacity-20' : ''}`}
            >
              <span className={`text-xs sm:text-sm font-semibold w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full transition-colors ${
                isT
                  ? 'bg-plum text-white'
                  : isSel
                    ? 'text-plum ring-1 ring-plum/30'
                    : 'text-neutral-700 dark:text-neutral-300'
              }`}>
                {format(day, 'd')}
              </span>
              {active.length > 0 && (
                <span className={`text-[10px] font-bold leading-none tabular-nums ${
                  hasPending
                    ? 'text-[#C89520]'
                    : hasConfirmed
                      ? 'text-emerald-500 dark:text-emerald-400'
                      : 'text-neutral-400 dark:text-neutral-500'
                }`}>
                  {active.length}
                </span>
              )}
              {hasPending && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#C89520]" />
              )}
              {hasConfirmed && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
