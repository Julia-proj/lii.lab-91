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

  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <h1 className="font-serif text-2xl text-neutral-900 dark:text-neutral-100">Estadísticas</h1>
        <p className="text-xs text-neutral-400 mt-0.5">Ingresos y citas por período</p>
      </div>

      {/* Period cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">

        {/* HOY — plum suave */}
        <div className="bg-plum/[0.13] dark:bg-plum/20 rounded-xl p-3 sm:p-4 border border-plum/25 dark:border-plum/35">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-plum/70 leading-none">Hoy</p>
            <Clock className="w-3 h-3 text-plum/40 shrink-0" />
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold tabular-nums text-plum leading-none">
            {stats.incomeToday.toFixed(0)}
            <span className="text-xs font-normal text-plum/45 ml-0.5">€</span>
          </p>
          <div className="mt-2.5 pt-2.5 border-t border-plum/15">
            <p className="text-[11px] sm:text-xs text-plum/55 tabular-nums leading-none">
              {stats.bookingsToday} cita{stats.bookingsToday !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* SEMANA — neutral limpia */}
        <div className="bg-white dark:bg-[#1e1e24] rounded-xl p-3 sm:p-4 border border-neutral-100 dark:border-white/8">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 leading-none">Semana</p>
            <CalendarDays className="w-3 h-3 text-neutral-300 dark:text-neutral-600 shrink-0" />
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold tabular-nums text-neutral-800 dark:text-neutral-100 leading-none">
            {stats.incomeThisWeek.toFixed(0)}
            <span className="text-xs font-normal text-neutral-400 ml-0.5">€</span>
          </p>
          <div className="mt-2.5 pt-2.5 border-t border-neutral-100 dark:border-white/6">
            <p className="text-[11px] sm:text-xs text-neutral-400 tabular-nums leading-none">
              {stats.bookingsThisWeek} cita{stats.bookingsThisWeek !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* MES — tinte plum suave */}
        <div className="bg-plum/5 dark:bg-plum/10 rounded-xl p-3 sm:p-4 border border-plum/12 dark:border-plum/20">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-plum/55 dark:text-plum/70 leading-none">Mes</p>
            <Calendar className="w-3 h-3 text-plum/35 shrink-0" />
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold tabular-nums text-plum leading-none">
            {stats.incomeThisMonth.toFixed(0)}
            <span className="text-xs font-normal text-plum/45 ml-0.5">€</span>
          </p>
          <div className="mt-2.5 pt-2.5 border-t border-plum/10">
            <p className="text-[11px] sm:text-xs text-plum/50 tabular-nums leading-none">
              {stats.bookingsThisMonth} cita{stats.bookingsThisMonth !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

      </div>

      {/* Historical totals */}
      <div className="bg-white dark:bg-[#1e1e24] rounded-2xl border border-neutral-100 dark:border-white/8 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-600" />
          <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
            Histórico acumulado
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            {
              value: stats.totalBookings,
              label: 'Citas',
              numClass: 'text-neutral-900 dark:text-neutral-100',
              dotClass: 'bg-neutral-300 dark:bg-neutral-600',
              bgClass: 'bg-neutral-50 dark:bg-white/4 border-neutral-100 dark:border-white/6',
            },
            {
              value: stats.totalCourseBookings,
              label: 'Cursos',
              numClass: 'text-plum',
              dotClass: 'bg-plum/60',
              bgClass: 'bg-plum/4 dark:bg-plum/10 border-plum/10 dark:border-plum/15',
            },
          ].map(({ value, label, numClass, dotClass, bgClass }) => (
            <div
              key={label}
              className={`flex flex-col items-center gap-1.5 rounded-xl border py-4 px-2 ${bgClass}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
              <p className={`text-2xl sm:text-3xl font-bold tabular-nums leading-none ${numClass}`}>
                {value}
              </p>
              <p className="text-[10px] sm:text-xs text-neutral-400 leading-none">{label}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
