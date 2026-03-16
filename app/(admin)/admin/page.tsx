'use client'

import { useState, useEffect } from 'react'
import { Calendar, TrendingUp, CalendarCheck, BookOpen, Users, Pencil, Check, X, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface Stats {
  totalBookings: number
  bookingsThisMonth: number
  bookingsToday: number
  totalUsers: number
  totalCourseBookings: number
  totalGuidesSold: number
  incomeToday?: number
  incomeThisMonth?: number
}

interface UpcomingBooking {
  _id: string
  services: { name: string }[]
  user: { name: string }
  date: string
  startTime: string
  endTime: string
  status: string
  paidAmount?: number
}

function UpcomingRow({
  booking,
  onRefresh,
}: {
  booking: UpcomingBooking
  onRefresh: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [amount, setAmount] = useState(String(booking.paidAmount ?? ''))
  const [saving, setSaving] = useState(false)

  const fmt = (d: string) =>
    new Date(d + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })

  const handleSave = async () => {
    const n = parseFloat(amount)
    if (isNaN(n) || n < 0) { toast.error('Importe inválido'); return }
    setSaving(true)
    try {
      const res = await fetch(`/api/bookings/${booking._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paidAmount: n }),
      })
      if (res.ok) { setEditing(false); onRefresh(); toast.success('Guardado') }
    } finally { setSaving(false) }
  }

  const serviceNames = (booking.services || []).map((s) => s.name).join(', ')

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 py-3 border-b border-neutral-50 last:border-0">
      {/* Left */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm text-neutral-900">{booking.user?.name || '—'}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
            booking.status === 'confirmada' ? 'bg-emerald-50 text-emerald-700' :
            booking.status === 'pendiente'  ? 'bg-amber-50 text-amber-700' :
            'bg-neutral-100 text-neutral-500'
          }`}>{booking.status}</span>
        </div>
        <p className="text-xs text-neutral-400 truncate mt-0.5">{serviceNames || '—'}</p>
        <p className="text-xs text-neutral-500 mt-0.5">
          <span className="capitalize">{fmt(booking.date)}</span>
          <span className="mx-1 text-neutral-300">·</span>
          {booking.startTime}–{booking.endTime}
        </p>
      </div>

      {/* Right: paid */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-[10px] text-neutral-400 mr-0.5">pagado:</span>
        {editing ? (
          <>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false) }}
              className="w-20 border border-[#CDB4DB] rounded-lg px-2 py-1 text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#CDB4DB]"
              autoFocus
              disabled={saving}
            />
            <button onClick={handleSave} disabled={saving} className="p-1 rounded-md bg-emerald-500 text-white hover:bg-emerald-600 transition-colors disabled:opacity-50">
              <Check className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setEditing(false)} className="p-1 rounded-md text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <button
            onClick={() => { setEditing(true); setAmount(String(booking.paidAmount ?? '')) }}
            className="group flex items-center gap-1 text-sm"
          >
            <span className={booking.paidAmount != null ? 'font-semibold text-emerald-600' : 'text-neutral-300'}>
              {booking.paidAmount != null ? `${booking.paidAmount}€` : '—'}
            </span>
            <Pencil className="w-3 h-3 text-neutral-300 group-hover:text-[#9b7fa8] transition-colors" />
          </button>
        )}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [upcoming, setUpcoming] = useState<UpcomingBooking[]>([])
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setStats(data.stats)
      setUpcoming(data.upcomingBookings)
    } catch {
      toast.error('Error al cargar estadísticas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStats() }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-neutral-200 border-t-[#CDB4DB] rounded-full animate-spin" />
      </div>
    )
  }

  const today = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })

  const primaryStats = [
    {
      label: 'Citas hoy',
      value: stats?.bookingsToday ?? 0,
      suffix: '',
      icon: CalendarCheck,
      bg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      valueColor: 'text-emerald-700',
    },
    {
      label: 'Ingresos hoy',
      value: stats?.incomeToday ?? 0,
      suffix: '€',
      icon: TrendingUp,
      bg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      valueColor: 'text-blue-700',
    },
    {
      label: 'Citas este mes',
      value: stats?.bookingsThisMonth ?? 0,
      suffix: '',
      icon: Calendar,
      bg: 'bg-violet-50',
      iconColor: 'text-violet-500',
      valueColor: 'text-violet-700',
    },
    {
      label: 'Ingresos mes',
      value: stats?.incomeThisMonth ?? 0,
      suffix: '€',
      icon: TrendingUp,
      bg: 'bg-pink-50',
      iconColor: 'text-pink-500',
      valueColor: 'text-pink-700',
    },
  ]

  const secondaryStats = [
    { label: 'Reservas de curso', value: stats?.totalCourseBookings ?? 0, icon: BookOpen },
    { label: 'Guías vendidas', value: stats?.totalGuidesSold ?? 0, icon: BookOpen },
    { label: 'Usuarios registrados', value: stats?.totalUsers ?? 0, icon: Users },
    { label: 'Total citas (activas)', value: stats?.totalBookings ?? 0, icon: Calendar },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl text-neutral-900">Panel</h1>
        <p className="text-xs text-neutral-400 mt-0.5 capitalize">{today}</p>
      </div>

      {/* Primary stats: 2x2 mobile → 4x1 desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {primaryStats.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className={`${s.bg} rounded-2xl p-4`}>
              <div className={`w-8 h-8 rounded-xl bg-white/60 flex items-center justify-center mb-3 ${s.iconColor}`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className={`text-2xl font-bold leading-none ${s.valueColor}`}>
                {s.value}{s.suffix}
              </p>
              <p className="text-xs text-neutral-500 mt-1 font-medium">{s.label}</p>
            </div>
          )
        })}
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {secondaryStats.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="bg-white border border-neutral-100 rounded-xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-neutral-400" />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold text-neutral-800 leading-none">{s.value}</p>
                <p className="text-[10px] text-neutral-400 mt-0.5 leading-tight">{s.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Upcoming bookings */}
      <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-50">
          <h2 className="font-semibold text-sm text-neutral-900">Próximas citas</h2>
          <Link
            href="/admin/bookings"
            className="flex items-center gap-1 text-xs text-[#9b7fa8] hover:text-[#7d6389] transition-colors font-medium"
          >
            Ver todas
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="px-5">
          {upcoming.length === 0 ? (
            <p className="text-sm text-neutral-400 py-6 text-center">No hay citas próximas</p>
          ) : (
            <div>
              {upcoming.map((b) => (
                <UpcomingRow key={b._id} booking={b} onRefresh={fetchStats} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: 'Gestionar reservas', href: '/admin/bookings', icon: Calendar },
          { label: 'Bloquear horario', href: '/admin/schedule', icon: CalendarCheck },
          { label: 'Servicios', href: '/admin/services', icon: BookOpen },
        ].map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-3 bg-white border border-neutral-100 rounded-xl p-4 hover:border-[#CDB4DB]/60 hover:shadow-sm transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-[#CDB4DB]/10 flex items-center justify-center shrink-0 group-hover:bg-[#CDB4DB]/20 transition-colors">
                <Icon className="w-4 h-4 text-[#9b7fa8]" />
              </div>
              <span className="text-sm font-medium text-neutral-700 group-hover:text-neutral-900 transition-colors">{item.label}</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-300 ml-auto group-hover:text-[#9b7fa8] group-hover:translate-x-0.5 transition-all" />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
