'use client'

interface BookingReschedulePanelProps {
  rescheduleDate: string
  availableSlots: string[]
  selectedSlot: string
  fetchingSlots: boolean
  savingReschedule: boolean
  onDateChange: (date: string) => void
  onSlotChange: (slot: string) => void
  onSave: () => void
  onCancel: () => void
}

export function BookingReschedulePanel({
  rescheduleDate,
  availableSlots,
  selectedSlot,
  fetchingSlots,
  savingReschedule,
  onDateChange,
  onSlotChange,
  onSave,
  onCancel,
}: BookingReschedulePanelProps) {
  return (
    <div className="rounded-xl border border-neutral-100 dark:border-white/8 p-3 bg-neutral-50/50 dark:bg-white/3 space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label className="text-[10px] uppercase tracking-wide text-neutral-400 mb-1 block">Fecha</label>
          <input
            type="date"
            value={rescheduleDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full text-sm border border-neutral-200 dark:border-white/10 rounded-lg px-3 py-2 bg-white dark:bg-secondary dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-plum/40"
          />
        </div>
        <div className="flex-1">
          <label className="text-[10px] uppercase tracking-wide text-neutral-400 mb-1 block">
            Hora {fetchingSlots && <span className="text-plum/60 normal-case">· cargando</span>}
          </label>
          <select
            value={selectedSlot}
            onChange={(e) => onSlotChange(e.target.value)}
            disabled={fetchingSlots || availableSlots.length === 0}
            className="w-full text-sm border border-neutral-200 dark:border-white/10 rounded-lg px-3 py-2 bg-white dark:bg-secondary dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-plum/40 disabled:opacity-50"
          >
            <option value="">
              {fetchingSlots ? 'Cargando...' : availableSlots.length === 0 ? 'Sin huecos disponibles' : 'Selecciona hora'}
            </option>
            {availableSlots.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onSave}
          disabled={savingReschedule || !selectedSlot}
          className="text-xs bg-plum hover:bg-plum-hover text-white font-medium px-4 py-1.5 rounded-full transition-colors disabled:opacity-50"
        >
          {savingReschedule ? 'Guardando...' : 'Guardar'}
        </button>
        <button
          onClick={onCancel}
          className="text-xs text-neutral-400 hover:text-neutral-600 px-3 py-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-white/8 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
