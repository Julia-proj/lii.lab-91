'use client'

import { useState, useEffect } from 'react'
import { BookingCard } from './booking-card'
import { CourseBookingCard } from './course-booking-card'
import { Calendar, Plus, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface BookingData {
  _id: string
  services: { name: string; price: number; duration: number; category: string }[]
  quantities?: Record<string, string | number>
  date: string
  startTime: string
  endTime: string
  status: string
  notes?: string
}

interface CourseBookingData {
  _id: string
  startDate: string
  days: string[]
  status: string
  notes?: string
}

function SectionHeader({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">{label}</span>
      <span className="text-xs font-medium text-neutral-300 bg-neutral-100 px-1.5 py-0.5 rounded-full leading-none">{count}</span>
    </div>
  )
}

export function BookingList() {
  const [bookings, setBookings]             = useState<BookingData[]>([])
  const [courseBookings, setCourseBookings] = useState<CourseBookingData[]>([])
  const [loading, setLoading]               = useState(true)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const [r1, r2] = await Promise.all([fetch('/api/bookings'), fetch('/api/course-bookings')])
      if (r1.ok) { const j1 = await r1.json(); setBookings(j1.data ?? []) }
      if (r2.ok) { const j2 = await r2.json(); setCourseBookings(j2.data ?? []) }
    } catch {
      toast.error('Error al cargar reservas')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = (id: string) =>
    setBookings((prev) => prev.map((b) => b._id === id ? { ...b, status: 'cancelada' } : b))

  const handleCourseCancel = (id: string) =>
    setCourseBookings((prev) => prev.map((b) => b._id === id ? { ...b, status: 'cancelada' } : b))

  const upcoming = bookings.filter(
    (b) => new Date(b.date + 'T' + b.endTime) >= new Date() && b.status !== 'completada'
  )
  const past = bookings.filter(
    (b) => b.status === 'completada' || new Date(b.date + 'T' + b.endTime) < new Date()
  )
  const totalItems = bookings.length + courseBookings.length

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="w-6 h-6 border-2 border-neutral-200 border-t-plum rounded-full animate-spin mx-auto" />
        <p className="text-sm text-neutral-500 mt-3">Cargando reservas...</p>
      </div>
    )
  }

  if (totalItems === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mb-4">
          <Calendar className="w-7 h-7 text-neutral-300" />
        </div>
        <h3 className="font-serif text-lg text-neutral-800 mb-1">Sin reservas todavía</h3>
        <p className="text-sm text-neutral-500 mb-6 max-w-[220px]">Reserva tu primera cita y aparecerá aquí</p>
        <Link
          href="/booking"
          className="inline-flex items-center gap-2 bg-plum text-white font-medium py-3 px-6 rounded-2xl transition-colors hover:bg-plum-hover text-sm"
        >
          <Plus className="w-4 h-4" />
          Reservar cita
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link
        href="/booking"
        className="flex items-center justify-between w-full bg-plum text-white rounded-2xl px-5 py-4 hover:bg-plum-hover transition-colors"
      >
        <div className="flex items-center gap-3">
          <Plus className="w-5 h-5" />
          <span className="font-medium text-sm">Nueva cita</span>
        </div>
        <ChevronRight className="w-4 h-4 opacity-60" />
      </Link>

      {courseBookings.length > 0 && (
        <div>
          <SectionHeader label="Cursos" count={courseBookings.length} />
          <div className="space-y-3">
            {courseBookings.map((cb) => <CourseBookingCard key={cb._id} booking={cb} onCancel={handleCourseCancel} />)}
          </div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div>
          <SectionHeader label="Próximas" count={upcoming.length} />
          <div className="space-y-3">
            {upcoming.map((b) => <BookingCard key={b._id} booking={b} onCancel={handleCancel} />)}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <SectionHeader label="Historial" count={past.length} />
          <div className="space-y-3">
            {past.map((b) => <BookingCard key={b._id} booking={b} onCancel={handleCancel} />)}
          </div>
        </div>
      )}
    </div>
  )
}
