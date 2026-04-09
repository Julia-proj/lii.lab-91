'use client'

import { Clock, Trash2 } from 'lucide-react'

interface BlockedHourData {
  _id: string
  date: string
  startTime: string
  endTime: string
  reason?: string
}

const TIME_SLOTS: string[] = []
for (let h = 8; h <= 21; h++) {
  for (const m of [0, 15, 30, 45]) {
    if (h === 21 && m > 0) break
    TIME_SLOTS.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
  }
}

interface ScheduleBlockHourPanelProps {
  dayBlockedHours: BlockedHourData[]
  newHourStart: string
  newHourEnd: string
  newHourReason: string
  addingHour: boolean
  onChangeStart: (v: string) => void
  onChangeEnd: (v: string) => void
  onChangeReason: (v: string) => void
  onBlock: () => void
  onUnblock: (id: string) => void
}

export function ScheduleBlockHourPanel({
  dayBlockedHours,
  newHourStart,
  newHourEnd,
  newHourReason,
  addingHour,
  onChangeStart,
  onChangeEnd,
  onChangeReason,
  onBlock,
  onUnblock,
}: ScheduleBlockHourPanelProps) {
  return (
    <div className="bg-white dark:bg-card rounded-2xl border border-neutral-100 dark:border-white/8 p-4">
      <h3 className="font-medium text-sm mb-3 flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
        <Clock className="w-4 h-4 text-orange-400" />
        Bloquear horas
      </h3>
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-wide text-neutral-400 mb-1">Desde</p>
            <select value={newHourStart} onChange={(e) => onChangeStart(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 dark:border-white/10 px-3 py-2 text-sm bg-white dark:bg-background dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-plum/30 cursor-pointer">
              <option value="">— hora —</option>
              {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-wide text-neutral-400 mb-1">Hasta</p>
            <select value={newHourEnd} onChange={(e) => onChangeEnd(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 dark:border-white/10 px-3 py-2 text-sm bg-white dark:bg-background dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-plum/30 cursor-pointer">
              <option value="">— hora —</option>
              {TIME_SLOTS.filter((t) => !newHourStart || t > newHourStart).map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-2">
          <input type="text" value={newHourReason} onChange={(e) => onChangeReason(e.target.value)}
            placeholder="Motivo (opcional)"
            className="flex-1 rounded-lg border border-neutral-200 dark:border-white/10 px-3 py-2 text-sm bg-white dark:bg-background dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-plum/30 placeholder:text-neutral-300 dark:placeholder:text-neutral-600"
          />
          <button onClick={onBlock} disabled={!newHourStart || !newHourEnd || addingHour}
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 px-4 rounded-full transition-colors disabled:opacity-50 shrink-0">
            {addingHour ? '...' : 'Bloquear'}
          </button>
        </div>
      </div>

      {dayBlockedHours.length > 0 && (
        <div className="space-y-1.5">
          {dayBlockedHours.map((bh) => (
            <div key={bh._id} className="flex items-center justify-between bg-orange-50 dark:bg-orange-900/20 rounded-lg px-3 py-2">
              <div>
                <span className="text-sm font-medium text-orange-700 dark:text-orange-400">{bh.startTime} – {bh.endTime}</span>
                {bh.reason && <span className="text-xs text-orange-500 dark:text-orange-500/80 ml-2">{bh.reason}</span>}
              </div>
              <button onClick={() => onUnblock(bh._id)} className="text-orange-400 hover:text-red-500 transition-colors p-1">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
