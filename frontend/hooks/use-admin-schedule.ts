'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { WEEK_SCHEDULE } from '@/lib/schedule'
import type { WeekSchedule } from '@/types'

export interface BlockedDateData { _id: string; date: string; reason?: string }
export interface BlockedHourData { _id: string; date: string; startTime: string; endTime: string; reason?: string }
export interface BookingData { _id: string; date: string; startTime: string; endTime: string; services: { name: string }[]; user: { name: string }; status: string }

export function useAdminSchedule() {
  const [blockedDates, setBlockedDates] = useState<BlockedDateData[]>([])
  const [blockedHours, setBlockedHours] = useState<BlockedHourData[]>([])
  const [bookings, setBookings]         = useState<BookingData[]>([])
  const [loading, setLoading]           = useState(true)
  const [weekSchedule, setWeekSchedule] = useState<WeekSchedule>(WEEK_SCHEDULE)
  const [addingDate, setAddingDate]     = useState(false)
  const [addingHour, setAddingHour]     = useState(false)

  const fetchAll = useCallback(async () => {
    try {
      const [datesRes, hoursRes, bookingsRes, scheduleRes] = await Promise.all([
        fetch('/api/blocked-dates'), fetch('/api/blocked-hours'), fetch('/api/bookings'), fetch('/api/admin/week-schedule'),
      ])
      const [datesJson, hoursJson, bookingsJson, scheduleJson] = await Promise.all([
        datesRes.json(), hoursRes.json(), bookingsRes.json(), scheduleRes.json(),
      ])
      setBlockedDates(datesJson.data ?? [])
      setBlockedHours(hoursJson.data ?? [])
      setBookings(bookingsJson.data ?? [])
      if (scheduleJson?.data?.schedule) setWeekSchedule(scheduleJson.data.schedule)
    } catch {
      toast.error('Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const handleBlockDate = async (dateStr: string, reason: string) => {
    setAddingDate(true)
    try {
      const res = await fetch('/api/blocked-dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: dateStr, reason: reason || undefined }),
      })
      if (!res.ok) { const data = await res.json(); toast.error(data.error || 'Error al bloquear fecha'); return }
      const json = await res.json()
      setBlockedDates((prev) => [...prev, json.data].sort((a, b) => a.date.localeCompare(b.date)))
      toast.success('Fecha bloqueada')
    } catch { toast.error('Error de conexion') } finally { setAddingDate(false) }
  }

  const handleUnblockDate = async (id: string) => {
    if (!confirm('Desbloquear esta fecha?')) return
    try {
      const res = await fetch(`/api/blocked-dates/${id}`, { method: 'DELETE' })
      if (!res.ok) { toast.error('Error al desbloquear'); return }
      setBlockedDates((prev) => prev.filter((d) => d._id !== id))
      toast.success('Fecha desbloqueada')
    } catch { toast.error('Error de conexion') }
  }

  const handleBlockHour = async (dateStr: string, startTime: string, endTime: string, reason: string) => {
    setAddingHour(true)
    try {
      const res = await fetch('/api/blocked-hours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: dateStr, startTime, endTime, reason: reason || undefined }),
      })
      if (!res.ok) { const data = await res.json(); toast.error(data.error || 'Error al bloquear hora'); return }
      const json = await res.json()
      setBlockedHours((prev) => [...prev, json.data])
      toast.success('Hora bloqueada')
    } catch { toast.error('Error de conexion') } finally { setAddingHour(false) }
  }

  const handleUnblockHour = async (id: string) => {
    try {
      const res = await fetch(`/api/blocked-hours/${id}`, { method: 'DELETE' })
      if (!res.ok) { toast.error('Error al desbloquear'); return }
      setBlockedHours((prev) => prev.filter((bh) => bh._id !== id))
      toast.success('Hora desbloqueada')
    } catch { toast.error('Error de conexion') }
  }

  return {
    blockedDates, blockedHours, bookings, loading, weekSchedule, addingDate, addingHour,
    setWeekSchedule, handleBlockDate, handleUnblockDate, handleBlockHour, handleUnblockHour,
  }
}
