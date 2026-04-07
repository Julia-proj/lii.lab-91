'use client'

import { useEffect, useState, useMemo } from 'react'
import { toast } from 'sonner'
import { TrendingUp, Calendar, CalendarDays, Clock, ChevronDown, ChevronUp } from 'lucide-react'

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

interface Booking {
  _id: string
  date: string
  startTime: string
  endTime: string
  services: { name: string; price: number }[]
  user: { name: string }
  status: string
  paidAmount?: number
}

type Period = 'hoy' | 'semana' | 'mes'

function getPeriodRange(period: Period): { start: string; end: string } {
  const pad = (n: number) => String(n).padStart(2, '0')
  const now = new Date()
  const y = now.getFullYear(), m = now.getMonth()
  const today = `${y}-${pad(m + 1)}-${pad(now.getDate())}`

  if (period === 'hoy') return { start: today, end: today }

  if (period === 'semana') {
    const dow = now.getDay() === 0 ? 6 : now.getDay() - 1
    const ws = new Date(now); ws.setDate(now.getDate() - dow)
    const we = new Date(ws); we.setDate(ws.getDate() + 6)
    return {
      start: `${ws.getFullYear()}-${pad(ws.getMonth() + 1)}-${pad(ws.getDate())}`,
      end:   `${we.getFullYear()}-${pad(we.getMonth() + 1)}-${pad(we.getDate())}`,
    }
  }

  return {
    start: `${y}-${pad(m + 1)}-01`,
    end:   `${y}-${pad(m + 1)}-${pad(new Date(y, m + 1, 0).getDate())}`,
  }
}

const STATUS_LABELS: Record<string, string> = {
  pendiente:  'Pendiente',
  confirmada: 'Confirmada',
  completada: 'Completada',
  cancelada:  'Cancelada',
}

const STATUS_COLORS: Record<string, string> = {
  pendiente:  'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  confirmada: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
  completada: 'bg-plum/8 dark:bg-plum/20 text-plum dark:text-lavender',
  cancelada:  'bg-neutral-100 dark:bg-white/8 text-neutral-400',
}

