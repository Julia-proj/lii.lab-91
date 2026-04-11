'use client'

import { useEffect, useState, useMemo } from 'react'
import { toast } from 'sonner'
import { TrendingUp } from 'lucide-react'
import { StatsPeriodCards } from './stats-period-cards'
import { StatsPeriodDetail } from './stats-period-detail'

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
  return { start: `${y}-${pad(m + 1)}-01`, end: `${y}-${pad(m + 1)}-${pad(new Date(y, m + 1, 0).getDate())}` }
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
      .then(([statsJson, bookingsJson]) => {
        setStats(statsJson.data?.stats ?? null)
        setBookings(bookingsJson.data ?? [])
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

  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <h1 className="font-serif text-2xl text-neutral-900 dark:text-neutral-100">Estadísticas</h1>
        <p className="text-xs text-neutral-400 mt-0.5">
          Los ingresos reflejan el importe registrado en cada cita. Pulsa una tarjeta para ver el detalle.
        </p>
      </div>

      <StatsPeriodCards stats={stats} activePeriod={activePeriod} onSetPeriod={setActivePeriod} />

      {activePeriod && (
        <StatsPeriodDetail activePeriod={activePeriod} filteredBookings={filteredBookings} />
      )}

      {/* Historical totals */}
      <div className="bg-white dark:bg-card rounded-2xl border border-neutral-100 dark:border-white/8 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-600" />
          <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Histórico acumulado</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {[
            { value: stats.totalBookings,       label: 'Citas',  numClass: 'text-neutral-900 dark:text-neutral-100', dotClass: 'bg-neutral-300 dark:bg-neutral-600', bgClass: 'bg-neutral-50 dark:bg-white/4 border-neutral-100 dark:border-white/6' },
            { value: stats.totalCourseBookings, label: 'Cursos', numClass: 'text-plum',                              dotClass: 'bg-plum/60',                           bgClass: 'bg-plum/4 dark:bg-plum/10 border-plum/10 dark:border-plum/15' },
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
