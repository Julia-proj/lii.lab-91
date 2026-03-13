'use client'

import { Calendar, Clock, Euro, X } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'

interface BookingData {
  _id: string
  service: { name: string; price: number; duration: number; category: string }
  date: string
  startTime: string
  endTime: string
  status: string
  notes?: string
}

interface BookingCardProps {
  booking: BookingData
  onCancel: (id: string) => void
}

export function BookingCard({ booking, onCancel }: BookingCardProps) {
  const [cancelling, setCancelling] = useState(false)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  }

  const statusColors: Record<string, string> = {
    confirmada: 'bg-green-50 text-green-700 border-green-200',
    pendiente: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    cancelada: 'bg-red-50 text-red-700 border-red-200',
    completada: 'bg-neutral-50 text-neutral-700 border-neutral-200',
  }

  const statusLabel: Record<string, string> = {
    confirmada: 'Confirmada',
    pendiente: 'Pendiente',
    cancelada: 'Cancelada',
    completada: 'Completada',
  }

  const isPast = new Date(booking.date + 'T' + booking.endTime) < new Date()
  const canCancel =
    !isPast &&
    (booking.status === 'confirmada' || booking.status === 'pendiente')

  const handleCancel = async () => {
    if (!confirm('¿Estás segura de que deseas cancelar esta cita?')) return

    setCancelling(true)
    try {
      const res = await fetch(`/api/bookings/${booking._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelada' }),
      })

      if (!res.ok) {
        toast.error('Error al cancelar la cita')
        return
      }

      toast.success('Cita cancelada')
      onCancel(booking._id)
    } catch {
      toast.error('Error de conexión')
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-medium">{booking.service.name}</h3>
            <span
              className={`text-xs px-2 py-0.5 rounded-full border ${
                statusColors[booking.status] || statusColors.pendiente
              }`}
            >
              {statusLabel[booking.status] || booking.status}
            </span>
          </div>

          <div className="space-y-1.5 text-sm text-neutral-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#CDB4DB]" />
              <span className="capitalize">{formatDate(booking.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#CDB4DB]" />
              <span>
                {booking.startTime} - {booking.endTime}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Euro className="w-3.5 h-3.5 text-[#CDB4DB]" />
              <span>{booking.service.price}€</span>
            </div>
          </div>
        </div>

        {canCancel && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="text-neutral-500 hover:text-red-500 transition-colors p-1"
            title="Cancelar cita"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )
}
