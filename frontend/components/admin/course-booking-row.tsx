'use client'

import { useState } from 'react'
import { Trash2, ChevronDown, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import { COURSE_STATUS_COLORS } from '@/lib/constants'

export interface CourseBookingData {
  _id: string
  user: { name: string; email: string; phone?: string }
  startDate: string
  days: string[]
  courseType?: string
  status: string
  notes?: string
  createdAt: string
}

export function CourseBookingRow({ booking, onUpdate }: { booking: CourseBookingData; onUpdate: (id: string, patch: Partial<CourseBookingData>) => void }) {
  const [expanded, setExpanded] = useState(false)

  const fmt = (d: string) =>
    new Date(d + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })

  const handleStatusChange = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/course-bookings/${booking._id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) { toast.error('Error al actualizar'); return }
      onUpdate(booking._id, { status: newStatus }); toast.success('Estado actualizado')
    } catch { toast.error('Error de conexión') }
  }

  const handleDelete = async () => {
    if (!confirm('¿Eliminar esta reserva de curso?')) return
    try {
      const res = await fetch(`/api/course-bookings/${booking._id}`, { method: 'DELETE' })
      if (!res.ok) { toast.error('Error al eliminar'); return }
      onUpdate(booking._id, { status: '__deleted__' } as Partial<CourseBookingData>); toast.success('Reserva eliminada')
    } catch { toast.error('Error de conexión') }
  }

  const courseLabel = booking.courseType === 'perfeccionamiento' ? 'Perfeccionamiento' : 'MANIC 0.0'
  const price = booking.courseType === 'perfeccionamiento' ? '349,99€' : '749,99€'

  return (
    <div
      className={`bg-white dark:bg-card rounded-xl border border-neutral-100 dark:border-white/8 border-l-4 overflow-hidden`}
      style={{ borderLeftColor: booking.status === 'confirmada' ? 'rgb(52 211 153)' : booking.status === 'cancelada' ? 'rgb(212 212 212)' : 'rgb(251 191 36)' }}
    >
      <div
        role="button" tabIndex={0}
        onClick={() => setExpanded(!expanded)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setExpanded(!expanded) }}
        className="w-full text-left px-4 py-3 flex items-center gap-3 cursor-pointer"
      >
        <div className="shrink-0 w-[100px]">
          <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 capitalize">{fmt(booking.startDate)}</p>
          <p className="text-[11px] text-neutral-400">{booking.days.length} {booking.days.length === 1 ? 'dia' : 'dias'}</p>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">{booking.user?.name || '—'}</p>
          <p className="text-xs text-neutral-400 truncate">{courseLabel}</p>
        </div>
        <p className="text-xs font-semibold text-neutral-500 shrink-0">{price}</p>
        <ChevronDown className={`w-3.5 h-3.5 text-neutral-300 shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-neutral-50 dark:border-white/5 space-y-3">
          <div className="space-y-1 mb-2">
            {booking.days.map((d, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-neutral-500">
                <Calendar className="w-3 h-3 text-plum shrink-0" />
                <span className="capitalize">Dia {i + 1}: {fmt(d)}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-neutral-400">{booking.user?.email}{booking.user?.phone ? ` · ${booking.user.phone}` : ''}</p>
          {booking.notes && (
            <p className="text-xs text-neutral-400 italic border-l-2 border-neutral-100 pl-2">{booking.notes}</p>
          )}
          <div className="flex flex-wrap gap-2">
            <select value={booking.status} onChange={(e) => handleStatusChange(e.target.value)}
              className="text-xs border border-neutral-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 bg-white dark:bg-secondary dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-plum/40 cursor-pointer">
              <option value="pendiente">Pendiente</option>
              <option value="confirmada">Confirmada</option>
              <option value="cancelada">Cancelada</option>
            </select>
            {booking.status === 'cancelada' && (
              <button onClick={handleDelete} className="ml-auto flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-red-100 hover:bg-red-50 transition-colors">
                <Trash2 className="w-3.5 h-3.5" /> Eliminar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
