'use client'

import { Plus, Trash2 } from 'lucide-react'
import type { WeekSchedule } from '@/types'

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']

interface ScheduleWeekEditRowProps {
  dow: number
  day: WeekSchedule[number]
  onToggle: () => void
  onUpdateBlock: (idx: number, field: 'start' | 'end', val: string) => void
  onAddBlock: () => void
  onRemoveBlock: (idx: number) => void
}

export function ScheduleWeekEditRow({ dow, day, onToggle, onUpdateBlock, onAddBlock, onRemoveBlock }: ScheduleWeekEditRowProps) {
  return (
    <div className={`rounded-xl border p-3 transition-colors ${
      day?.open
        ? 'border-emerald-100 dark:border-emerald-800/30 bg-emerald-50/30 dark:bg-emerald-900/10'
        : 'border-neutral-100 dark:border-white/6 bg-neutral-50/50 dark:bg-white/2'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <button onClick={onToggle}
            className={`relative w-9 h-5 rounded-full transition-colors ${day?.open ? 'bg-emerald-400' : 'bg-neutral-200 dark:bg-neutral-700'}`}>
            <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${day?.open ? 'translate-x-4' : ''}`} />
          </button>
          <span className={`text-sm font-medium ${day?.open ? 'text-neutral-800 dark:text-neutral-200' : 'text-neutral-400 dark:text-neutral-600'}`}>
            {DAY_NAMES[dow]}
          </span>
          <span className={`text-[10px] ${day?.open ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-300 dark:text-neutral-600'}`}>
            {day?.open ? 'Abierto' : 'Cerrado'}
          </span>
        </div>
        {day?.open && (
          <button onClick={onAddBlock} className="flex items-center gap-1 text-[10px] text-neutral-400 hover:text-plum dark:hover:text-lavender transition-colors">
            <Plus className="w-3 h-3" /> Anadir bloque
          </button>
        )}
      </div>

      {day?.open && (
        <div className="space-y-1.5 ml-11">
          {day.blocks.map((block, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input type="time" value={block.start} onChange={(e) => onUpdateBlock(idx, 'start', e.target.value)}
                className="w-24 rounded-lg border border-neutral-200 dark:border-white/10 px-2 py-1 text-xs bg-white dark:bg-background dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-plum/30"
              />
              <span className="text-xs text-neutral-400">—</span>
              <input type="time" value={block.end} onChange={(e) => onUpdateBlock(idx, 'end', e.target.value)}
                className="w-24 rounded-lg border border-neutral-200 dark:border-white/10 px-2 py-1 text-xs bg-white dark:bg-background dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-plum/30"
              />
              <button onClick={() => onRemoveBlock(idx)} className="text-neutral-300 hover:text-red-400 dark:text-neutral-600 dark:hover:text-red-400 transition-colors p-1">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
