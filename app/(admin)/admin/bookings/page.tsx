'use client'

import { useState, useEffect } from 'react'
import { Search, Trash2, StickyNote, Check, Pencil, CalendarClock, ChevronDown, Calendar, Bell } from 'lucide-react'
import { toast } from 'sonner'

// ── Types ────────────────────────────────────────────────────────────────────

interface CourseBookingData {
  _id: string
  user: { name: string; email: string; phone?: string }
  startDate: string
  days: string[]
  courseType?: string
  status: string
  notes?: string
  createdAt: string
}

interface ServiceData {
  name: string
  category: string
  price: number
  duration: number
}

interface BookingData {
  _id: string
  services: ServiceData[]
  user: { name: string; email: string; phone: string }
  date: string
  startTime: string
  endTime: string
  status: string
  notes?: string
  paidAmount?: number
  adminNotes?: string
  createdAt: string
}

// ── Status styles ─────────────────────────────────────────────────────────────

const STATUS_BORDER: Record<string, string> = {
  confirmada: 'border-l-emerald-400',
  pendiente:  'border-l-amber-400',
  cancelada:  'border-l-neutral-300',
  completada: 'border-l-blue-400',
}

const COURSE_STATUS_DOT: Record<string, string> = {
  confirmada: 'bg-emerald-400',
  pendiente:  'bg-amber-400',
  cancelada:  'bg-neutral-300',
}

// ── PayCell ───────────────────────────────────────────────────────────────────

function PayCell({ booking, onUpdate }: { booking: BookingData; onUpdate: (id: string, patch: Partial<BookingData>) => void }) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(String(booking.paidAmount ?? ''))
  const [saving, setSaving] = useState(false)

  const totalDuration = (booking.services || []).reduce((s, sv) => s + (sv.duration || 60), 0)

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
    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
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
    </div>
  )

  return (
    <button
      onClick={(e) => { e.stopPropagation(); setEditing(true); setVal(String(booking.paidAmount ?? '')) }}
      className="group flex items-center gap-1 text-sm"
    >
      <span className={booking.paidAmount != null ? 'font-semibold text-emerald-600' : 'text-neutral-300'}>
        {booking.paidAmount != null ? `${booking.paidAmount}€` : '—'}
      </span>
      <Pencil className="w-3 h-3 text-neutral-300 group-hover:text-plum transition-colors" />
    </button>
  )
}

// ── BookingRow ────────────────────────────────────────────────────────────────

