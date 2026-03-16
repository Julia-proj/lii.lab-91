'use client'

import { Calendar, Clock, Euro } from 'lucide-react'
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

const statusColors: Record<string, string> = {
  confirmada: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pendiente:  'bg-amber-50 text-amber-700 border-amber-200',
  cancelada:  'bg-red-50 text-red-600 border-red-200',
  completada: 'bg-neutral-50 text-neutral-500 border-neutral-200',
}
const statusLabel: Record<string, string> = {
  confirmada: 'Confirmada',
  pendiente:  'Pendiente',
  cancelada:  'Cancelada',
  completada: 'Completada',
}

export function BookingCard({ booking, onCancel }: BookingCardProps) {
  const [cancelling, setCancelling] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const formatDate = (d: string) =>
    new Date(d + 'T00:00:00').toLocaleDateString('es-ES', {
      weekday: 'long', day: 'numeric', month: 'long',
    })

  const services = booking.services || []
  const totalPrice = services.reduce((s, sv) => s + sv.price, 0)
  const isPast = new Date(booking.date + 'T' + booking.endTime) < new Date()
  const canCancel = !isPast && (booking.status === 'confirmada' || booking.status === 'pendiente')

  const handleCancel = async () => {
    setCancelling(true)
    setShowConfirm(false)
    try {
      const res = await fetch(`/api/bookings/${booking._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelada' }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error || 'Error al cancelar la cita')
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
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="font-semibold text-neutral-900 text-sm leading-tight">
              {services.length === 1
                ? services[0].name
                : services.map((s) => s.name).join(' + ')}
            </h3>
            {services.length > 1 && (
              <div className="mt-1 space-y-0.5">
                {services.map((s, i) => (
                  <p key={i} className="text-xs text-neutral-400">{s.name} — {s.price}€</p>
                ))}
              </div>
            )}
          </div>
          <span className={`shrink-0 text-xs px-2.5 py-1 rounded-full border font-medium ${statusColors[booking.status] || statusColors.pendiente}`}>
            {statusLabel[booking.status] || booking.status}
          </span>
        </div>

        {/* Info rows */}
        <div className="space-y-1.5 text-sm text-neutral-500">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#CDB4DB] shrink-0" />
            <span className="capitalize">{formatDate(booking.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#CDB4DB] shrink-0" />
            <span>{booking.startTime} – {booking.endTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <Euro className="w-3.5 h-3.5 text-[#CDB4DB] shrink-0" />
            <span className="font-medium text-neutral-700">{totalPrice}€</span>
          </div>
        </div>

        {booking.notes && (
          <p className="mt-3 text-xs text-neutral-400 italic border-l-2 border-neutral-100 pl-2">{booking.notes}</p>
        )}
      </div>

      {/* Cancel section */}
      {canCancel && (
        <div className="border-t border-neutral-100 px-5 py-3">
          {showConfirm ? (
            <div className="flex items-center gap-3">
              <p className="text-xs text-neutral-500 flex-1">¿Confirmar cancelación?</p>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
              >
                {cancelling ? 'Cancelando...' : 'Sí, cancelar'}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="text-xs text-neutral-400 hover:text-neutral-600 px-2 py-1.5 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Volver
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirm(true)}
              className="text-xs text-neutral-400 hover:text-red-500 transition-colors font-medium"
            >
              Cancelar cita
            </button>
          )}
        </div>
      )}
    </div>
  )
}
