'use client'

import { useState, useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import { AgendaStatsRow } from '@/components/admin/agenda-stats-row'
import { AgendaMonthCalendar } from '@/components/admin/agenda-month-calendar'
import { AgendaDayPanel } from '@/components/admin/agenda-day-panel'

interface Booking {
  _id: string
  user: { name: string; email?: string; phone?: string }
  services: { name: string; price: number; duration?: number; _id?: string }[]
  date: string
  startTime: string
  endTime: string
  status: string
  paidAmount?: number
  notes?: string
  adminNotes?: string
}

export default function AgendaPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<string>(() => new Date().toISOString().split('T')[0])
  const [stats, setStats] = useState({ todayCount: 0, pendingCount: 0, monthRevenue: 0 })
  const [showPending, setShowPending] = useState(false)

  const load = async () => {
    try {
      const [bRes, sRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/admin/stats'),
      ])
      const bJson = bRes.ok ? await bRes.json() : {}
      const sJson = sRes.ok ? await sRes.json() : {}
      const all: Booking[] = Array.isArray(bJson.data) ? bJson.data : []
      setBookings(all)
      setStats({
        todayCount:   sJson.data?.stats?.bookingsToday    ?? 0,
        pendingCount: all.filter((b) => b.status === 'pendiente').length,
        monthRevenue: sJson.data?.stats?.incomeThisMonth  ?? 0,
      })
    } catch { toast.error('Error al cargar') } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    setStats((prev) => ({ ...prev, pendingCount: bookings.filter((b) => b.status === 'pendiente').length }))
  }, [bookings])

  const handleUpdate = (id: string, patch: Partial<Booking>) => {
    setBookings((prev) => prev.map((b) => b._id === id ? { ...b, ...patch } : b))
  }

  const bookingsByDay = useMemo(() => {
    const map = new Map<string, Booking[]>()
    for (const b of bookings) {
      if (!map.has(b.date)) map.set(b.date, [])
      map.get(b.date)!.push(b)
    }
    return map
  }, [bookings])

  const selectedDayBookings = useMemo(() => {
    return (bookingsByDay.get(selectedDay) || [])
      .filter((b) => b.status !== 'cancelada')
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
  }, [selectedDay, bookingsByDay])

  const selectedDayLabel = useMemo(() => {
    return new Date(selectedDay + 'T00:00:00').toLocaleDateString('es-ES', {
      weekday: 'long', day: 'numeric', month: 'long',
    })
  }, [selectedDay])

  const todayStr = new Date().toISOString().split('T')[0]
  const todayPrevistos = useMemo(() => {
    return bookings
      .filter((b) => b.date === todayStr && b.status !== 'cancelada')
      .reduce((sum, b) => sum + (b.services || []).reduce((s, sv) => s + sv.price, 0), 0)
  }, [bookings, todayStr])

  const allPendingBookings = useMemo(() => {
    return bookings
      .filter((b) => b.status === 'pendiente')
      .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
  }, [bookings])

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-5 h-5 border-2 border-neutral-200 border-t-plum rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-5">
      <AgendaStatsRow
        todayCount={stats.todayCount}
        pendingCount={stats.pendingCount}
        todayPrevistos={todayPrevistos}
        showPending={showPending}
        onTogglePending={() => setShowPending((v) => !v)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 sm:gap-5 items-start">
        <AgendaMonthCalendar
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          bookingsByDay={bookingsByDay}
          onDayClick={() => setShowPending(false)}
        />

        <div className="space-y-3 order-1 lg:order-2">
          <AgendaDayPanel
            showPending={showPending}
            setShowPending={setShowPending}
            allPendingBookings={allPendingBookings}
            selectedDayLabel={selectedDayLabel}
            selectedDayBookings={selectedDayBookings}
            onUpdate={handleUpdate}
          />
        </div>
      </div>
    </div>
  )
}
