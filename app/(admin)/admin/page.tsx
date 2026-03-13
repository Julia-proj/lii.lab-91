'use client'

import { useState, useEffect } from 'react'
import { Calendar, TrendingUp, CalendarCheck } from 'lucide-react'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'

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
  service: { name: string }
  user: { name: string }
  date: string
  startTime: string
  endTime: string
  status: string
  paidAmount?: number
}

// ✅ Компонент вынесен НАРУЖУ — до AdminDashboard
function UpcomingBookingRow({
  booking,
  onPaidAmountChange,
}: {
  booking: UpcomingBooking
  onPaidAmountChange: () => void
}) {
  const { data: session } = useSession()
  const [editing, setEditing] = useState(false)
  const [amount, setAmount] = useState(booking.paidAmount ?? '')
  const [saving, setSaving] = useState(false)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/bookings/${booking._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paidAmount: Number(amount) }),
      })
      if (res.ok) {
        setEditing(false)
        onPaidAmountChange()
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex items-center justify-between text-sm border-b border-neutral-50 pb-2 last:border-0">
      <div>
        <span className="font-medium">{booking.user?.name || 'Cliente'}</span>
        <span className="text-neutral-400 mx-2">·</span>
        <span className="text-neutral-500">{booking.service?.name}</span>
      </div>
      <div className="flex items-center gap-3 text-neutral-500 text-right">
        <span className="capitalize">{formatDate(booking.date)}</span>
        <span className="text-neutral-400 mx-1">&middot;</span>
        <span>{booking.startTime} - {booking.endTime}</span>
        {session?.user?.role === 'admin' && (
          <span className="ml-4">
            {editing ? (
              <>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-20 px-2 py-1 border rounded text-right"
                  disabled={saving}
                />
                <button onClick={handleSave} disabled={saving} className="ml-1 text-green-600 font-bold">✔</button>
                <button onClick={() => setEditing(false)} disabled={saving} className="ml-1 text-neutral-400">✖</button>
              </>
            ) : (
              <>
                <span className="inline-block w-20 text-right">
                  {booking.paidAmount != null ? booking.paidAmount + '€' : <span className="text-neutral-300">—</span>}
                </span>
                <button onClick={() => setEditing(true)} className="ml-1 text-blue-600 underline">изменить</button>
              </>
            )}
          </span>
        )}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [upcoming, setUpcoming] = useState<UpcomingBooking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

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

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-6 h-6 border-2 border-neutral-200 border-t-[#CDB4DB] rounded-full animate-spin mx-auto" />
      </div>
    )
  }

  const statCards = [
    { label: 'Citas hoy', value: stats?.bookingsToday ?? 0, icon: CalendarCheck, color: 'text-green-600 bg-green-50' },
    { label: 'Ingresos hoy', value: stats?.incomeToday ?? 0, icon: TrendingUp, color: 'text-blue-600 bg-blue-50' },
    { label: 'Citas este mes', value: stats?.bookingsThisMonth ?? 0, icon: Calendar, color: 'text-purple-600 bg-purple-50' },
    { label: 'Ingresos este mes', value: stats?.incomeThisMonth ?? 0, icon: TrendingUp, color: 'text-pink-600 bg-pink-50' },
  ]

  return (
    <div>
      <h1 className="font-serif text-2xl mb-6">Panel de administración</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="bg-white rounded-xl border border-neutral-200 p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{card.value}</p>
                  <p className="text-xs text-neutral-500">{card.label}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Upcoming bookings */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="font-medium mb-4">Próximas citas</h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-neutral-400">No hay citas próximas</p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((b) => (
              <UpcomingBookingRow key={b._id} booking={b} onPaidAmountChange={fetchStats} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
