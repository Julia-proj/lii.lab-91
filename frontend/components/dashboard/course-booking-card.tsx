'use client'

import { useState } from 'react'
import { GraduationCap, X } from 'lucide-react'
import { toast } from 'sonner'

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

interface CourseBookingCardProps {
  booking: CourseBookingData
  onCancel: (id: string) => void
}

export function CourseBookingCard({ booking, onCancel }: CourseBookingCardProps) {
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
    } catch {
      toast.error('Error de conexión')
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100">
      <div className={`h-[3px] w-full ${COURSE_STATUS_BAR[booking.status] || 'bg-neutral-200'}`} />
      <div className="p-4 sm:p-5 flex gap-4">
        <div className="shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-lavender/10 border border-lavender/20">
          <GraduationCap className="w-6 h-6 text-plum" />
        </div>

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
              <p key={i} className="text-xs text-neutral-500 capitalize">Día {i + 1}: {fmt(d)}</p>
            ))}
          </div>
          <p className="text-xs font-medium text-neutral-600 mt-1.5">800€ · Pago en local</p>
        </div>
      </div>
    </div>
  )
}
