'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  ChevronLeft, ChevronRight, Check, X,
  CalendarClock, Pencil, StickyNote,
} from 'lucide-react'
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isToday,
  format, addMonths, subMonths,
} from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Booking {
  _id: string
  user: { name: string; email?: string; phone?: string }
  services: { name: string; price: number; duration?: number; _id?: string }[]
  date: string
  startTime: string
  endTime: string
  status: string
  paidAmount?: number
  notes?: string
  adminNotes?: string
}

// ── Status styles ─────────────────────────────────────────────────────────────

const S_DOT: Record<string, string> = {
  pendiente:  'bg-amber-400',
  confirmada: 'bg-emerald-300',
  completada: 'bg-blue-400',
  cancelada:  'bg-neutral-300',
}

const S_BORDER: Record<string, string> = {
  pendiente:  'border-l-amber-400',
  confirmada: 'border-l-emerald-300',
  completada: 'border-l-blue-400',
  cancelada:  'border-l-neutral-200 dark:border-l-white/15',
}

// ── PayCell ───────────────────────────────────────────────────────────────────

function PayCell({
  booking,
  onUpdate,
}: {
  booking: Booking
  onUpdate: (id: string, patch: Partial<Booking>) => void
}) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(String(booking.paidAmount ?? ''))
  const [saving, setSaving] = useState(false)

  const save = async () => {
    const n = parseFloat(val)
    if (isNaN(n) || n < 0) { toast.error('Importe inválido'); return }
    setSaving(true)
    const newStatus =
      booking.status !== 'cancelada' && booking.status !== 'completada'
        ? 'completada'
        : booking.status
    try {
      const res = await fetch(`/api/bookings/${booking._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paidAmount: n, status: newStatus }),
      })
      if (res.ok) {
        setEditing(false)
        onUpdate(booking._id, { paidAmount: n, status: newStatus })
        toast.success('Pago registrado')
      }
    } finally { setSaving(false) }
  }

  if (editing) return (
    <div className="flex items-center gap-1">
      <input
        type="number" min="0" step="0.01" value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false) }}
        className="w-16 border border-plum rounded-lg px-2 py-1 text-sm text-right focus:outline-none focus:ring-1 focus:ring-plum bg-white dark:bg-[#2a2a32] dark:text-neutral-200"
        autoFocus disabled={saving}
      />
      <button onClick={save} disabled={saving} className="p-1 rounded bg-emerald-500 text-white hover:bg-emerald-600 transition-colors">
        <Check className="w-3 h-3" />
      </button>
      <button onClick={() => setEditing(false)} className="p-1 rounded text-neutral-400 hover:text-neutral-600">
        <X className="w-3 h-3" />
      </button>
    </div>
  )

  return (
    <button
      onClick={() => { setEditing(true); setVal(String(booking.paidAmount ?? '')) }}
      className="group flex items-center gap-1 text-sm"
    >
      <span className={booking.paidAmount != null ? 'font-semibold text-emerald-600' : 'text-neutral-300'}>
        {booking.paidAmount != null ? `${booking.paidAmount}€` : '—'}
      </span>
      <Pencil className="w-3 h-3 text-neutral-300 group-hover:text-plum transition-colors" />
    </button>
  )
}

// ── BookingCard ───────────────────────────────────────────────────────────────

function BookingCard({
  booking,
  onUpdate,
}: {
  booking: Booking
  onUpdate: (id: string, patch: Partial<Booking>) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [rescheduleOpen, setRescheduleOpen] = useState(false)
  const [rescheduleDate, setRescheduleDate] = useState(booking.date)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [selectedSlot, setSelectedSlot] = useState('')
  const [fetchingSlots, setFetchingSlots] = useState(false)
  const [savingReschedule, setSavingReschedule] = useState(false)
  const [notesOpen, setNotesOpen] = useState(false)
  const [adminNotesVal, setAdminNotesVal] = useState(booking.adminNotes || '')
  const [notesDirty, setNotesDirty] = useState(false)
  const [savingNotes, setSavingNotes] = useState(false)

  const totalPrice = (booking.services || []).reduce((s, sv) => s + sv.price, 0)
  const totalDuration = (booking.services || []).reduce((s, sv) => s + (sv.duration || 60), 0)
  const svcNames = (booking.services || []).map((s) => s.name).join(', ')
  const isPending = booking.status === 'pendiente'
  const isActive = booking.status !== 'cancelada' && booking.status !== 'completada'

  const handleStatus = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/bookings/${booking._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) { toast.error('Error'); return }
      onUpdate(booking._id, { status: newStatus })
      toast.success('Estado actualizado')
    } catch { toast.error('Error de conexión') }
  }

  const fetchSlots = async (date: string) => {
    if (!date || !booking.services?.length) return
    setFetchingSlots(true)
    setSelectedSlot('')
    try {
      const firstSvcId = booking.services[0]._id || ''
      const url = `/api/available-slots?date=${date}&serviceId=${firstSvcId}&duration=${totalDuration}&excludeId=${booking._id}`
      const res = await fetch(url)
      const data = res.ok ? await res.json() : {}
      setAvailableSlots(data.slots || [])
    } catch { setAvailableSlots([]) } finally { setFetchingSlots(false) }
  }

  const handleRescheduleSave = async () => {
    if (!selectedSlot) { toast.error('Selecciona un horario'); return }
    const [h, m] = selectedSlot.split(':').map(Number)
    const endMins = h * 60 + m + totalDuration
    const endTime = `${String(Math.floor(endMins / 60)).padStart(2, '0')}:${String(endMins % 60).padStart(2, '0')}`
    setSavingReschedule(true)
    try {
      const res = await fetch(`/api/bookings/${booking._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: rescheduleDate, startTime: selectedSlot, endTime }),
      })
      if (!res.ok) { const d = await res.json().catch(() => ({})); toast.error(d.error || 'Error al reprogramar'); return }
      onUpdate(booking._id, { date: rescheduleDate, startTime: selectedSlot, endTime })
      setRescheduleOpen(false)
      toast.success('Cita reprogramada')
    } catch { toast.error('Error de conexión') } finally { setSavingReschedule(false) }
  }

  const handleNotesSave = async () => {
    setSavingNotes(true)
    try {
      const res = await fetch(`/api/bookings/${booking._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes: adminNotesVal }),
      })
      if (!res.ok) { toast.error('Error al guardar'); return }
      onUpdate(booking._id, { adminNotes: adminNotesVal })
      setNotesDirty(false)
      toast.success('Nota guardada')
    } catch { toast.error('Error de conexión') } finally { setSavingNotes(false) }
  }

  return (
    <div className={`rounded-xl border-l-4 overflow-hidden ${
      booking.status === 'pendiente'
        ? 'bg-amber-50/80 dark:bg-amber-900/15 border border-amber-100 dark:border-amber-800/25 border-l-amber-400'
        : `bg-white dark:bg-[#1e1e24] border border-neutral-100 dark:border-white/8 ${S_BORDER[booking.status] || 'border-l-neutral-200'}`
    }`}>
      <div className="px-4 py-3">
        {/* Top row: name + pay */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{booking.user?.name || '—'}</p>
            <p className="text-xs text-neutral-400 mt-0.5">{booking.startTime}–{booking.endTime} · {svcNames}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] text-neutral-300 mb-0.5">{totalPrice}€</p>
            {!isPending && <PayCell booking={booking} onUpdate={onUpdate} />}
          </div>
        </div>

        {/* Pending: big confirm + cancel buttons */}
        {isPending && (
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => handleStatus('confirmada')}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-400 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              Confirmar
            </button>
            <button
              onClick={() => handleStatus('cancelada')}
              aria-label="Cancelar cita"
              className="flex items-center justify-center px-3 py-2 border border-neutral-200 dark:border-white/10 text-neutral-400 hover:text-red-500 hover:border-red-200 text-xs rounded-lg transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* More actions toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-1 -mx-4 px-4 py-2 w-full text-left text-[11px] text-neutral-400 hover:text-plum transition-colors"
        >
          {expanded ? '▴ menos' : '▾ más opciones'}
        </button>
      </div>

      {/* Expanded section */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-neutral-50 dark:border-white/5 pt-3 space-y-3">
          <div className="flex flex-wrap gap-2">
            {!isPending && (
              <select
                value={booking.status}
                onChange={(e) => handleStatus(e.target.value)}
                className="text-xs border border-neutral-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 bg-white dark:bg-[#2a2a32] dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-plum/40 cursor-pointer"
              >
                <option value="pendiente">Pendiente</option>
                <option value="confirmada">Confirmada</option>
                <option value="completada">Completada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            )}
            {isActive && (
              <button
                onClick={() => { const open = !rescheduleOpen; setRescheduleOpen(open); if (open) { setRescheduleDate(booking.date); fetchSlots(booking.date) } }}
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                  rescheduleOpen
                    ? 'border-plum bg-plum/8 text-plum dark:bg-plum/15'
                    : 'border-neutral-200 dark:border-white/10 text-neutral-500 hover:border-plum hover:text-plum'
                }`}
              >
                <CalendarClock className="w-3.5 h-3.5" />
                Mover
              </button>
            )}
            <button
              onClick={() => setNotesOpen(!notesOpen)}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                notesOpen || adminNotesVal
                  ? 'border-plum bg-plum/8 text-plum dark:bg-plum/15'
                  : 'border-neutral-200 dark:border-white/10 text-neutral-500 hover:border-plum hover:text-plum'
              }`}
            >
              <StickyNote className="w-3.5 h-3.5" />
              Nota
            </button>
          </div>

          {rescheduleOpen && (
            <div className="rounded-xl border border-neutral-100 dark:border-white/8 p-3 bg-neutral-50/50 dark:bg-white/3 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="text-[10px] uppercase tracking-wide text-neutral-400 mb-1 block">Fecha</label>
                  <input
                    type="date"
                    value={rescheduleDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => { setRescheduleDate(e.target.value); fetchSlots(e.target.value) }}
                    className="w-full text-sm border border-neutral-200 dark:border-white/10 rounded-lg px-3 py-2 bg-white dark:bg-[#2a2a32] dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-plum/40"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] uppercase tracking-wide text-neutral-400 mb-1 block">
                    Hora {fetchingSlots && <span className="text-plum/60 normal-case">cargando</span>}
                  </label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    disabled={fetchingSlots || availableSlots.length === 0}
                    className="w-full text-sm border border-neutral-200 dark:border-white/10 rounded-lg px-3 py-2 bg-white dark:bg-[#2a2a32] dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-plum/40 disabled:opacity-50"
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
                  onClick={handleRescheduleSave}
                  disabled={savingReschedule || !selectedSlot}
                  className="text-xs bg-plum hover:bg-plum-hover text-white font-medium px-4 py-1.5 rounded-full transition-colors disabled:opacity-50"
                >
                  {savingReschedule ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                  onClick={() => setRescheduleOpen(false)}
                  className="text-xs text-neutral-400 hover:text-neutral-600 px-3 py-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-white/8 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {notesOpen && (
            <div>
              <textarea
                value={adminNotesVal}
                onChange={(e) => { setAdminNotesVal(e.target.value); setNotesDirty(true) }}
                rows={2}
                placeholder="Nota interna..."
                className="w-full text-sm text-neutral-700 dark:text-neutral-300 rounded-lg border border-neutral-200 dark:border-white/10 px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-plum/40 bg-white dark:bg-[#2a2a32] placeholder:text-neutral-300"
              />
              {notesDirty && (
                <button
                  onClick={handleNotesSave}
                  disabled={savingNotes}
                  className="mt-1.5 text-xs bg-plum hover:bg-plum-hover text-white font-medium px-4 py-1.5 rounded-full transition-colors disabled:opacity-60"
                >
                  {savingNotes ? 'Guardando...' : 'Guardar'}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const toMin = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

// ── Day timeline ──────────────────────────────────────────────────────────────

function DayTimeline({ bookings }: { bookings: Booking[] }) {
  if (bookings.length === 0) return null

  const sorted = [...bookings].sort((a, b) => a.startTime.localeCompare(b.startTime))
  const dayStart = Math.max(toMin(sorted[0].startTime) - 20, 8 * 60)
  const dayEnd   = Math.min(toMin(sorted[sorted.length - 1].endTime) + 20, 21 * 60)
  const totalSpan = dayEnd - dayStart

  const STATUS_COLOR: Record<string, string> = {
    pendiente:  'bg-amber-400',
    confirmada: 'bg-emerald-300',
    completada: 'bg-blue-400',
  }

  const gaps: { from: string; to: string; mins: number }[] = []
  for (let i = 0; i < sorted.length - 1; i++) {
    const gapMins = toMin(sorted[i + 1].startTime) - toMin(sorted[i].endTime)
    if (gapMins > 0) gaps.push({ from: sorted[i].endTime, to: sorted[i + 1].startTime, mins: gapMins })
  }

  return (
    <div className="bg-neutral-50 dark:bg-white/4 rounded-xl p-3 mb-3">
      <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-2.5">Agenda visual</p>

      {/* Bar */}
      <div className="relative h-7 bg-neutral-100 dark:bg-white/8 rounded-md overflow-hidden">
        {/* Booking segments */}
        {sorted.map((b) => {
          const left  = ((toMin(b.startTime) - dayStart) / totalSpan) * 100
          const width = ((toMin(b.endTime) - toMin(b.startTime)) / totalSpan) * 100
          return (
            <div
              key={b._id}
              className={`absolute top-0 h-full ${STATUS_COLOR[b.status] || 'bg-neutral-300'} opacity-80`}
              style={{ left: `${left}%`, width: `${Math.max(width, 1)}%` }}
              title={`${b.startTime}–${b.endTime} · ${b.user?.name}`}
            />
          )
        })}
        {/* Gap segments */}
        {gaps.map((g, i) => {
          const left  = ((toMin(g.from) - dayStart) / totalSpan) * 100
          const width = ((toMin(g.to) - toMin(g.from)) / totalSpan) * 100
          return (
            <div
              key={i}
              className="absolute top-0 h-full flex items-center justify-center border-x border-dashed border-neutral-300/70 dark:border-white/20 bg-white/60 dark:bg-white/5"
              style={{ left: `${left}%`, width: `${Math.max(width, 0.5)}%` }}
              title={`Libre: ${g.from}–${g.to} · ${g.mins}min`}
            >
              {width > 7 && (
                <span className="text-[9px] text-neutral-400 dark:text-neutral-500 font-medium leading-none">{g.mins}m</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Time ticks */}
      <div className="relative h-4 mt-0.5">
        {sorted.map((b) => {
          const left = ((toMin(b.startTime) - dayStart) / totalSpan) * 100
          return (
            <span
              key={b._id}
              className="absolute text-[10px] text-neutral-400 -translate-x-1/2 top-0"
              style={{ left: `${left}%` }}
            >
              {b.startTime}
            </span>
          )
        })}
      </div>
    </div>
  )
}

// ── Main Agenda page ──────────────────────────────────────────────────────────

export default function AgendaPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<string>(() => new Date().toISOString().split('T')[0])
  const [stats, setStats] = useState({ todayCount: 0, pendingCount: 0, monthRevenue: 0 })
  const [showPending, setShowPending] = useState(false)

  const load = async () => {
    try {
      const [bRes, sRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/admin/stats'),
      ])
      const bData = bRes.ok ? await bRes.json() : []
      const sData = sRes.ok ? await sRes.json() : {}
      const all: Booking[] = Array.isArray(bData) ? bData : []
      setBookings(all)
      setStats({
        todayCount:   sData.stats?.bookingsToday    ?? 0,
        pendingCount: all.filter((b) => b.status === 'pendiente').length,
        monthRevenue: sData.stats?.incomeThisMonth  ?? 0,
      })
    } catch { toast.error('Error al cargar') } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  // Recompute pendingCount whenever bookings change
  useEffect(() => {
    setStats((prev) => ({ ...prev, pendingCount: bookings.filter((b) => b.status === 'pendiente').length }))
  }, [bookings])

  const handleUpdate = (id: string, patch: Partial<Booking>) => {
    setBookings((prev) => prev.map((b) => b._id === id ? { ...b, ...patch } : b))
  }

  // Calendar grid
  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 })
    const end   = endOfWeek(endOfMonth(currentMonth),     { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [currentMonth])

  // Bookings grouped by date string
  const bookingsByDay = useMemo(() => {
    const map = new Map<string, Booking[]>()
    for (const b of bookings) {
      if (!map.has(b.date)) map.set(b.date, [])
      map.get(b.date)!.push(b)
    }
    return map
  }, [bookings])

  const selectedDayBookings = useMemo(() => {
    return (bookingsByDay.get(selectedDay) || [])
      .filter((b) => b.status !== 'cancelada')
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
  }, [selectedDay, bookingsByDay])

  const selectedDayLabel = useMemo(() => {
    return new Date(selectedDay + 'T00:00:00').toLocaleDateString('es-ES', {
      weekday: 'long', day: 'numeric', month: 'long',
    })
  }, [selectedDay])

  const todayStr = new Date().toISOString().split('T')[0]
  const todayPrevistos = useMemo(() => {
    return bookings
      .filter((b) => b.date === todayStr && b.status !== 'cancelada')
      .reduce((sum, b) => sum + (b.services || []).reduce((s, sv) => s + sv.price, 0), 0)
  }, [bookings, todayStr])

  const allPendingBookings = useMemo(() => {
    return bookings
      .filter((b) => b.status === 'pendiente')
      .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
  }, [bookings])

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-5 h-5 border-2 border-neutral-200 border-t-plum rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-5">

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {/* Hoy - citas */}
        <div className="bg-white dark:bg-[#1e1e24] rounded-2xl border border-neutral-100 dark:border-white/8 p-3 sm:p-4">
          <p className="text-[10px] sm:text-xs uppercase tracking-widest text-neutral-400 mb-1.5 sm:mb-2">Hoy</p>
          <p className="text-2xl sm:text-3xl font-bold tabular-nums text-neutral-900 dark:text-neutral-100 leading-none">{stats.todayCount}</p>
          <p className="text-[11px] sm:text-xs text-neutral-400 mt-1 sm:mt-1.5">{stats.todayCount === 1 ? 'cita' : 'citas'}</p>
        </div>

        {/* Pendientes — clickable */}
        <button
          onClick={() => setShowPending((v) => !v)}
          className={`relative rounded-2xl border bg-amber-50/60 dark:bg-amber-900/10 border-amber-200/50 dark:border-amber-700/20 p-3 sm:p-4 text-left transition-all hover:opacity-90 ${
            stats.pendingCount > 0 && !showPending
              ? 'ring-2 ring-amber-300/50 dark:ring-amber-400/20 shadow-sm shadow-amber-100 dark:shadow-none'
              : ''
          }`}
        >
          {/* Pulsing dot — only when there are pending bookings and panel is closed */}
          {stats.pendingCount > 0 && !showPending && (
            <span className="absolute top-2 right-2 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-400" />
            </span>
          )}
          <p className="text-[10px] sm:text-xs uppercase tracking-widest text-neutral-400 mb-1.5 sm:mb-2">Pendientes</p>
          <p className={`text-2xl sm:text-3xl font-bold tabular-nums leading-none ${
            stats.pendingCount > 0 ? 'text-[#B8870D] dark:text-yellow-400' : 'text-neutral-900 dark:text-neutral-100'
          }`}>
            {stats.pendingCount}
          </p>
          <p className="text-[11px] sm:text-xs text-neutral-400 mt-1 sm:mt-1.5">
            {showPending ? 'cerrar ×' : stats.pendingCount > 0 ? 'ver →' : 'sin confirmar'}
          </p>
        </button>

        {/* € previstos hoy — lila */}
        <div className="bg-plum/5 dark:bg-plum/10 rounded-2xl border border-plum/15 dark:border-plum/20 p-3 sm:p-4">
          <p className="text-[10px] sm:text-xs uppercase tracking-widest text-neutral-400 mb-1.5 sm:mb-2">Previstos</p>
          <p className="text-2xl sm:text-3xl font-bold tabular-nums text-plum leading-none">{todayPrevistos}</p>
          <p className="text-[11px] sm:text-xs text-neutral-400 mt-1 sm:mt-1.5">hoy · €</p>
        </div>
      </div>

      {/* Calendar + Day panel */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 sm:gap-5 items-start">

        {/* Month calendar */}
        <div className="bg-white dark:bg-[#1e1e24] rounded-2xl border border-neutral-100 dark:border-white/8 overflow-hidden order-2 lg:order-1">
          {/* Month navigation */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-neutral-50 dark:border-white/5">
            <button
              onClick={() => {
                const prev = subMonths(currentMonth, 1)
                setCurrentMonth(prev)
                setSelectedDay(format(startOfMonth(prev), 'yyyy-MM-dd'))
              }}
              className="p-2 sm:p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/8 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-neutral-500" />
            </button>
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 capitalize">
                {format(currentMonth, 'MMMM yyyy', { locale: es })}
              </h2>
              <button
                onClick={() => {
                  const now = new Date()
                  setCurrentMonth(now)
                  setSelectedDay(now.toISOString().split('T')[0])
                  setShowPending(false)
                }}
                className="text-[10px] font-medium text-plum/70 hover:text-plum border border-plum/20 hover:border-plum/40 rounded-md px-1.5 py-0.5 transition-colors"
              >
                Hoy
              </button>
            </div>
            <button
              onClick={() => {
                const next = addMonths(currentMonth, 1)
                setCurrentMonth(next)
                setSelectedDay(format(startOfMonth(next), 'yyyy-MM-dd'))
              }}
              className="p-2 sm:p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/8 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-neutral-500" />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-neutral-50 dark:border-white/5">
            {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'].map((d, i) => (
              <div key={d} className={`py-2.5 text-center text-[10px] uppercase tracking-widest font-medium ${i >= 5 ? 'text-neutral-300 dark:text-neutral-600 bg-neutral-50/70 dark:bg-white/[0.025]' : 'text-neutral-400'}`}>{d}</div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day) => {
              const dayStr = format(day, 'yyyy-MM-dd')
              const active = (bookingsByDay.get(dayStr) || []).filter((b) => b.status !== 'cancelada')
              const inMonth = isSameMonth(day, currentMonth)
              const isSel  = selectedDay === dayStr
              const isT    = isToday(day)
              const hasPending = active.some((b) => b.status === 'pendiente')
              const isWeekend = day.getDay() === 0 || day.getDay() === 6

              return (
                <button
                  key={dayStr}
                  onClick={() => { setSelectedDay(dayStr); setShowPending(false) }}
                  className={`relative py-1.5 sm:py-2 px-0.5 min-h-[40px] sm:min-h-[50px] flex flex-col items-center gap-0.5 transition-colors border-b border-r border-neutral-50 dark:border-white/4 last:border-r-0 ${
                    isSel && isT
                      ? 'bg-plum/12 dark:bg-plum/22'
                      : isSel
                        ? 'bg-plum/8 dark:bg-plum/15'
                        : isT
                          ? 'bg-plum/5 dark:bg-plum/10'
                          : isWeekend
                            ? 'bg-neutral-50/80 dark:bg-white/[0.04] hover:bg-neutral-100/70 dark:hover:bg-white/[0.07]'
                            : 'hover:bg-neutral-50 dark:hover:bg-white/4'
                  } ${!inMonth ? 'opacity-20' : ''}`}
                >
                  <span className={`text-xs sm:text-sm font-semibold w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full transition-colors ${
                    isT
                      ? 'bg-plum text-white'
                      : isSel
                        ? 'text-plum ring-1 ring-plum/30'
                        : 'text-neutral-700 dark:text-neutral-300'
                  }`}>
                    {format(day, 'd')}
                  </span>
                  {active.length > 0 && (
                    <span className={`text-[10px] font-bold leading-none tabular-nums ${hasPending ? 'text-[#C89520]' : 'text-neutral-400 dark:text-neutral-500'}`}>
                      {active.length}
                    </span>
                  )}
                  {hasPending && (
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#C89520]" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Day detail panel */}
        <div className="space-y-3 order-1 lg:order-2">
          {showPending ? (
            <div className="bg-amber-50/60 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-700/20 p-3">
              {/* Pending header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                  <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">Sin confirmar</p>
                  {allPendingBookings.length > 0 && (
                    <span className="text-[10px] font-semibold bg-amber-400 text-white rounded-full px-1.5 py-0.5 leading-none">
                      {allPendingBookings.length}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowPending(false)}
                  className="p-1.5 rounded-lg text-amber-400 hover:text-amber-700 hover:bg-amber-100 dark:hover:bg-amber-800/20 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              {allPendingBookings.length === 0 ? (
                <div className="bg-white/60 dark:bg-white/4 rounded-xl p-8 text-center">
                  <p className="text-sm text-neutral-400">Sin pendientes</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {allPendingBookings.map((b) => (
                    <div key={b._id}>
                      <p className="text-[10px] uppercase tracking-widest text-amber-500/70 dark:text-amber-600 mb-1 px-1 capitalize">
                        {new Date(b.date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </p>
                      <BookingCard booking={b} onUpdate={handleUpdate} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 capitalize">{selectedDayLabel}</p>
                <span className="text-xs text-neutral-400">{selectedDayBookings.length} {selectedDayBookings.length === 1 ? 'cita' : 'citas'}</span>
              </div>

              {selectedDayBookings.length === 0 ? (
                <div className="bg-white dark:bg-[#1e1e24] rounded-2xl border border-dashed border-neutral-200 dark:border-white/10 py-6 text-center">
                  <p className="text-sm text-neutral-400">Día libre</p>
                </div>
              ) : (
                <>
                  <DayTimeline bookings={selectedDayBookings} />
                  <div className="space-y-1">
                    {selectedDayBookings.map((b, i) => {
                      const next = selectedDayBookings[i + 1]
                      const gapMins = next ? toMin(next.startTime) - toMin(b.endTime) : 0
                      return (
                        <div key={b._id}>
                          <BookingCard booking={b} onUpdate={handleUpdate} />
                          {gapMins > 0 && (
                            <div className="flex items-center gap-2 px-1 py-2">
                              <div className="flex-1 border-t border-dashed border-neutral-200 dark:border-white/8" />
                              <span className="text-[11px] text-neutral-400 font-medium whitespace-nowrap">
                                {b.endTime} → {next.startTime} · {gapMins}min libre
                              </span>
                              <div className="flex-1 border-t border-dashed border-neutral-200 dark:border-white/8" />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