export default function EstadisticasPage() {
  const [stats, setStats]       = useState<Stats | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading]   = useState(true)
  const [activePeriod, setActivePeriod] = useState<Period | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats').then((r) => r.json()),
      fetch('/api/bookings').then((r) => r.json()),
    ])
      .then(([statsData, bookingsData]) => {
        setStats(statsData.stats)
        setBookings(Array.isArray(bookingsData) ? bookingsData : [])
      })
      .catch(() => toast.error('Error al cargar estadísticas'))
      .finally(() => setLoading(false))
  }, [])

  const filteredBookings = useMemo(() => {
    if (!activePeriod) return []
    const { start, end } = getPeriodRange(activePeriod)
    return bookings
      .filter((b) => b.date >= start && b.date <= end && b.status !== 'cancelada')
      .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
  }, [activePeriod, bookings])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-5 h-5 border-2 border-neutral-200 border-t-plum rounded-full animate-spin" />
      </div>
    )
  }

  if (!stats) return null

  const periods: {
    key: Period
    label: string
    icon: typeof Clock
    income: number
    bookings: number
    cardClass: string
    labelClass: string
    numClass: string
    iconClass: string
    divClass: string
    activeClass: string
  }[] = [
    {
      key: 'hoy', label: 'Hoy', icon: Clock,
      income: stats.incomeToday, bookings: stats.bookingsToday,
      cardClass:   'bg-plum/5 dark:bg-plum/10 border-plum/15 dark:border-plum/20',
      activeClass: 'ring-2 ring-plum/50',
      labelClass:  'text-plum/60 dark:text-plum/50',
      numClass:    'text-plum dark:text-lavender',
      iconClass:   'text-plum/25 dark:text-plum/30',
      divClass:    'border-plum/10 dark:border-plum/15',
    },
    {
      key: 'semana', label: 'Semana', icon: CalendarDays,
      income: stats.incomeThisWeek, bookings: stats.bookingsThisWeek,
      cardClass:   'bg-stone-50/70 dark:bg-stone-900/20 border-stone-200/50 dark:border-stone-700/20',
      activeClass: 'ring-2 ring-stone-400/50',
      labelClass:  'text-stone-400 dark:text-stone-500',
      numClass:    'text-neutral-900 dark:text-neutral-100',
      iconClass:   'text-stone-300 dark:text-stone-700',
      divClass:    'border-stone-200/40 dark:border-stone-700/20',
    },
    {
      key: 'mes', label: 'Mes', icon: Calendar,
      income: stats.incomeThisMonth, bookings: stats.bookingsThisMonth,
      cardClass:   'bg-white dark:bg-[#1e1e24] border-neutral-100 dark:border-white/8',
      activeClass: 'ring-2 ring-neutral-300/60',
      labelClass:  'text-neutral-400',
      numClass:    'text-neutral-900 dark:text-neutral-100',
      iconClass:   'text-neutral-300 dark:text-neutral-600',
      divClass:    'border-neutral-100 dark:border-white/6',
    },
  ]

  const fmtDate = (d: string) =>
    new Date(d + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', weekday: 'short' })

  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <h1 className="font-serif text-2xl text-neutral-900 dark:text-neutral-100">Estadísticas</h1>
        <p className="text-xs text-neutral-400 mt-0.5">
          Los ingresos reflejan el importe registrado en cada cita. Pulsa una tarjeta para ver el detalle.
        </p>
      </div>

      {/* Period cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {periods.map(({ key, label, icon: Icon, income, bookings: cnt, cardClass, labelClass, numClass, iconClass, divClass, activeClass }) => {
          const isActive = activePeriod === key
          return (
            <button
              key={key}
              onClick={() => setActivePeriod(isActive ? null : key)}
              className={`rounded-xl sm:rounded-2xl p-3 sm:p-5 border flex flex-col gap-2 sm:gap-3 text-left transition-all duration-150 cursor-pointer hover:shadow-sm ${cardClass} ${isActive ? activeClass : ''}`}
            >
              <div className="flex items-center justify-between">
                <p className={`text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest leading-none ${labelClass}`}>
                  {label}
                </p>
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

      {/* Period detail — bookings list */}
      {activePeriod && (
        <div className="bg-white dark:bg-[#1e1e24] rounded-2xl border border-neutral-100 dark:border-white/8 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-3">
            Citas — {periods.find((p) => p.key === activePeriod)?.label}
          </p>
          {filteredBookings.length === 0 ? (
            <p className="text-sm text-neutral-400 text-center py-4">No hay citas en este período</p>
          ) : (
            <div className="space-y-0 divide-y divide-neutral-50 dark:divide-white/5">
              {filteredBookings.map((b) => {
                const serviceTotal = b.services?.reduce((s, sv) => s + sv.price, 0) ?? 0
                return (
                  <div key={b._id} className="flex items-center justify-between py-2.5 gap-3 first:pt-0 last:pb-0">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 tabular-nums shrink-0">
                          {fmtDate(b.date)} · {b.startTime}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${STATUS_COLORS[b.status] ?? STATUS_COLORS.cancelada}`}>
                          {STATUS_LABELS[b.status] ?? b.status}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate mt-0.5">
                        {b.user?.name}
                        <span className="text-neutral-400 font-normal"> · {b.services?.map((s) => s.name).join(', ')}</span>
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      {b.paidAmount != null ? (
                        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">
                          {b.paidAmount.toFixed(0)}€
                        </p>
                      ) : (
                        <p className="text-xs text-neutral-300 dark:text-neutral-600 tabular-nums">
                          ~{serviceTotal.toFixed(0)}€
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          {/* Period total */}
          {filteredBookings.length > 0 && (
            <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-white/6 flex items-center justify-between">
              <p className="text-xs text-neutral-400">{filteredBookings.length} cita{filteredBookings.length !== 1 ? 's' : ''}</p>
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">
                {filteredBookings.reduce((sum, b) => sum + (b.paidAmount ?? 0), 0).toFixed(0)}€ cobrados
              </p>
            </div>
          )}
        </div>
      )}

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
            { value: stats.totalBookings,       label: 'Citas',   numClass: 'text-neutral-900 dark:text-neutral-100', dotClass: 'bg-neutral-300 dark:bg-neutral-600', bgClass: 'bg-neutral-50 dark:bg-white/4 border-neutral-100 dark:border-white/6' },
            { value: stats.totalCourseBookings, label: 'Cursos',  numClass: 'text-plum',                              dotClass: 'bg-plum/60',                           bgClass: 'bg-plum/4 dark:bg-plum/10 border-plum/10 dark:border-plum/15' },
          ].map(({ value, label, numClass, dotClass, bgClass }) => (
            <div key={label} className={`flex flex-col items-center gap-1.5 rounded-xl border py-4 px-2 ${bgClass}`}>
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
