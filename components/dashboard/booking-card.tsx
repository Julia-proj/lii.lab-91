'use client'

import { Calendar, Clock, Euro, X } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'

interface ServiceData {
  name: string
  price: number
  duration: number
  category: string
}

interface BookingData {
  _id: string
  services: ServiceData[]
  quantities?: Record<string, string | number>
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

  const services = booking.services || []
  const totalPrice = services.reduce((sum, s) => sum + s.price, 0)

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
            {services.length === 1 ? (
              <h3 className="font-medium">{services[0].name}</h3>
            ) : (
              <h3 className="font-medium">{services.map((s) => s.name).join(' + ')}</h3>
            )}
            <span
              className={`text-xs px-2 py-0.5 rounded-full border ${
                statusColors[booking.status] || statusColors.pendiente
              }`}
            >
              {statusLabel[booking.status] || booking.status}
            </span>
          </div>

          {services.length > 1 && (
            <div className="mb-2 space-y-0.5">
              {services.map((s, i) => (
                <p key={i} className="text-xs text-neutral-500">
                  {s.name} — {s.price}€
                </p>
              ))}
            </div>
          )}

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
              <span>{totalPrice}€</span>
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
