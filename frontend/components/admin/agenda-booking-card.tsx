'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { PayCell } from '@/components/admin/pay-cell'
import { BookingReschedulePanel } from '@/components/admin/booking-reschedule-panel'
import { BookingNotesPanel } from '@/components/admin/booking-notes-panel'
import { BookingActionsBar } from '@/components/admin/booking-actions-bar'
import { useBookingActions } from '@/hooks/use-booking-actions'

interface Booking {
  _id: string
  user: { name: string; email?: string; phone?: string }
  services: { name: string; price: number; duration?: number; _id?: string }[]
  date: string
  startTime: string
  endTime: string
  status: string
  paidAmount?: number
  notes?: string
  adminNotes?: string
}

const S_BORDER: Record<string, string> = {
  pendiente:  'border-l-[#D1BFA5] dark:border-l-[#9A8772]',
  confirmada: 'border-l-plum/60',
  completada: 'border-l-emerald-500/20',
  cancelada:  'border-l-neutral-200 dark:border-l-white/5',
}

export function AgendaBookingCard({ booking, onUpdate }: { booking: Booking; onUpdate: (id: string, patch: Partial<Booking>) => void }) {
  const [expanded, setExpanded] = useState(false)
  const actions = useBookingActions({
    id: booking._id, date: booking.date, services: booking.services, adminNotes: booking.adminNotes,
    onUpdate: onUpdate as (id: string, patch: Record<string, unknown>) => void,
  })

  const totalPrice = (booking.services || []).reduce((s, sv) => s + sv.price, 0)
  const svcNames = (booking.services || []).map((s) => s.name).join(', ')
  const isPending = booking.status === 'pendiente'
  const isActive = booking.status !== 'cancelada' && booking.status !== 'completada'

  const pendingClass = 'bg-[#FDFBF9] dark:bg-[#1A1918] border border-[#EBE6E0] dark:border-[#2B2927] border-l-[3px] border-l-[#D1BFA5] dark:border-l-[#9A8772] shadow-[0_4px_16px_rgba(209,191,165,0.06)]'
  const defaultClass = `bg-[#FFFFFF] dark:bg-[#121214] shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-black/[0.04] dark:border-white/5 border-l-[3px] ${S_BORDER[booking.status] || 'border-l-neutral-200'}`

  return (
    <div className={`overflow-hidden rounded-2xl transition-all duration-300 ${isPending ? pendingClass : defaultClass} ${booking.status === 'cancelada' ? 'opacity-50 grayscale hover:opacity-100 hover:grayscale-0' : ''} ${booking.status === 'completada' ? 'bg-background dark:bg-[#0D0D0F]' : ''}`}>
      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{booking.user?.name || '—'}</p>
            <p className="text-xs text-neutral-400 mt-0.5">{booking.startTime}–{booking.endTime} · {svcNames}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] text-neutral-300 mb-0.5">{totalPrice}€</p>
            {!isPending && <PayCell booking={booking} onUpdate={onUpdate} />}
          </div>
        </div>
        {isPending && (
          <div className="flex gap-2 mt-3">
            <button onClick={() => actions.handleStatus('confirmada')} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-plum hover:bg-plum-hover text-white transition-all hover:shadow-md text-xs font-semibold rounded-lg">
              <Check className="w-3.5 h-3.5" /> Confirmar
            </button>
            <button onClick={() => actions.handleStatus('cancelada')} aria-label="Cancelar cita" className="flex items-center justify-center px-3 py-2 border border-neutral-200 dark:border-white/10 text-neutral-400 hover:text-red-500 hover:border-red-200 text-xs rounded-lg transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        <button onClick={() => setExpanded(!expanded)} className="mt-1 -mx-4 px-4 py-2 w-full text-left text-[11px] text-neutral-400 hover:text-plum transition-colors">
          {expanded ? '▴ menos' : '▾ más opciones'}
        </button>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-neutral-50 dark:border-white/5 pt-3 space-y-3">
          {booking.notes && (
            <div className="bg-[#F8F7F9] dark:bg-[#1C1A1E] p-3 rounded-lg border border-[#EAE8EF] dark:border-[#2E2B33]">
              <p className="text-xs font-semibold text-[#766A80] dark:text-[#A79BB3] mb-1">Nota del cliente:</p>
              <p className="text-sm text-[#5B5066] dark:text-[#C7BCDB] whitespace-pre-wrap">{booking.notes}</p>
            </div>
          )}

          <BookingActionsBar
            status={booking.status} rescheduleOpen={actions.rescheduleOpen}
            notesOpen={actions.notesOpen} hasNotes={!!actions.adminNotesVal}
            showReschedule={isActive} totalPrice={totalPrice}
            onStatusChange={actions.handleStatus}
            onCompleteWithAmount={actions.handleCompleteWithAmount}
            onToggleReschedule={() => { const open = !actions.rescheduleOpen; actions.setRescheduleOpen(open); if (open) { actions.setRescheduleDate(booking.date); actions.fetchSlots(booking.date) } }}
            onToggleNotes={() => actions.setNotesOpen(!actions.notesOpen)}
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
