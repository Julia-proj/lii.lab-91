'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { BookingsBookingRow, type BookingData } from '@/components/admin/bookings-booking-row'
import { BookingsCourseTab } from '@/components/admin/bookings-course-tab'
import { BookingsFilters } from '@/components/admin/bookings-filters'
import { BookingsPendingBanner } from '@/components/admin/bookings-pending-banner'

export default function AdminBookingsPage() {
  const [tab, setTab] = useState<'citas' | 'cursos'>('citas')
  const [bookings, setBookings] = useState<BookingData[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week'>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/bookings')
      .then((r) => r.json())
      .then((json) => setBookings(json.data ?? []))
      .catch(() => toast.error('Error al cargar reservas'))
      .finally(() => setLoading(false))
  }, [])

  const handleUpdate = (id: string, patch: Partial<BookingData>) => {
    if (patch.status === '__deleted__') {
      setBookings((prev) => prev.filter((b) => b._id !== id))
    } else {
      setBookings((prev) => prev.map((b) => b._id === id ? { ...b, ...patch } : b))
    }
  }

  const handleConfirmDirect = async (id: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'confirmada' }),
      })
      if (!res.ok) { toast.error('Error al confirmar'); return }
      handleUpdate(id, { status: 'confirmada' })
      toast.success('Cita confirmada · Cliente notificado')
    } catch { toast.error('Error de conexion') }
  }

  const todayStr = new Date().toISOString().split('T')[0]
  const weekStart = (() => {
    const d = new Date(); const day = d.getDay()
    d.setDate(d.getDate() - (day === 0 ? 6 : day - 1))
    return d.toISOString().split('T')[0]
  })()
  const weekEnd = (() => {
    const d = new Date(); const day = d.getDay()
    d.setDate(d.getDate() + (day === 0 ? 0 : 7 - day))
    return d.toISOString().split('T')[0]
  })()

  const filtered = bookings
    .filter((b) => statusFilter === 'all' || b.status === statusFilter)
    .filter((b) => {
      if (dateFilter === 'today') return b.date === todayStr
      if (dateFilter === 'week') return b.date >= weekStart && b.date <= weekEnd
      return true
    })
    .filter((b) =>
      !search ||
      b.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      (b.services || []).some((s) => (s.name || '').toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const dc = b.date.localeCompare(a.date)
      return dc !== 0 ? dc : (b.startTime || '').localeCompare(a.startTime || '')
    })

  const counts = { all: bookings.length } as Record<string, number>
  for (const b of bookings) { counts[b.status] = (counts[b.status] || 0) + 1 }

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <div className="w-5 h-5 border-2 border-neutral-200 border-t-plum rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-5 max-w-xl">
      <div>
        <h1 className="font-serif text-2xl text-neutral-900 dark:text-neutral-100">Reservas</h1>
        <p className="text-xs text-neutral-400 mt-0.5">{bookings.length} citas en total</p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 bg-neutral-100 dark:bg-white/5 p-1 rounded-xl w-fit">
        {(['citas', 'cursos'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
              tab === t
                ? 'bg-white dark:bg-secondary text-neutral-900 dark:text-neutral-100 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'cursos' && <BookingsCourseTab />}

      {tab === 'citas' && (
        <div className="space-y-3">
          <BookingsPendingBanner
            pendingBookings={bookings.filter((b) => b.status === 'pendiente')}
            onConfirm={handleConfirmDirect}
          />

          <BookingsFilters
            search={search}
            setSearch={setSearch}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            counts={counts}
          />

          {/* Bookings list */}
          {filtered.length === 0 ? (
            <p className="text-sm text-neutral-400 text-center py-8">Sin resultados</p>
          ) : (
            filtered.map((b) => <BookingsBookingRow key={b._id} booking={b} onUpdate={handleUpdate} />)
          )}
        </div>
      )}
    </div>
  )
}
