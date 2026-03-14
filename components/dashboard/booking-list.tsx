'use client'

import { useState, useEffect } from 'react'
import { BookingCard } from './booking-card'
import { Calendar, Plus, X } from 'lucide-react'
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

const STATUS_COLORS: Record<string, string> = {
  confirmada: 'bg-green-50 text-green-700 border-green-200',
  pendiente: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  cancelada: 'bg-red-50 text-red-700 border-red-200',
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
    <div className="bg-white rounded-xl border border-[#CDB4DB]/30 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wide bg-[#CDB4DB]/20 text-[#7B4FAC] px-2 py-0.5 rounded-full">Curso</span>
            <h3 className="font-medium">MANIC 0.0</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS[booking.status] || STATUS_COLORS.pendiente}`}>
              {booking.status}
            </span>
          </div>
          <div className="space-y-1 text-sm text-neutral-500">
            {booking.days.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#CDB4DB] shrink-0" />
                <span className="capitalize">Día {i + 1}: {fmt(d)}</span>
              </div>
            ))}
          </div>
          <p className="text-sm font-medium text-neutral-700 mt-2">800€ · Pago en local</p>
        </div>
        {canCancel && (
          <button onClick={handleCancel} disabled={cancelling} className="text-neutral-400 hover:text-red-500 transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )
}

export function BookingList() {
  const [bookings, setBookings] = useState<BookingData[]>([])
  const [courseBookings, setCourseBookings] = useState<CourseBookingData[]>([])
  const [loading, setLoading] = useState(true)

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
    setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status: 'cancelada' } : b)))
  }

  const handleCourseCancel = (id: string) => {
    setCourseBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status: 'cancelada' } : b)))
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
      <div className="text-center py-12">
        <div className="w-6 h-6 border-2 border-neutral-200 border-t-[#CDB4DB] rounded-full animate-spin mx-auto" />
        <p className="text-sm text-neutral-400 mt-2">Cargando reservas...</p>
      </div>
    )
  }

  if (totalItems === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
        <h3 className="font-medium text-neutral-700 mb-1">No tienes reservas</h3>
        <p className="text-sm text-neutral-400 mb-4">Reserva tu primera cita en Lii.lab</p>
        <Link href="/booking" className="inline-flex items-center gap-2 bg-[#CDB4DB] hover:bg-[#bda0cb] text-white font-medium py-2.5 px-6 rounded-full transition-colors text-sm">
          <Plus className="w-4 h-4" />
          Reservar cita
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-lg">Mis reservas</h2>
        <Link href="/booking" className="inline-flex items-center gap-1.5 bg-[#CDB4DB] hover:bg-[#bda0cb] text-white text-sm font-medium py-2 px-4 rounded-full transition-colors">
          <Plus className="w-4 h-4" />
          Nueva cita
        </Link>
      </div>

      {courseBookings.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-neutral-500 mb-3">Cursos</h3>
          <div className="space-y-3">
            {courseBookings.map((cb) => (
              <CourseBookingCard key={cb._id} booking={cb} onCancel={handleCourseCancel} />
            ))}
          </div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-neutral-500 mb-3">Próximas citas</h3>
          <div className="space-y-3">
            {upcoming.map((b) => <BookingCard key={b._id} booking={b} onCancel={handleCancel} />)}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-neutral-500 mb-3">Historial</h3>
          <div className="space-y-3">
            {past.map((b) => <BookingCard key={b._id} booking={b} onCancel={handleCancel} />)}
          </div>
        </div>
      )}
    </div>
  )
}
