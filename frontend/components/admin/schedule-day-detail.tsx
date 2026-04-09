'use client'

import { useState } from 'react'
import { CalendarOff } from 'lucide-react'
import { toast } from 'sonner'
import { WEEK_SCHEDULE } from '@/lib/schedule'
import { formatDate } from '@/lib/format'
import { ScheduleBlockHourPanel } from '@/components/admin/schedule-block-hour-panel'
import { ScheduleDayBookings } from '@/components/admin/schedule-day-bookings'

interface BlockedDateData { _id: string; date: string; reason?: string }
interface BlockedHourData { _id: string; date: string; startTime: string; endTime: string; reason?: string }
interface BookingData { _id: string; date: string; startTime: string; endTime: string; services: { name: string }[]; user: { name: string }; status: string }

interface ScheduleDayDetailProps {
  selectedDate: string | null
  blockedDates: BlockedDateData[]
  blockedHours: BlockedHourData[]
  bookings: BookingData[]
  onBlockDate: (dateStr: string, reason: string) => Promise<void>
  onUnblockDate: (id: string) => Promise<void>
  onBlockHour: (dateStr: string, start: string, end: string, reason: string) => Promise<void>
  onUnblockHour: (id: string) => Promise<void>
  addingDate: boolean
  addingHour: boolean
}

export function ScheduleDayDetail({
  selectedDate, blockedDates, blockedHours, bookings,
  onBlockDate, onUnblockDate, onBlockHour, onUnblockHour,
  addingDate, addingHour,
}: ScheduleDayDetailProps) {
  const [newDateReason, setNewDateReason] = useState('')
  const [newHourStart, setNewHourStart] = useState('')
  const [newHourEnd, setNewHourEnd] = useState('')
  const [newHourReason, setNewHourReason] = useState('')

  if (!selectedDate) {
    return (
      <div className="bg-white dark:bg-card rounded-2xl border border-neutral-100 dark:border-white/8 p-8 text-center">
        <CalendarOff className="w-8 h-8 text-neutral-200 dark:text-neutral-700 mx-auto mb-3" />
        <p className="text-sm text-neutral-400">Selecciona un dia para ver detalles y gestionar bloqueos</p>
      </div>
    )
  }

  const selectedDow = new Date(selectedDate + 'T00:00:00').getDay()
  const selectedSchedule = WEEK_SCHEDULE[selectedDow]
  const isBlocked = new Set(blockedDates.map((d) => d.date)).has(selectedDate)
  const blockedDateObj = blockedDates.find((d) => d.date === selectedDate)
  const dayBookings = bookings.filter((b) => b.date === selectedDate && b.status !== 'cancelada')
  const dayBlockedHours = blockedHours.filter((bh) => bh.date === selectedDate)

  const handleBlockHour = async () => {
    if (!newHourStart || !newHourEnd) return
    if (newHourStart >= newHourEnd) { toast.error('La hora de inicio debe ser anterior a la de fin'); return }
    await onBlockHour(selectedDate, newHourStart, newHourEnd, newHourReason)
    setNewHourStart(''); setNewHourEnd(''); setNewHourReason('')
  }

  const handleBlockDate = async () => {
    await onBlockDate(selectedDate, newDateReason)
    setNewDateReason('')
  }

  return (
    <>
      <div className="bg-white dark:bg-card rounded-2xl border border-neutral-100 dark:border-white/8 p-4">
        <h3 className="font-serif text-base mb-1 capitalize text-neutral-900 dark:text-neutral-100">{formatDate(selectedDate)}</h3>
        <p className="text-xs text-neutral-400 mb-3">
          {selectedSchedule?.open
            ? `Horario: ${selectedSchedule.blocks.map((b) => `${b.start} - ${b.end}`).join(', ')}`
            : 'Dia cerrado (sin horario)'}
        </p>

        {isBlocked ? (
          <div className="flex items-center justify-between bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
            <div>
              <p className="text-sm font-medium text-red-700 dark:text-red-400">Dia bloqueado</p>
              {blockedDateObj?.reason && <p className="text-xs text-red-500 dark:text-red-500/80">{blockedDateObj.reason}</p>}
            </div>
            <button onClick={() => blockedDateObj && onUnblockDate(blockedDateObj._id)}
              className="text-xs bg-white dark:bg-white/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/40 rounded-full px-3 py-1 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
              Desbloquear
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2">
            <input type="text" value={newDateReason} onChange={(e) => setNewDateReason(e.target.value)}
              placeholder="Motivo (opcional)"
              className="flex-1 rounded-lg border border-neutral-200 dark:border-white/10 px-3 py-2 text-sm bg-white dark:bg-background dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-plum/30 placeholder:text-neutral-300 dark:placeholder:text-neutral-600"
            />
            <button onClick={handleBlockDate} disabled={addingDate}
              className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 px-4 rounded-full transition-colors disabled:opacity-50 flex items-center gap-1.5">
              <CalendarOff className="w-3.5 h-3.5" />
              {addingDate ? 'Bloqueando...' : 'Bloquear dia'}
            </button>
          </div>
        )}
      </div>

      {!isBlocked && selectedSchedule?.open && (
        <ScheduleBlockHourPanel
          dayBlockedHours={dayBlockedHours}
          newHourStart={newHourStart}
          newHourEnd={newHourEnd}
          newHourReason={newHourReason}
          addingHour={addingHour}
          onChangeStart={setNewHourStart}
          onChangeEnd={setNewHourEnd}
          onChangeReason={setNewHourReason}
          onBlock={handleBlockHour}
          onUnblock={onUnblockHour}
        />
      )}

      <ScheduleDayBookings dayBookings={dayBookings} />
    </>
  )
}
