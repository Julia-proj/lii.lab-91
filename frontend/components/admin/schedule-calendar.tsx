'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { WEEK_SCHEDULE } from '@/lib/schedule'

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) days.push(d)
  return days
}

function formatDateStr(year: number, month: number, day: number): string {
  return `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
}

interface ScheduleCalendarProps {
  currentMonth: number
  currentYear: number
  onPrevMonth: () => void
  onNextMonth: () => void
  selectedDate: string | null
  onSelectDate: (dateStr: string) => void
  blockedDateSet: Set<string>
  getBookingsCount: (dateStr: string) => number
  getBlockedHoursCount: (dateStr: string) => number
}

export function ScheduleCalendar({
  currentMonth,
  currentYear,
  onPrevMonth,
  onNextMonth,
  selectedDate,
  onSelectDate,
  blockedDateSet,
  getBookingsCount,
  getBlockedHoursCount,
}: ScheduleCalendarProps) {
  const now = new Date()
  const monthDays = getMonthDays(currentYear, currentMonth)
  const monthName = new Date(currentYear, currentMonth).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })

  return (
    <div className="bg-white dark:bg-card rounded-2xl border border-neutral-100 dark:border-white/8 p-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onPrevMonth} className="p-2 hover:bg-neutral-100 dark:hover:bg-white/8 rounded-lg transition-colors">
          <ChevronLeft className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
        </button>
        <h2 className="font-serif text-base capitalize text-neutral-900 dark:text-neutral-100">{monthName}</h2>
        <button onClick={onNextMonth} className="p-2 hover:bg-neutral-100 dark:hover:bg-white/8 rounded-lg transition-colors">
          <ChevronRight className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs mb-1">
        {DAY_NAMES.map((d) => (
          <div key={d} className="py-1 text-neutral-400 dark:text-neutral-500 font-medium">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {monthDays.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} />
          const dateStr = formatDateStr(currentYear, currentMonth, day)
          const dow = new Date(dateStr + 'T00:00:00').getDay()
          const isOpen = WEEK_SCHEDULE[dow]?.open ?? false
          const isBlocked = blockedDateSet.has(dateStr)
          const hasBookings = getBookingsCount(dateStr) > 0
          const hasBlockedHours = getBlockedHoursCount(dateStr) > 0
          const isSelected = selectedDate === dateStr
          const isToday = dateStr === now.toISOString().split('T')[0]

          let bg = 'bg-white dark:bg-transparent hover:bg-neutral-50 dark:hover:bg-white/5'
          if (isSelected) bg = 'bg-plum/15 dark:bg-plum/25 ring-2 ring-plum/40'
          else if (isBlocked) bg = 'bg-red-50/60 dark:bg-red-900/20 hover:bg-red-50 dark:hover:bg-red-900/30'
          else if (!isOpen) bg = 'bg-white dark:bg-white/3 hover:bg-neutral-50 dark:hover:bg-white/5'

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={`relative rounded-lg p-1.5 text-sm transition-all ${bg} ${!isOpen && !isBlocked ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-700 dark:text-neutral-300'}`}
            >
              <span className={`${isToday ? 'font-bold text-plum dark:text-lavender' : ''}`}>{day}</span>
              <div className="flex items-center justify-center gap-0.5 mt-0.5">
                {hasBookings && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                {hasBlockedHours && <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />}
                {isBlocked && <span className="w-1.5 h-1.5 rounded-full bg-red-400" />}
              </div>
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-4 mt-4 text-[10px] text-neutral-400">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Citas</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400" /> Horas bloq.</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" /> Dia bloq.</span>
      </div>
    </div>
  )
}
