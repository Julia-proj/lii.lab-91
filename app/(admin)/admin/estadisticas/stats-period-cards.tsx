'use client'

import { Clock, CalendarDays, Calendar, ChevronDown, ChevronUp } from 'lucide-react'

interface Stats {
  bookingsToday: number
  bookingsThisWeek: number
  bookingsThisMonth: number
  incomeToday: number
  incomeThisWeek: number
  incomeThisMonth: number
}

type Period = 'hoy' | 'semana' | 'mes'

interface StatsPeriodCardsProps {
  stats: Stats
  activePeriod: Period | null
  onSetPeriod: (p: Period | null) => void
}

export function StatsPeriodCards({ stats, activePeriod, onSetPeriod }: StatsPeriodCardsProps) {
  const periods = [
    {
      key: 'hoy' as Period,    label: 'Hoy',    icon: Clock,
      income: stats.incomeToday,      bookings: stats.bookingsToday,
      cardClass:   'bg-plum/5 dark:bg-plum/10 border-plum/15 dark:border-plum/20',
      activeClass: 'ring-2 ring-plum/50',
      labelClass:  'text-plum/60 dark:text-plum/50',
      numClass:    'text-plum dark:text-lavender',
      iconClass:   'text-plum/25 dark:text-plum/30',
      divClass:    'border-plum/10 dark:border-plum/15',
    },
    {
      key: 'semana' as Period, label: 'Semana', icon: CalendarDays,
      income: stats.incomeThisWeek,   bookings: stats.bookingsThisWeek,
      cardClass:   'bg-stone-50/70 dark:bg-stone-900/20 border-stone-200/50 dark:border-stone-700/20',
      activeClass: 'ring-2 ring-stone-400/50',
      labelClass:  'text-stone-400 dark:text-stone-500',
      numClass:    'text-neutral-900 dark:text-neutral-100',
      iconClass:   'text-stone-300 dark:text-stone-700',
      divClass:    'border-stone-200/40 dark:border-stone-700/20',
    },
    {
      key: 'mes' as Period,    label: 'Mes',    icon: Calendar,
      income: stats.incomeThisMonth,  bookings: stats.bookingsThisMonth,
      cardClass:   'bg-white dark:bg-card border-neutral-100 dark:border-white/8',
      activeClass: 'ring-2 ring-neutral-300/60',
      labelClass:  'text-neutral-400',
      numClass:    'text-neutral-900 dark:text-neutral-100',
      iconClass:   'text-neutral-300 dark:text-neutral-600',
      divClass:    'border-neutral-100 dark:border-white/6',
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {periods.map(({ key, label, icon: Icon, income, bookings: cnt, cardClass, labelClass, numClass, iconClass, divClass, activeClass }) => {
        const isActive = activePeriod === key
        return (
          <button
            key={key}
            onClick={() => onSetPeriod(isActive ? null : key)}
            className={`rounded-xl sm:rounded-2xl p-3 sm:p-5 border flex flex-col gap-2 sm:gap-3 text-left transition-all duration-150 cursor-pointer hover:shadow-sm ${cardClass} ${isActive ? activeClass : ''}`}
          >
            <div className="flex items-center justify-between">
              <p className={`text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest leading-none ${labelClass}`}>{label}</p>
              <div className="flex items-center gap-1">
                <Icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 ${iconClass}`} />
                {isActive
                  ? <ChevronUp className="w-2.5 h-2.5 text-neutral-400" />
                  : <ChevronDown className="w-2.5 h-2.5 text-neutral-300 dark:text-neutral-600" />
                }
              </div>
            </div>
            <div>
              <p className={`text-lg sm:text-2xl lg:text-3xl font-bold tabular-nums leading-none ${numClass}`}>
                {income.toFixed(0)}<span className="text-[10px] sm:text-xs font-normal text-neutral-400 ml-0.5">€</span>
              </p>
              <p className={`text-[10px] sm:text-[11px] text-neutral-400 tabular-nums leading-none mt-1.5 pt-1.5 border-t ${divClass}`}>
                {cnt} cita{cnt !== 1 ? 's' : ''}
              </p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
