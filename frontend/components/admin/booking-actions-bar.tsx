'use client'

import { Trash2, CalendarClock, StickyNote } from 'lucide-react'

interface BookingActionsBarProps {
  status: string
  rescheduleOpen: boolean
  notesOpen: boolean
  hasNotes: boolean
  showReschedule?: boolean
  showDelete?: boolean
  onStatusChange: (status: string) => void
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
  onStatusChange,
  onToggleReschedule,
  onToggleNotes,
  onDelete,
}: BookingActionsBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <select value={status} onChange={(e) => onStatusChange(e.target.value)}
        className="text-xs border border-neutral-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 bg-white dark:bg-secondary dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-plum/40 cursor-pointer">
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
  )
}
