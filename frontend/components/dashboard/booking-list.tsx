'use client'

import { useState, useEffect } from 'react'
import { BookingCard } from './booking-card'
import { Calendar, Plus, GraduationCap, X, ChevronRight } from 'lucide-react'
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

const COURSE_STATUS_BAR: Record<string, string> = {
  confirmada: 'bg-emerald-400',
  pendiente:  'bg-amber-400',
  cancelada:  'bg-red-400',
}
const COURSE_STATUS_BADGE: Record<string, string> = {
  confirmada: 'bg-emerald-50 text-emerald-700',
  pendiente:  'bg-amber-50 text-amber-700',
  cancelada:  'bg-red-50 text-red-600',
}
const COURSE_STATUS_LABEL: Record<string, string> = {
  confirmada: 'Confirmada',
  pendiente:  'Pendiente',
  cancelada:  'Cancelada',
}

function CourseBookingCard({ booking, onCancel }: { booking: CourseBookingData; onCancel: (id: string) => void }) {
  const [cancelling, setCancelling] = useState(false)
  const fmt = (d: string) =>
    new Date(d + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
  const isFuture = new Date(booking.days[booking.days.length - 1] + 'T23:59:59') >= new Date()
  const canCancel = isFuture && (booking.status === 'confirmada' || booking.status === 'pendiente')

  const handleCancel = async () => {
    if (!confirm('¿Cancelar la reserva del curso?')) return
    setCancelling(true)
    try {
      const res = await fetch(`/api/course-bookings/${booking._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelada' }),
      })
      if (!res.ok) { toast.error('Error al cancelar'); return }
      toast.success('Reserva de curso cancelada')
      onCancel(booking._id)
    } catch { toast.error('Error de conexión') } finally { setCancelling(false) }
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100">
      <div className={`h-[3px] w-full ${COURSE_STATUS_BAR[booking.status] || 'bg-neutral-200'}`} />
      <div className="p-4 sm:p-5 flex gap-4">
        {/* Icon block */}
        <div className="shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-lavender/10 border border-lavender/20">
          <GraduationCap className="w-6 h-6 text-plum" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">Curso</span>
              <h3 className="font-semibold text-neutral-900 text-sm leading-tight">MANIC 0.0</h3>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${COURSE_STATUS_BADGE[booking.status] || COURSE_STATUS_BADGE.pendiente}`}>
                {COURSE_STATUS_LABEL[booking.status] || booking.status}
              </span>
              {canCancel && (
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  aria-label="Cancelar reserva"
                  className="text-neutral-300 hover:text-red-400 transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-0.5">
            {booking.days.map((d, i) => (
              <p key={i} className="text-xs text-neutral-500 capitalize">
                Día {i + 1}: {fmt(d)}
              </p>
            ))}
          </div>
          <p className="text-xs font-medium text-neutral-600 mt-1.5">800€ · Pago en local</p>
        </div>
      </div>
    </div>
  )
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
      if (r1.ok) setBookings(await r1.json())
      if (r2.ok) setCourseBookings(await r2.json())
    } catch {
      toast.error('Error al cargar reservas')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = (id: string) => {
    setBookings((prev) => prev.map((b) => b._id === id ? { ...b, status: 'cancelada' } : b))
  }
  const handleCourseCancel = (id: string) => {
    setCourseBookings((prev) => prev.map((b) => b._id === id ? { ...b, status: 'cancelada' } : b))
  }

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
        <p className="text-sm text-neutral-500 mb-6 max-w-[220px]">
          Reserva tu primera cita y aparecerá aquí
        </p>
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
      {/* Nueva cita CTA */}
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

      {/* Course bookings */}
      {courseBookings.length > 0 && (
        <div>
          <SectionHeader label="Cursos" count={courseBookings.length} />
          <div className="space-y-3">
            {courseBookings.map((cb) => (
              <CourseBookingCard key={cb._id} booking={cb} onCancel={handleCourseCancel} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div>
          <SectionHeader label="Próximas" count={upcoming.length} />
          <div className="space-y-3">
            {upcoming.map((b) => <BookingCard key={b._id} booking={b} onCancel={handleCancel} />)}
          </div>
        </div>
      )}

      {/* History */}
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
