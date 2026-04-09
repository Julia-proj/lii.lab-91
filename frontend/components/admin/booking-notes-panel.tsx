'use client'

interface BookingNotesPanelProps {
  value: string
  dirty: boolean
  saving: boolean
  onChange: (val: string) => void
  onSave: () => void
}

export function BookingNotesPanel({ value, dirty, saving, onChange, onSave }: BookingNotesPanelProps) {
  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        placeholder="Nota interna..."
        className="w-full text-sm text-neutral-700 dark:text-neutral-300 rounded-lg border border-neutral-200 dark:border-white/10 px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-plum/40 bg-white dark:bg-secondary placeholder:text-neutral-300"
      />
      {dirty && (
        <button
          onClick={onSave}
          disabled={saving}
          className="mt-1.5 text-xs bg-plum hover:bg-plum-hover text-white font-medium px-4 py-1.5 rounded-full transition-colors disabled:opacity-60"
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      )}
    </div>
  )
}
