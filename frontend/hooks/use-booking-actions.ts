'use client'

import { useState } from 'react'
import { toast } from 'sonner'

interface BookingService {
  name: string
  price: number
  duration?: number
  _id?: string
}

interface UseBookingActionsProps {
  id: string
  date: string
  services: BookingService[]
  adminNotes?: string
  onUpdate: (id: string, patch: Record<string, unknown>) => void
}

export function useBookingActions({ id, date, services, adminNotes, onUpdate }: UseBookingActionsProps) {
  const totalDuration = (services || []).reduce((s, sv) => s + (sv.duration || 60), 0)

  const [rescheduleOpen, setRescheduleOpen] = useState(false)
  const [rescheduleDate, setRescheduleDate] = useState(date)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [selectedSlot, setSelectedSlot] = useState('')
  const [fetchingSlots, setFetchingSlots] = useState(false)
  const [savingReschedule, setSavingReschedule] = useState(false)

  const [notesOpen, setNotesOpen] = useState(false)
  const [adminNotesVal, setAdminNotesVal] = useState(adminNotes || '')
  const [notesDirty, setNotesDirty] = useState(false)
  const [savingNotes, setSavingNotes] = useState(false)

  const handleStatus = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) { toast.error('Error'); return }
      onUpdate(id, { status: newStatus }); toast.success('Estado actualizado')
    } catch { toast.error('Error de conexión') }
  }

  const fetchSlots = async (d: string) => {
    if (!d || !services?.length) return
    setFetchingSlots(true); setSelectedSlot('')
    try {
      const url = `/api/available-slots?date=${d}&serviceId=${services[0]._id || ''}&duration=${totalDuration}&excludeId=${id}`
      const json = await fetch(url).then((r) => r.ok ? r.json() : null)
      setAvailableSlots(json?.data?.slots ?? [])
    } catch { setAvailableSlots([]) } finally { setFetchingSlots(false) }
  }

  const handleRescheduleSave = async () => {
    if (!selectedSlot) { toast.error('Selecciona un horario'); return }
    const [h, m] = selectedSlot.split(':').map(Number)
    const endMins = h * 60 + m + totalDuration
    const endTime = `${String(Math.floor(endMins / 60)).padStart(2, '0')}:${String(endMins % 60).padStart(2, '0')}`
    setSavingReschedule(true)
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: rescheduleDate, startTime: selectedSlot, endTime }),
      })
      if (!res.ok) { const d = await res.json().catch(() => ({})); toast.error(d.error || 'Error al reprogramar'); return }
      onUpdate(id, { date: rescheduleDate, startTime: selectedSlot, endTime })
      setRescheduleOpen(false); toast.success('Cita reprogramada')
    } catch { toast.error('Error de conexión') } finally { setSavingReschedule(false) }
  }

  const handleNotesSave = async () => {
    setSavingNotes(true)
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes: adminNotesVal }),
      })
      if (!res.ok) { toast.error('Error al guardar'); return }
      onUpdate(id, { adminNotes: adminNotesVal }); setNotesDirty(false); toast.success('Nota guardada')
    } catch { toast.error('Error de conexión') } finally { setSavingNotes(false) }
  }

  return {
    rescheduleOpen, setRescheduleOpen, rescheduleDate, setRescheduleDate,
    availableSlots, selectedSlot, setSelectedSlot, fetchingSlots, savingReschedule,
    notesOpen, setNotesOpen, adminNotesVal, setAdminNotesVal, notesDirty, setNotesDirty, savingNotes,
    handleStatus, fetchSlots, handleRescheduleSave, handleNotesSave,
  }
}
