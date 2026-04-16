'use client'

import { X } from 'lucide-react'
import { AgendaBookingCard } from '@/components/admin/agenda-booking-card'
import { DayTimeline, toMin } from '@/components/admin/day-timeline'

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

interface AgendaDayPanelProps {
  showPending: boolean
  setShowPending: (v: boolean) => void
  allPendingBookings: Booking[]
  selectedDayLabel: string
  selectedDayBookings: Booking[]
  onUpdate: (id: string, patch: Partial<Booking>) => void
}

export function AgendaDayPanel({
  showPending,
  setShowPending,
  allPendingBookings,
  selectedDayLabel,
  selectedDayBookings,
  onUpdate,
}: AgendaDayPanelProps) {
  if (showPending) {
    return (
      <div className="bg-gold-light/40 dark:bg-card rounded-2xl border border-gold/20 dark:border-gold/10 p-3">
        {/* Pending header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold/60 shrink-0" />
            <p className="text-sm font-semibold text-gold dark:text-gold">Sin confirmar</p>
            {allPendingBookings.length > 0 && (
              <span className="text-[10px] font-semibold bg-gold text-white rounded-full px-1.5 py-0.5 leading-none">
                {allPendingBookings.length}
              </span>
            )}
          </div>
          <button
            onClick={() => setShowPending(false)}
            className="p-1.5 rounded-lg text-gold/50 hover:text-gold hover:bg-gold/10 dark:hover:bg-gold/10 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        {allPendingBookings.length === 0 ? (
          <div className="bg-white/60 dark:bg-white/4 rounded-xl p-8 text-center">
            <p className="text-sm text-neutral-400">Sin pendientes</p>
          </div>
        ) : (
          <div className="space-y-2">
            {allPendingBookings.map((b) => (
              <div key={b._id}>
                <p className="text-[10px] uppercase tracking-widest text-gold/60 dark:text-gold/50 mb-1 px-1 capitalize">
                  {new Date(b.date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
                </p>
                <AgendaBookingCard booking={b} onUpdate={onUpdate} />
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 capitalize">{selectedDayLabel}</p>
        <span className="text-xs text-neutral-400">{selectedDayBookings.length} {selectedDayBookings.length === 1 ? 'cita' : 'citas'}</span>
      </div>

      {selectedDayBookings.length === 0 ? (
        <div className="bg-white dark:bg-card shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-2xl border border-dashed border-black/[0.04] dark:border-white/10 py-6 text-center">
          <p className="text-sm text-neutral-400">Dia libre</p>
        </div>
      ) : (
        <>
          <DayTimeline bookings={selectedDayBookings} />
          <div className="space-y-1">
            {selectedDayBookings.map((b, i) => {
              const next = selectedDayBookings[i + 1]
              const gapMins = next ? toMin(next.startTime) - toMin(b.endTime) : 0
              return (
                <div key={b._id}>
                  <AgendaBookingCard booking={b} onUpdate={onUpdate} />
                  {gapMins > 0 && (
                    <div className="flex items-center gap-2 px-1 py-2">
                      <div className="flex-1 border-t border-dashed border-neutral-200 dark:border-white/8" />
                      <span className="text-[11px] text-neutral-400 font-medium whitespace-nowrap">
                        {b.endTime} → {next.startTime} · {gapMins}min libre
                      </span>
                      <div className="flex-1 border-t border-dashed border-neutral-200 dark:border-white/8" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}
    </>
  )
}
