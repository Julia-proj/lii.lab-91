'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { TrendingUp, Calendar, CalendarDays, Clock } from 'lucide-react'

interface Stats {
  bookingsToday: number
  bookingsThisWeek: number
  bookingsThisMonth: number
  incomeToday: number
  incomeThisWeek: number
  incomeThisMonth: number
  totalBookings: number
  totalCourseBookings: number
  totalGuidesSold: number
}

export default function EstadisticasPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((d) => setStats(d.stats))
      .catch(() => toast.error('Error al cargar estadísticas'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-5 h-5 border-2 border-neutral-200 border-t-plum rounded-full animate-spin" />
      </div>
    )
  }

  if (!stats) return null

  const periods = [
    {
      label: 'Hoy', icon: Clock,
      income: stats.incomeToday, bookings: stats.bookingsToday,
      cardClass: 'bg-plum/5 dark:bg-plum/10 border-plum/15 dark:border-plum/20',
      labelClass: 'text-plum/60 dark:text-plum/50',
      numClass:   'text-plum dark:text-lavender',
      iconClass:  'text-plum/25 dark:text-plum/30',
      divClass:   'border-plum/10 dark:border-plum/15',
    },
    {
      label: 'Semana', icon: CalendarDays,
      income: stats.incomeThisWeek, bookings: stats.bookingsThisWeek,
      cardClass: 'bg-stone-50/70 dark:bg-stone-900/20 border-stone-200/50 dark:border-stone-700/20',
      labelClass: 'text-stone-400 dark:text-stone-500',
      numClass:   'text-neutral-900 dark:text-neutral-100',
      iconClass:  'text-stone-300 dark:text-stone-700',
      divClass:   'border-stone-200/40 dark:border-stone-700/20',
    },
    {
      label: 'Mes', icon: Calendar,
      income: stats.incomeThisMonth, bookings: stats.bookingsThisMonth,
      cardClass: 'bg-white dark:bg-[#1e1e24] border-neutral-100 dark:border-white/8',
      labelClass: 'text-neutral-400',
      numClass:   'text-neutral-900 dark:text-neutral-100',
      iconClass:  'text-neutral-300 dark:text-neutral-600',
      divClass:   'border-neutral-100 dark:border-white/6',
    },
  ]

  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <h1 className="font-serif text-2xl text-neutral-900 dark:text-neutral-100">Estadísticas</h1>
        <p className="text-xs text-neutral-400 mt-0.5">Los ingresos reflejan citas <span className="font-medium">completadas</span>. El total de citas incluye todos los estados.</p>
      </div>

      {/* Period cards — always 3 columns */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {periods.map(({ label, icon: Icon, income, bookings, cardClass, labelClass, numClass, iconClass, divClass }) => (
          <div key={label} className={`rounded-xl sm:rounded-2xl p-3 sm:p-5 border flex flex-col gap-2 sm:gap-3 ${cardClass}`}>
            <div className="flex items-center justify-between">
              <p className={`text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest leading-none ${labelClass}`}>
                {label}
              </p>
              <Icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 ${iconClass}`} />
            </div>
            <div>
              <p className={`text-lg sm:text-2xl lg:text-3xl font-bold tabular-nums leading-none ${numClass}`}>
                {income.toFixed(0)}<span className="text-[10px] sm:text-xs font-normal text-neutral-400 ml-0.5">€</span>
              </p>
              <p className={`text-[10px] sm:text-[11px] text-neutral-400 tabular-nums leading-none mt-1.5 pt-1.5 border-t ${divClass}`}>
                {bookings} cita{bookings !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Historical totals */}
      <div className="bg-white dark:bg-[#1e1e24] rounded-2xl border border-neutral-100 dark:border-white/8 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-600" />
          <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
            Histórico acumulado
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {[
            {
              value:    stats.totalBookings,
              label:    'Citas',
              numClass: 'text-neutral-900 dark:text-neutral-100',
              dotClass: 'bg-neutral-300 dark:bg-neutral-600',
              bgClass:  'bg-neutral-50 dark:bg-white/4 border-neutral-100 dark:border-white/6',
            },
            {
              value:    stats.totalCourseBookings,
              label:    'Cursos',
              numClass: 'text-plum',
              dotClass: 'bg-plum/60',
              bgClass:  'bg-plum/4 dark:bg-plum/10 border-plum/10 dark:border-plum/15',
            },
          ].map(({ value, label, numClass, dotClass, bgClass }) => (
            <div
              key={label}
              className={`flex flex-col items-center gap-1.5 rounded-xl border py-4 px-2 ${bgClass}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
              <p className={`text-2xl sm:text-3xl font-bold tabular-nums leading-none ${numClass}`}>{value}</p>
              <p className="text-[10px] sm:text-xs text-neutral-400 leading-none">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
