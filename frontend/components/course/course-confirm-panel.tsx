'use client'

import { CheckCircle } from 'lucide-react'

interface ScheduleDay {
  label: string
  time: string
  desc: string
}

interface CourseConfirmPanelProps {
  courseDays: string[]
  schedule: ScheduleDay[]
  price: string
  notes: string
  submitting: boolean
  formatDateFull: (dateStr: string) => string
  onNotesChange: (v: string) => void
  onSubmit: () => void
}

export function CourseConfirmPanel({
  courseDays,
  schedule,
  price,
  notes,
  submitting,
  formatDateFull,
  onNotesChange,
  onSubmit,
}: CourseConfirmPanelProps) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6">
      <h3 className="font-medium mb-4 flex items-center gap-2">
        <CheckCircle className="w-5 h-5 text-green-500" />
        Confirmar reserva
      </h3>

      <div className="space-y-2 text-sm mb-4">
        {courseDays.map((d, i) => (
          <div key={d} className="flex items-center gap-2 text-neutral-600">
            <span className="text-xs font-medium text-plum bg-lavender/10 px-2 py-0.5 rounded">
              Día {i + 1}
            </span>
            <span className="capitalize">{formatDateFull(d)}</span>
            <span className="text-neutral-500">{schedule[i]?.time}</span>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <label htmlFor="notes" className="text-sm text-neutral-500 mb-1 block">
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

      <button
        onClick={onSubmit}
        disabled={submitting}
        className="w-full bg-plum hover:bg-plum-hover text-white font-semibold py-3 rounded-full transition-colors disabled:opacity-60 shadow-sm hover:shadow-md"
      >
        {submitting ? 'Reservando...' : 'Confirmar reserva del curso'}
      </button>

      <p className="text-xs text-neutral-500 text-center mt-3">
        El pago de {price} se realiza en el salón
      </p>
    </div>
  )
}