function BookingRow({ booking, onUpdate }: { booking: BookingData; onUpdate: (id: string, patch: Partial<BookingData>) => void }) {
  const [expanded, setExpanded] = useState(false)
  const [notesOpen, setNotesOpen] = useState(false)
  const [adminNotesVal, setAdminNotesVal] = useState(booking.adminNotes || '')
  const [notesDirty, setNotesDirty] = useState(false)
  const [savingNotes, setSavingNotes] = useState(false)

  const [rescheduleOpen, setRescheduleOpen] = useState(false)
  const [rescheduleDate, setRescheduleDate] = useState(booking.date)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [selectedSlot, setSelectedSlot] = useState('')
  const [fetchingSlots, setFetchingSlots] = useState(false)
  const [savingReschedule, setSavingReschedule] = useState(false)

  const totalPrice = (booking.services || []).reduce((s, sv) => s + sv.price, 0)
  const totalDuration = (booking.services || []).reduce((s, sv) => s + (sv.duration || 60), 0)
  const svcNames = (booking.services || []).map((s) => s.name).join(', ')

  const fmtDate = (d: string) =>
    new Date(d + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })

  const handleStatusChange = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/bookings/${booking._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) { toast.error('Error al actualizar estado'); return }
      onUpdate(booking._id, { status: newStatus })
      toast.success('Estado actualizado')
    } catch { toast.error('Error de conexión') }
  }

  const handleNotesSave = async () => {
    setSavingNotes(true)
    try {
      const res = await fetch(`/api/bookings/${booking._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes: adminNotesVal }),
      })
      if (!res.ok) { toast.error('Error al guardar nota'); return }
      onUpdate(booking._id, { adminNotes: adminNotesVal })
      setNotesDirty(false)
      toast.success('Nota guardada')
    } catch { toast.error('Error de conexión') } finally { setSavingNotes(false) }
  }

  const handleDelete = async () => {
    if (!confirm('¿Eliminar esta reserva?')) return
    try {
      const res = await fetch(`/api/bookings/${booking._id}`, { method: 'DELETE' })
      if (!res.ok) { toast.error('Error al eliminar'); return }
      onUpdate(booking._id, { status: '__deleted__' })
      toast.success('Reserva eliminada')
    } catch { toast.error('Error de conexión') }
  }

  const fetchSlots = async (date: string) => {
    if (!date || !booking.services?.length) return
    setFetchingSlots(true)
    setSelectedSlot('')
    try {
      const firstSvcId = (booking.services[0] as ServiceData & { _id?: string })._id || ''
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
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        toast.error(d.error || 'Error al reprogramar')
        return
      }
      onUpdate(booking._id, { date: rescheduleDate, startTime: selectedSlot, endTime })
      setRescheduleOpen(false)
      toast.success('Cita reprogramada')
    } catch { toast.error('Error de conexión') } finally { setSavingReschedule(false) }
  }

  return (
    <div className={`bg-white dark:bg-[#1e1e24] rounded-xl border border-neutral-100 dark:border-white/8 border-l-4 ${STATUS_BORDER[booking.status] || 'border-l-neutral-300'} overflow-hidden`}>

      {/* Main row */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setExpanded(!expanded)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setExpanded(!expanded) }}
        className="w-full text-left px-4 py-3 flex items-center gap-3 cursor-pointer"
      >
        <div className="shrink-0 w-[100px]">
          <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 capitalize">{fmtDate(booking.date)}</p>
          <p className="text-[11px] text-neutral-400 font-mono">{booking.startTime}–{booking.endTime}</p>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">{booking.user?.name || '—'}</p>
          <p className="text-xs text-neutral-400 truncate">{svcNames}</p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-[10px] text-neutral-300 mb-0.5">{totalPrice}€</p>
          <PayCell booking={booking} onUpdate={onUpdate} />
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-neutral-300 shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </div>

      {/* Expanded actions */}
      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-neutral-50 dark:border-white/5 space-y-3">

          <div className="flex flex-wrap gap-2">
            <select
              value={booking.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="text-xs border border-neutral-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 bg-white dark:bg-[#2a2a32] dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-plum/40 cursor-pointer"
            >
              <option value="pendiente">Pendiente</option>
              <option value="confirmada">Confirmada</option>
              <option value="completada">Completada</option>
              <option value="cancelada">Cancelada</option>
            </select>

            {booking.status !== 'cancelada' && booking.status !== 'completada' && (
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
              {adminNotesVal ? 'Nota ·' : 'Nota'}
            </button>

            {booking.status === 'cancelada' && (
              <button
                onClick={handleDelete}
                className="ml-auto flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-red-100 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Eliminar
              </button>
            )}
          </div>

          {/* Reschedule panel */}
          {rescheduleOpen && (
            <div className="rounded-xl border border-neutral-100 dark:border-white/8 p-3 bg-neutral-50/50 dark:bg-white/3">
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
                    Hora {fetchingSlots && <span className="text-plum/60 normal-case">· cargando</span>}
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
              <div className="flex gap-2 mt-3">
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

          {/* Notes panel */}
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

// ── Course bookings ───────────────────────────────────────────────────────────

function CourseBookingRow({ booking, onUpdate }: { booking: CourseBookingData; onUpdate: (id: string, patch: Partial<CourseBookingData>) => void }) {
  const [expanded, setExpanded] = useState(false)

  const fmt = (d: string) =>
    new Date(d + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })

  const handleStatusChange = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/course-bookings/${booking._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) { toast.error('Error al actualizar'); return }
      onUpdate(booking._id, { status: newStatus })
      toast.success('Estado actualizado')
    } catch { toast.error('Error de conexión') }
  }

  const handleDelete = async () => {
    if (!confirm('¿Eliminar esta reserva de curso?')) return
    try {
      const res = await fetch(`/api/course-bookings/${booking._id}`, { method: 'DELETE' })
      if (!res.ok) { toast.error('Error al eliminar'); return }
      onUpdate(booking._id, { status: '__deleted__' } as Partial<CourseBookingData>)
      toast.success('Reserva eliminada')
    } catch { toast.error('Error de conexión') }
  }

  const courseLabel = booking.courseType === 'perfeccionamiento' ? 'Perfeccionamiento' : 'MANIC 0.0'
  const price = booking.courseType === 'perfeccionamiento' ? '349,99€' : '749,99€'

  return (
    <div className={`bg-white dark:bg-[#1e1e24] rounded-xl border border-neutral-100 dark:border-white/8 border-l-4 ${COURSE_STATUS_DOT[booking.status] ? '' : ''} overflow-hidden`}
      style={{ borderLeftColor: booking.status === 'confirmada' ? 'rgb(52 211 153)' : booking.status === 'cancelada' ? 'rgb(212 212 212)' : 'rgb(251 191 36)' }}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => setExpanded(!expanded)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setExpanded(!expanded) }}
        className="w-full text-left px-4 py-3 flex items-center gap-3 cursor-pointer"
      >
        <div className="shrink-0 w-[100px]">
          <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 capitalize">{fmt(booking.startDate)}</p>
          <p className="text-[11px] text-neutral-400">{booking.days.length} {booking.days.length === 1 ? 'día' : 'días'}</p>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">{booking.user?.name || '—'}</p>
          <p className="text-xs text-neutral-400 truncate">{courseLabel}</p>
        </div>

        <p className="text-xs font-semibold text-neutral-500 shrink-0">{price}</p>
        <ChevronDown className={`w-3.5 h-3.5 text-neutral-300 shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-neutral-50 dark:border-white/5 space-y-3">
          <div className="space-y-1 mb-2">
            {booking.days.map((d, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-neutral-500">
                <Calendar className="w-3 h-3 text-plum shrink-0" />
                <span className="capitalize">Día {i + 1}: {fmt(d)}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-neutral-400">{booking.user?.email}{booking.user?.phone ? ` · ${booking.user.phone}` : ''}</p>
          {booking.notes && (
            <p className="text-xs text-neutral-400 italic border-l-2 border-neutral-100 pl-2">{booking.notes}</p>
          )}
          <div className="flex flex-wrap gap-2">
            <select
              value={booking.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="text-xs border border-neutral-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 bg-white dark:bg-[#2a2a32] dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-plum/40 cursor-pointer"
            >
              <option value="pendiente">Pendiente</option>
              <option value="confirmada">Confirmada</option>
              <option value="cancelada">Cancelada</option>
            </select>
            {booking.status === 'cancelada' && (
              <button
                onClick={handleDelete}
                className="ml-auto flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-red-100 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Eliminar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function AdminCourseBookingsTab() {
  const [bookings, setBookings] = useState<CourseBookingData[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/course-bookings')
      .then((r) => r.json())
      .then((d) => setBookings(d))
      .catch(() => toast.error('Error al cargar'))
      .finally(() => setLoading(false))
  }, [])

  const handleUpdate = (id: string, patch: Partial<CourseBookingData>) => {
    if ((patch as { status?: string }).status === '__deleted__') {
      setBookings((prev) => prev.filter((b) => b._id !== id))
    } else {
      setBookings((prev) => prev.map((b) => b._id === id ? { ...b, ...patch } : b))
    }
  }

  const filtered = bookings
    .filter((b) => !search ||
      b.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.user?.email?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => b.startDate.localeCompare(a.startDate))

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <div className="w-5 h-5 border-2 border-neutral-200 border-t-plum rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 text-sm bg-white dark:bg-[#1e1e24] dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-plum/40 dark:placeholder:text-neutral-500"
        />
      </div>
      {filtered.length === 0 ? (
        <p className="text-sm text-neutral-400 text-center py-8">No hay reservas de curso</p>
      ) : (
        filtered.map((b) => <CourseBookingRow key={b._id} booking={b} onUpdate={handleUpdate} />)
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AdminBookingsPage() {
  const [tab, setTab] = useState<'citas' | 'cursos'>('citas')
  const [bookings, setBookings] = useState<BookingData[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week'>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/bookings')
      .then((r) => r.json())
      .then((d) => setBookings(d))
      .catch(() => toast.error('Error al cargar reservas'))
      .finally(() => setLoading(false))
  }, [])

  const handleUpdate = (id: string, patch: Partial<BookingData>) => {
    if (patch.status === '__deleted__') {
      setBookings((prev) => prev.filter((b) => b._id !== id))
    } else {
      setBookings((prev) => prev.map((b) => b._id === id ? { ...b, ...patch } : b))
    }
  }

  const handleConfirmDirect = async (id: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'confirmada' }),
      })
      if (!res.ok) { toast.error('Error al confirmar'); return }
      handleUpdate(id, { status: 'confirmada' })
      toast.success('Cita confirmada · Cliente notificado')
    } catch { toast.error('Error de conexión') }
  }

  const todayStr = new Date().toISOString().split('T')[0]
  const weekStart = (() => {
    const d = new Date(); const day = d.getDay()
    d.setDate(d.getDate() - (day === 0 ? 6 : day - 1))
    return d.toISOString().split('T')[0]
  })()
  const weekEnd = (() => {
    const d = new Date(); const day = d.getDay()
    d.setDate(d.getDate() + (day === 0 ? 0 : 7 - day))
    return d.toISOString().split('T')[0]
  })()

  const filtered = bookings
    .filter((b) => statusFilter === 'all' || b.status === statusFilter)
    .filter((b) => {
      if (dateFilter === 'today') return b.date === todayStr
      if (dateFilter === 'week') return b.date >= weekStart && b.date <= weekEnd
      return true
    })
    .filter((b) =>
      !search ||
      b.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      (b.services || []).some((s) => (s.name || '').toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const dc = b.date.localeCompare(a.date)
      return dc !== 0 ? dc : (b.startTime || '').localeCompare(a.startTime || '')
    })

  const counts = { all: bookings.length } as Record<string, number>
  for (const b of bookings) { counts[b.status] = (counts[b.status] || 0) + 1 }

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <div className="w-5 h-5 border-2 border-neutral-200 border-t-plum rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-5 max-w-xl">
      <div>
        <h1 className="font-serif text-2xl text-neutral-900 dark:text-neutral-100">Reservas</h1>
        <p className="text-xs text-neutral-400 mt-0.5">{bookings.length} citas en total</p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 bg-neutral-100 dark:bg-white/5 p-1 rounded-xl w-fit">
        {(['citas', 'cursos'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
              tab === t
                ? 'bg-white dark:bg-[#2a2a32] text-neutral-900 dark:text-neutral-100 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'cursos' && <AdminCourseBookingsTab />}

      {tab === 'citas' && (
        <div className="space-y-3">

          {/* ── Pendientes banner ── */}
          {bookings.filter((b) => b.status === 'pendiente').length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-500/8 dark:border-amber-500/20 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Bell className="w-4 h-4 text-amber-500" />
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">
                  {bookings.filter((b) => b.status === 'pendiente').length} pendiente{bookings.filter((b) => b.status === 'pendiente').length !== 1 ? 's' : ''} de confirmación
                </p>
              </div>
              <div className="space-y-2">
                {bookings
                  .filter((b) => b.status === 'pendiente')
                  .sort((a, b) => a.date.localeCompare(b.date))
                  .map((b) => (
                    <div key={b._id} className="flex items-center justify-between bg-white dark:bg-[#1e1e24] rounded-lg px-3 py-2.5 border border-amber-100 dark:border-white/6">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">{b.user?.name}</p>
                        <p className="text-[11px] text-neutral-400">
                          {new Date(b.date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })} · {b.startTime}
                          {b.services?.length > 0 && ` · ${b.services.map(s => s.name).join(', ')}`}
                        </p>
                      </div>
                      <button
                        onClick={() => handleConfirmDirect(b._id)}
                        className="ml-3 shrink-0 flex items-center gap-1.5 text-xs bg-plum hover:bg-plum-hover text-white font-medium px-3 py-1.5 rounded-full transition-colors"
                      >
                        <Check className="w-3 h-3" />
                        Confirmar
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o servicio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 text-sm bg-white dark:bg-[#1e1e24] dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-plum/40 dark:placeholder:text-neutral-500"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-1.5">
            {([
              { value: 'all',   label: 'Todas',    type: 'date' },
              { value: 'today', label: 'Hoy',      type: 'date' },
              { value: 'week',  label: 'Semana',   type: 'date' },
            ] as { value: 'all' | 'today' | 'week'; label: string; type: string }[]).map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setDateFilter(value)}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                  dateFilter === value
                    ? 'bg-neutral-800 dark:bg-white/15 text-white border-neutral-800 dark:border-white/15'
                    : 'bg-white dark:bg-transparent text-neutral-500 border-neutral-200 dark:border-white/10 hover:border-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
              >
                {label}
              </button>
            ))}

            <span className="w-px h-6 bg-neutral-200 dark:bg-white/10 self-center mx-0.5" />

            {[
              { value: 'all',        label: 'Estado' },
              { value: 'confirmada', label: 'Conf.' },
              { value: 'pendiente',  label: 'Pend.' },
              { value: 'completada', label: 'Comp.' },
              { value: 'cancelada',  label: 'Canc.' },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setStatusFilter(value)}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                  statusFilter === value
                    ? 'bg-plum text-white border-plum'
                    : 'bg-white dark:bg-transparent text-neutral-500 border-neutral-200 dark:border-white/10 hover:border-plum/50 hover:text-plum'
                }`}
              >
                {label}
                {counts[value] != null && value !== 'all' && (
                  <span className={`ml-1 ${statusFilter === value ? 'text-white/70' : 'text-neutral-300'}`}>
                    {counts[value] || 0}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Bookings list */}
          {filtered.length === 0 ? (
            <p className="text-sm text-neutral-400 text-center py-8">Sin resultados</p>
          ) : (
            filtered.map((b) => <BookingRow key={b._id} booking={b} onUpdate={handleUpdate} />)
          )}
        </div>
      )}
    </div>
  )
}
