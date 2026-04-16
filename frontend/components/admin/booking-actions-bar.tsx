'use client'

import { useState } from 'react'
import { Trash2, CalendarClock, StickyNote, Euro, Check, X } from 'lucide-react'
import { toast } from 'sonner'

interface BookingActionsBarProps {
  status: string
  rescheduleOpen: boolean
  notesOpen: boolean
  hasNotes: boolean
  showReschedule?: boolean
  showDelete?: boolean
  totalPrice?: number
  onStatusChange: (status: string) => void
  onCompleteWithAmount?: (amount: number) => void
  onToggleReschedule: () => void
  onToggleNotes: () => void
  onDelete?: () => void
}

export function BookingActionsBar({
  status,
  rescheduleOpen,
  notesOpen,
  hasNotes,
  showReschedule = true,
  showDelete = false,
  totalPrice,
  onStatusChange,
  onCompleteWithAmount,
  onToggleReschedule,
  onToggleNotes,
  onDelete,
}: BookingActionsBarProps) {
  const [pendingComplete, setPendingComplete] = useState(false)
  const [amountVal, setAmountVal] = useState('')

  const handleSelectChange = (newStatus: string) => {
    if (newStatus === 'completada' && onCompleteWithAmount) {
      setAmountVal(totalPrice != null ? String(totalPrice) : '')
      setPendingComplete(true)
      return
    }
    onStatusChange(newStatus)
  }

  const handleConfirmComplete = () => {
    const n = parseFloat(amountVal)
    if (isNaN(n) || n < 0) { toast.error('Introduce un importe válido'); return }
    onCompleteWithAmount!(n)
    setPendingComplete(false)
  }

  const handleCancelComplete = () => {
    setPendingComplete(false)
    setAmountVal('')
  }

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap gap-2">
        <select
          value={pendingComplete ? 'completada' : status}
          onChange={(e) => handleSelectChange(e.target.value)}
          className="text-xs border border-neutral-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 bg-white dark:bg-secondary dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-plum/40 cursor-pointer"
        >
          <option value="pendiente">Pendiente</option>
          <option value="confirmada">Confirmada</option>
          <option value="completada">Completada</option>
          <option value="cancelada">Cancelada</option>
        </select>

        {showReschedule && (
          <button onClick={onToggleReschedule}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
              rescheduleOpen
                ? 'border-plum bg-plum/8 text-plum dark:bg-plum/15'
                : 'border-neutral-200 dark:border-white/10 text-neutral-500 hover:border-plum hover:text-plum'
            }`}>
            <CalendarClock className="w-3.5 h-3.5" /> Mover
          </button>
        )}

        <button onClick={onToggleNotes}
          className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
            notesOpen || hasNotes
              ? 'border-plum bg-plum/8 text-plum dark:bg-plum/15'
              : 'border-neutral-200 dark:border-white/10 text-neutral-500 hover:border-plum hover:text-plum'
          }`}>
          <StickyNote className="w-3.5 h-3.5" /> {hasNotes ? 'Nota ·' : 'Nota'}
        </button>

        {showDelete && onDelete && (
          <button onClick={onDelete}
            className="ml-auto flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-red-100 hover:bg-red-50 transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> Eliminar
          </button>
        )}
      </div>

      {/* Inline panel: cobrado al marcar completada */}
      {pendingComplete && (
        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-lg px-3 py-2.5">
          <Euro className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium shrink-0">Cobrado</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={amountVal}
            onChange={(e) => setAmountVal(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleConfirmComplete(); if (e.key === 'Escape') handleCancelComplete() }}
            placeholder="0.00"
            autoFocus
            className="w-20 text-right text-sm border border-emerald-300 dark:border-emerald-700 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-400 bg-white dark:bg-secondary dark:text-neutral-200"
          />
          <span className="text-xs text-emerald-600 shrink-0">€</span>
          <button
            onClick={handleConfirmComplete}
            className="flex items-center gap-1 text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white px-2.5 py-1.5 rounded-md transition-colors"
          >
            <Check className="w-3 h-3" /> Guardar
          </button>
          <button
            onClick={handleCancelComplete}
            className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-600 px-2 py-1.5 rounded-md transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  )
}
