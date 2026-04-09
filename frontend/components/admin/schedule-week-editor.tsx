'use client'

import { useState } from 'react'
import { Pencil, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import type { WeekSchedule } from '@/types'
import { ScheduleWeekView } from '@/components/admin/schedule-week-view'
import { ScheduleWeekEditRow } from '@/components/admin/schedule-week-edit-row'

interface ScheduleWeekEditorProps {
  weekSchedule: WeekSchedule
  onSave: (schedule: WeekSchedule) => void
}

export function ScheduleWeekEditor({ weekSchedule, onSave }: ScheduleWeekEditorProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<WeekSchedule>(weekSchedule)
  const [saving, setSaving] = useState(false)

  const startEdit = () => { setDraft(JSON.parse(JSON.stringify(weekSchedule))); setEditing(true) }
  const cancelEdit = () => { setDraft(JSON.parse(JSON.stringify(weekSchedule))); setEditing(false) }

  const toggleDay = (dow: number) => {
    setDraft((prev) => ({
      ...prev,
      [dow]: { open: !prev[dow].open, blocks: prev[dow].open ? [] : [{ start: '09:00', end: '14:00' }] },
    }))
  }

  const updateBlock = (dow: number, idx: number, field: 'start' | 'end', val: string) => {
    setDraft((prev) => {
      const blocks = [...prev[dow].blocks]
      blocks[idx] = { ...blocks[idx], [field]: val }
      return { ...prev, [dow]: { ...prev[dow], blocks } }
    })
  }

  const addBlock = (dow: number) => {
    setDraft((prev) => ({
      ...prev,
      [dow]: { ...prev[dow], blocks: [...prev[dow].blocks, { start: '15:00', end: '19:00' }] },
    }))
  }

  const removeBlock = (dow: number, idx: number) => {
    setDraft((prev) => {
      const blocks = prev[dow].blocks.filter((_, i) => i !== idx)
      return { ...prev, [dow]: { ...prev[dow], blocks, open: blocks.length > 0 } }
    })
  }

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/week-schedule', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schedule: draft }),
      })
      if (!res.ok) { const data = await res.json(); toast.error(data.error || 'Error al guardar'); return }
      onSave(draft); setEditing(false); toast.success('Horario guardado')
    } catch { toast.error('Error de conexion') } finally { setSaving(false) }
  }

  return (
    <div className="bg-white dark:bg-card rounded-2xl border border-neutral-100 dark:border-white/8 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Horario semanal</h2>
        {!editing ? (
          <button onClick={startEdit} className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-plum dark:hover:text-lavender transition-colors px-2.5 py-1.5 rounded-lg hover:bg-plum/5">
            <Pencil className="w-3 h-3" /> Editar
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button onClick={cancelEdit} className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/8 transition-colors">
              <X className="w-3 h-3" /> Cancelar
            </button>
            <button onClick={save} disabled={saving} className="flex items-center gap-1 text-xs bg-plum text-white px-3 py-1.5 rounded-lg hover:bg-plum/90 transition-colors disabled:opacity-50">
              <Check className="w-3 h-3" /> {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        )}
      </div>

      {!editing ? (
        <ScheduleWeekView weekSchedule={weekSchedule} />
      ) : (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6, 0].map((dow) => (
            <ScheduleWeekEditRow
              key={dow}
              dow={dow}
              day={draft[dow]}
              onToggle={() => toggleDay(dow)}
              onUpdateBlock={(idx, field, val) => updateBlock(dow, idx, field, val)}
              onAddBlock={() => addBlock(dow)}
              onRemoveBlock={(idx) => removeBlock(dow, idx)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
