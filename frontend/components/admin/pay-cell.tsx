'use client'

import { useState } from 'react'
import { Check, Pencil, X } from 'lucide-react'
import { toast } from 'sonner'

export interface PayCellBooking {
  _id: string
  status: string
  paidAmount?: number
}

interface PayCellProps {
  booking: PayCellBooking
  onUpdate: (id: string, patch: Partial<PayCellBooking>) => void
  /** Set to true when PayCell is inside a clickable row to stop click propagation */
  stopPropagation?: boolean
}

export function PayCell({ booking, onUpdate, stopPropagation = false }: PayCellProps) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(String(booking.paidAmount ?? ''))
  const [saving, setSaving] = useState(false)

  const save = async () => {
    const n = parseFloat(val)
    if (isNaN(n) || n < 0) { toast.error('Importe inválido'); return }
    setSaving(true)
    const newStatus =
      booking.status !== 'cancelada' && booking.status !== 'completada'
        ? 'completada'
        : booking.status
    try {
      const res = await fetch(`/api/bookings/${booking._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paidAmount: n, status: newStatus }),
      })
      if (res.ok) {
        setEditing(false)
        onUpdate(booking._id, { paidAmount: n, status: newStatus })
        toast.success('Pago registrado')
      }
    } finally { setSaving(false) }
  }

  if (editing) return (
    <div
      className="flex items-center gap-1"
      onClick={stopPropagation ? (e) => e.stopPropagation() : undefined}
    >
      <input
        type="number" min="0" step="0.01" value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false) }}
        className="w-16 border border-plum rounded-lg px-2 py-1 text-sm text-right focus:outline-none focus:ring-1 focus:ring-plum bg-white dark:bg-secondary dark:text-neutral-200"
        autoFocus disabled={saving}
      />
      <button onClick={save} disabled={saving} className="p-1 rounded bg-emerald-500 text-white hover:bg-emerald-600 transition-colors">
        <Check className="w-3 h-3" />
      </button>
      <button onClick={() => setEditing(false)} className="p-1 rounded text-neutral-400 hover:text-neutral-600">
        <X className="w-3 h-3" />
      </button>
    </div>
  )

  return (
    <button
      onClick={(e) => {
        if (stopPropagation) e.stopPropagation()
        setEditing(true)
        setVal(String(booking.paidAmount ?? ''))
      }}
      className="group flex items-center gap-1 text-sm"
    >
      <span className={booking.paidAmount != null ? 'font-semibold text-emerald-600' : 'text-neutral-300'}>
        {booking.paidAmount != null ? `${booking.paidAmount}€` : '—'}
      </span>
      <Pencil className="w-3 h-3 text-neutral-300 group-hover:text-plum transition-colors" />
    </button>
  )
}
