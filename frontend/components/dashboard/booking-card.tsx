'use client'

import { Clock, Euro } from 'lucide-react'
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

const statusBarColor: Record<string, string> = {
  confirmada: 'bg-emerald-400',
  pendiente:  'bg-amber-400',
  cancelada:  'bg-red-400',
  completada: 'bg-neutral-200',
}
const statusBadge: Record<string, string> = {
  confirmada: 'bg-emerald-50 text-emerald-700',
  pendiente:  'bg-amber-50 text-amber-700',
  cancelada:  'bg-red-50 text-red-600',
  completada: 'bg-neutral-100 text-neutral-500',
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

  const date = new Date(booking.date + 'T00:00:00')
  const dayNum  = date.getDate()
  const month   = date.toLocaleDateString('es-ES', { month: 'short' })
  const weekday = date.toLocaleDateString('es-ES', { weekday: 'long' })

  const services   = booking.services || []
  const totalPrice = services.reduce((s, sv) => s + sv.price, 0)
  const isPast     = new Date(booking.date + 'T' + booking.endTime) < new Date()
  const canCancel  = !isPast && (booking.status === 'confirmada' || booking.status === 'pendiente')

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
    <div className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100 ${isPast ? 'opacity-60' : ''}`}>
      {/* Status accent bar */}
      <div className={`h-[3px] w-full ${statusBarColor[booking.status] || 'bg-neutral-200'}`} />

      <div className="p-4 sm:p-5 flex gap-4">
        {/* Date block */}
        <div className="shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-neutral-50 border border-neutral-100">
          <span className="text-xl font-bold text-neutral-900 leading-none">{dayNum}</span>
          <span className="text-xs uppercase tracking-wider text-neutral-500 mt-0.5 capitalize">{month}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-semibold text-neutral-900 text-sm leading-tight">
              {services.length === 1
                ? services[0].name
                : services.map((s) => s.name).join(' + ')}
            </h3>
            <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge[booking.status] || statusBadge.pendiente}`}>
              {statusLabel[booking.status] || booking.status}
            </span>
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-500">
            <span className="flex items-center gap-1 capitalize">
              <Clock className="w-3 h-3" />
              {weekday} · {booking.startTime}–{booking.endTime}
            </span>
            <span className="flex items-center gap-1 font-medium text-neutral-600">
              <Euro className="w-3 h-3" />
              {totalPrice}€
            </span>
          </div>

          {services.length > 1 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {services.map((s, i) => (
                <span key={i} className="text-xs text-neutral-500 bg-neutral-50 px-2 py-0.5 rounded-md border border-neutral-100">
                  {s.name} · {s.price}€
                </span>
              ))}
            </div>
          )}

          {booking.notes && (
            <p className="mt-2 text-xs text-neutral-500 italic border-l-2 border-neutral-100 pl-2">{booking.notes}</p>
          )}
        </div>
      </div>

      {/* Cancel section */}
      {canCancel && (
        <div className="border-t border-neutral-100 px-4 sm:px-5 py-3">
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
                className="text-xs text-neutral-500 hover:text-neutral-600 px-2 py-1.5 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Volver
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirm(true)}
              className="text-xs text-neutral-500 hover:text-red-500 transition-colors font-medium"
            >
              Cancelar cita
            </button>
          )}
        </div>
      )}
    </div>
  )
}
