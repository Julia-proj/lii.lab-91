'use client'

import { useState, useEffect } from 'react'
import { BookingCard } from './booking-card'
import { Calendar, Plus } from 'lucide-react'
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

export function BookingList() {
  const [bookings, setBookings] = useState<BookingData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setBookings(data)
    } catch {
      toast.error('Error al cargar reservas')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = (id: string) => {
    // Update local state immediately for instant UI feedback
    setBookings((prev) =>
      prev.map((b) => (b._id === id ? { ...b, status: 'cancelada' } : b))
    )
    // Re-fetch from server to ensure consistency
    fetchBookings()
  }

  // Próximas citas: todas las que aún no pasaron (incluidas canceladas para que el usuario vea el cambio de estado)
  const upcoming = bookings.filter(
    (b) =>
      new Date(b.date + 'T' + b.endTime) >= new Date() &&
      b.status !== 'completada'
  )
  // Historial: ya pasadas o completadas
  const past = bookings.filter(
    (b) =>
      b.status === 'completada' ||
      new Date(b.date + 'T' + b.endTime) < new Date()
  )

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-6 h-6 border-2 border-neutral-200 border-t-[#CDB4DB] rounded-full animate-spin mx-auto" />
        <p className="text-sm text-neutral-400 mt-2">Cargando reservas...</p>
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
        <h3 className="font-medium text-neutral-700 mb-1">No tienes reservas</h3>
        <p className="text-sm text-neutral-400 mb-4">
          Reserva tu primera cita en Lii.lab
        </p>
        <Link
          href="/booking"
          className="inline-flex items-center gap-2 bg-[#CDB4DB] hover:bg-[#bda0cb] text-white font-medium py-2.5 px-6 rounded-full transition-colors text-sm"
        >
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
        <Link
          href="/booking"
          className="inline-flex items-center gap-1.5 bg-[#CDB4DB] hover:bg-[#bda0cb] text-white text-sm font-medium py-2 px-4 rounded-full transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva cita
        </Link>
      </div>

      {upcoming.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-neutral-500 mb-3">Próximas citas</h3>
          <div className="space-y-3">
            {upcoming.map((booking) => (
              <BookingCard key={booking._id} booking={booking} onCancel={handleCancel} />
            ))}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-neutral-500 mb-3">Historial</h3>
          <div className="space-y-3">
            {past.map((booking) => (
              <BookingCard key={booking._id} booking={booking} onCancel={handleCancel} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
