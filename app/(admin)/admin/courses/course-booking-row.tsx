'use client'

import { GraduationCap, Calendar, User, Check, X, Clock } from 'lucide-react'

interface CourseBooking {
  _id: string
  courseType: 'manic-0.0' | 'perfeccionamiento'
  startDate: string
  days: string[]
  status: 'pendiente' | 'confirmada' | 'cancelada'
  notes?: string
  createdAt: string
  user: { name: string; email: string; phone?: string }
}

const COURSE_LABELS: Record<string, { label: string; price: string; color: string; bg: string }> = {
  'manic-0.0':        { label: 'MANIC 0.0',         price: '749,99€', color: 'text-plum',     bg: 'bg-plum/10' },
  'perfeccionamiento': { label: 'Perfeccionamiento', price: '349,99€', color: 'text-rose-600', bg: 'bg-rose-50' },
}
const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  confirmada: { label: 'Confirmada', cls: 'bg-emerald-50 text-emerald-700' },
  pendiente:  { label: 'Pendiente',  cls: 'bg-amber-50 text-amber-700' },
  cancelada:  { label: 'Cancelada',  cls: 'bg-neutral-100 text-neutral-500' },
}

const fmt = (d: string) =>
  new Date(d + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })

interface CourseBookingRowProps {
  booking: CourseBooking
  onUpdateStatus: (id: string, status: string) => void
}

export function CourseBookingRow({ booking, onUpdateStatus }: CourseBookingRowProps) {
  const info = COURSE_LABELS[booking.courseType]
  const statusInfo = STATUS_MAP[booking.status]

  return (
    <div className="px-5 py-4">
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg ${info.bg} flex items-center justify-center shrink-0 mt-0.5`}>
          <GraduationCap className={`w-4 h-4 ${info.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">{booking.user?.name || '—'}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusInfo.cls}`}>{statusInfo.label}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${info.bg} ${info.color}`}>{info.label}</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs text-neutral-400">
            <User className="w-3 h-3" />
            <span>{booking.user?.email}</span>
            {booking.user?.phone && <><span>·</span><span>{booking.user.phone}</span></>}
          </div>
          <div className="flex items-start gap-1 mt-1 text-xs text-neutral-500">
            <Calendar className="w-3 h-3 shrink-0 mt-0.5" />
            <span>{booking.days.map(fmt).join(' · ')}</span>
          </div>
          {booking.notes && (
            <p className="text-xs text-neutral-400 mt-1 italic">&ldquo;{booking.notes}&rdquo;</p>
          )}
          <div className="flex items-center gap-1 mt-1 text-[11px] text-neutral-300">
            <Clock className="w-3 h-3" />
            Registrado {new Date(booking.createdAt).toLocaleDateString('es-ES')}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className={`text-sm font-bold ${info.color}`}>{info.price}</p>
          {booking.status === 'pendiente' && (
            <div className="flex gap-1 mt-2">
              <button
                onClick={() => onUpdateStatus(booking._id, 'confirmada')}
                className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onUpdateStatus(booking._id, 'cancelada')}
                className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
