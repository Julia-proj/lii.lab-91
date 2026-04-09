'use client'

import { Calendar, Clock, Euro, FileText } from 'lucide-react'
import { formatDuration } from '@/lib/format'
import type { IService } from '@/types'

interface BookingSummaryProps {
  services: IService[]
  quantities: Record<string, number>
  date: string
  timeSlot: string
  totalDuration: number
  totalPrice: number
  notes: string
  onNotesChange: (value: string) => void
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function computeEndTime(start: string, durationMin: number) {
  const [h, m] = start.split(':').map(Number)
  const total = h * 60 + m + durationMin
  return `${Math.floor(total / 60).toString().padStart(2, '0')}:${(total % 60).toString().padStart(2, '0')}`
}

export function BookingSummary({
  services,
  quantities,
  date,
  timeSlot,
  totalDuration,
  totalPrice,
  notes,
  onNotesChange,
}: BookingSummaryProps) {
  return (
    <>
      {services.length === 1 ? (
        <h3 className="font-medium text-lg mb-4">{services[0].name}</h3>
      ) : (
        <div className="mb-4">
          <h3 className="font-medium text-base mb-2">Servicios seleccionados</h3>
          <div className="space-y-1.5">
            {services.map((s) => {
              const qty = quantities[s._id] ?? 1
              return (
                <div key={s._id} className="flex justify-between text-sm">
                  <span className="text-neutral-700">{s.name}{qty > 1 ? ` x${qty}` : ''}</span>
                  <span className="text-neutral-500">{s.price * qty}&euro; &middot; {formatDuration(s.duration * qty)}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-3 text-neutral-600">
          <Calendar className="w-4 h-4 text-lavender shrink-0" />
          <span className="capitalize">{formatDate(date)}</span>
        </div>
        <div className="flex items-center gap-3 text-neutral-600">
          <Clock className="w-4 h-4 text-lavender shrink-0" />
          <span>{timeSlot} - {computeEndTime(timeSlot, totalDuration)} ({formatDuration(totalDuration)})</span>
        </div>
        <div className="flex items-center gap-3 text-neutral-600">
          <Euro className="w-4 h-4 text-lavender shrink-0" />
          <span>{totalPrice}&euro; &middot; Pago en local</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-neutral-100">
        <label htmlFor="notes" className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
          <FileText className="w-4 h-4" />
          Notas (opcional)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-lavender focus:border-transparent"
          rows={2}
          placeholder="Cualquier información adicional..."
        />
      </div>
    </>
  )
}
