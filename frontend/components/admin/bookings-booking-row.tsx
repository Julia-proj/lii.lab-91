'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import { PayCell } from '@/components/admin/pay-cell'
import { BookingReschedulePanel } from '@/components/admin/booking-reschedule-panel'
import { BookingNotesPanel } from '@/components/admin/booking-notes-panel'
import { BookingActionsBar } from '@/components/admin/booking-actions-bar'
import { useBookingActions } from '@/hooks/use-booking-actions'

interface ServiceData {
  name: string
  category: string
  price: number
  duration: number
  _id?: string
}

interface BookingData {
  _id: string
  services: ServiceData[]
  user: { name: string; email: string; phone: string }
  date: string
  startTime: string
  endTime: string
  status: string
  notes?: string
  paidAmount?: number
  adminNotes?: string
  createdAt: string
}

const STATUS_BORDER: Record<string, string> = {
  confirmada: 'border-l-emerald-400',
  pendiente:  'border-l-gold',
  cancelada:  'border-l-neutral-300 dark:border-l-neutral-700',
  completada: 'border-l-plum',
}

export type { BookingData, ServiceData }

export function BookingsBookingRow({ booking, onUpdate }: { booking: BookingData; onUpdate: (id: string, patch: Partial<BookingData>) => void }) {
  const [expanded, setExpanded] = useState(false)
  const actions = useBookingActions({
    id: booking._id, date: booking.date, services: booking.services, adminNotes: booking.adminNotes,
    onUpdate: onUpdate as (id: string, patch: Record<string, unknown>) => void,
  })

  const totalPrice = (booking.services || []).reduce((s, sv) => s + sv.price, 0)
  const svcNames = (booking.services || []).map((s) => s.name).join(', ')
  const fmtDate = (d: string) =>
    new Date(d + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })

  const handleDelete = async () => {
    if (!confirm('Â¿Eliminar esta reserva?')) return
    try {
      const res = await fetch(`/api/bookings/${booking._id}`, { method: 'DELETE' })
      if (!res.ok) { toast.error('Error al eliminar'); return }
      onUpdate(booking._id, { status: '__deleted__' }); toast.success('Reserva eliminada')
    } catch { toast.error('Error de conexión') }
  }

  const canReschedule = booking.status !== 'cancelada' && booking.status !== 'completada'

  return (
    <div className={`bg-white dark:bg-card rounded-xl border border-neutral-100 dark:border-white/8 border-l-4 overflow-hidden ${STATUS_BORDER[booking.status] || 'border-l-neutral-300'}`}>
      <div role="button" tabIndex={0} onClick={() => setExpanded(!expanded)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setExpanded(!expanded) }}
        className="w-full text-left px-4 py-3 flex items-center gap-3 cursor-pointer">
        <div className="shrink-0 w-[100px]">
          <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 capitalize">{fmtDate(booking.date)}</p>
          <p className="text-[11px] text-neutral-400 font-mono">{booking.startTime}–{booking.endTime}</p>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">{booking.user?.name || '—'}</p>
          <p className="text-xs text-neutral-400 truncate">{svcNames}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[10px] text-neutral-300 mb-0.5">{totalPrice}€</p>
          <PayCell booking={booking} onUpdate={onUpdate} stopPropagation />
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-neutral-300 shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-neutral-50 dark:border-white/5 space-y-3">
          <BookingActionsBar
            status={booking.status} rescheduleOpen={actions.rescheduleOpen}
            notesOpen={actions.notesOpen} hasNotes={!!actions.adminNotesVal}
            showReschedule={canReschedule} showDelete={booking.status === 'cancelada'}
            totalPrice={totalPrice}
            onStatusChange={actions.handleStatus}
            onCompleteWithAmount={actions.handleCompleteWithAmount}
            onToggleReschedule={() => { const open = !actions.rescheduleOpen; actions.setRescheduleOpen(open); if (open) { actions.setRescheduleDate(booking.date); actions.fetchSlots(booking.date) } }}
            onToggleNotes={() => actions.setNotesOpen(!actions.notesOpen)}
            onDelete={handleDelete}
          />
          {actions.rescheduleOpen && (
            <BookingReschedulePanel
              rescheduleDate={actions.rescheduleDate} availableSlots={actions.availableSlots}
              selectedSlot={actions.selectedSlot} fetchingSlots={actions.fetchingSlots} savingReschedule={actions.savingReschedule}
              onDateChange={(d) => { actions.setRescheduleDate(d); actions.fetchSlots(d) }}
              onSlotChange={actions.setSelectedSlot} onSave={actions.handleRescheduleSave} onCancel={() => actions.setRescheduleOpen(false)}
            />
          )}
          {actions.notesOpen && (
            <BookingNotesPanel value={actions.adminNotesVal} dirty={actions.notesDirty} saving={actions.savingNotes}
              onChange={(v) => { actions.setAdminNotesVal(v); actions.setNotesDirty(true) }} onSave={actions.handleNotesSave}
            />
          )}
        </div>
      )}
    </div>
  )
}
