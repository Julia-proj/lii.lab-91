'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Filter, Trash2, StickyNote, ChevronDown, ChevronUp, Check, Pencil, Calendar } from 'lucide-react'
import { toast } from 'sonner'

// ── Course bookings section ─────────────────────────────────────────────────

interface CourseBookingData {
  _id: string
  user: { name: string; email: string; phone?: string }
  startDate: string
  days: string[]
  status: string
  notes?: string
  createdAt: string
}

const COURSE_STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  confirmada: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  pendiente:  { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-400' },
  cancelada:  { bg: 'bg-red-50',     text: 'text-red-600',     dot: 'bg-red-400' },
}

function CourseBookingRow({ booking, onUpdate }: { booking: CourseBookingData; onUpdate: (id: string, patch: Partial<CourseBookingData>) => void }) {
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

  const s = COURSE_STATUS_COLORS[booking.status] || COURSE_STATUS_COLORS.pendiente

  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden hover:border-[#CDB4DB]/50 transition-colors">
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-semibold text-neutral-900 text-sm">{booking.user?.name || '—'}</span>
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                {booking.status}
              </span>
              <span className="text-xs bg-[#CDB4DB]/20 text-[#7B4FAC] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Curso</span>
            </div>
            <div className="text-xs text-neutral-400 flex flex-wrap gap-x-3 gap-y-0.5 mb-3">
              <span>{booking.user?.email}</span>
              {booking.user?.phone && <span>{booking.user.phone}</span>}
            </div>
            <p className="text-sm font-medium text-neutral-800 mb-2">MANIC 0.0 · 800€</p>
            <div className="space-y-1">
              {booking.days.map((d, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-neutral-500">
                  <Calendar className="w-3.5 h-3.5 text-[#CDB4DB] shrink-0" />
                  <span className="capitalize">Día {i + 1}: {fmt(d)}</span>
                </div>
              ))}
            </div>
            {booking.notes && (
              <p className="mt-2 text-xs text-neutral-400 italic border-l-2 border-neutral-100 pl-2">{booking.notes}</p>
            )}
          </div>
        </div>
      </div>
      <div className="px-4 sm:px-5 py-2.5 bg-neutral-50 border-t border-neutral-100 flex flex-wrap items-center gap-2">
        <select
          value={booking.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="text-xs border border-neutral-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#CDB4DB] cursor-pointer"
        >
          <option value="pendiente">Pendiente</option>
          <option value="confirmada">Confirmada</option>
          <option value="cancelada">Cancelada</option>
        </select>
        {booking.status === 'cancelada' && (
          <button
            onClick={handleDelete}
            className="ml-auto flex items-center gap-1 text-xs text-red-400 hover:text-red-600 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Eliminar
          </button>
        )}
      </div>
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
      <div className="w-6 h-6 border-2 border-neutral-200 border-t-[#CDB4DB] rounded-full animate-spin" />
    </div>
  )

  return (
    <div>
      <div className="mb-5">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#CDB4DB] focus:border-transparent"
          />
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-10 text-center">
          <p className="text-neutral-400 text-sm">No hay reservas de curso</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => <CourseBookingRow key={b._id} booking={b} onUpdate={handleUpdate} />)}
        </div>
      )}
    </div>
  )
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
  quantities?: Record<string, string | number>
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

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  confirmada:  { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  pendiente:   { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-400' },
  cancelada:   { bg: 'bg-red-50',     text: 'text-red-600',     dot: 'bg-red-400' },
  completada:  { bg: 'bg-neutral-100',text: 'text-neutral-500', dot: 'bg-neutral-400' },
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_COLORS[status] || STATUS_COLORS.pendiente
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  )
}

function BookingRow({ booking, onUpdate }: { booking: BookingData; onUpdate: (id: string, patch: Partial<BookingData>) => void }) {
  const [notesOpen, setNotesOpen] = useState(false)
  const [adminNotesVal, setAdminNotesVal] = useState(booking.adminNotes || '')
  const [notesDirty, setNotesDirty] = useState(false)
  const [savingNotes, setSavingNotes] = useState(false)

  const [editingPaid, setEditingPaid] = useState(false)
  const [paidVal, setPaidVal] = useState(String(booking.paidAmount ?? ''))
  const [savingPaid, setSavingPaid] = useState(false)
  const paidInputRef = useRef<HTMLInputElement>(null)

  const totalPrice = (booking.services || []).reduce((s, sv) => s + sv.price, 0)

  const formatDate = (d: string) =>
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
    } catch { toast.error('Error de conexion') }
  }

  const handlePaidSave = async () => {
    const amount = parseFloat(paidVal)
    if (isNaN(amount) || amount < 0) { toast.error('Importe inválido'); return }
    setSavingPaid(true)
    try {
      const res = await fetch(`/api/bookings/${booking._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paidAmount: amount }),
      })
      if (!res.ok) { toast.error('Error al guardar'); return }
      onUpdate(booking._id, { paidAmount: amount })
      setEditingPaid(false)
      toast.success('Pagado guardado')
    } catch { toast.error('Error de conexion') } finally { setSavingPaid(false) }
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
    } catch { toast.error('Error de conexion') } finally { setSavingNotes(false) }
  }

  const handleDelete = async () => {
    if (!confirm('Eliminar esta reserva permanentemente?')) return
    try {
      const res = await fetch(`/api/bookings/${booking._id}`, { method: 'DELETE' })
      if (!res.ok) { toast.error('Error al eliminar'); return }
      onUpdate(booking._id, { status: '__deleted__' })
      toast.success('Reserva eliminada')
    } catch { toast.error('Error de conexion') }
  }

  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden hover:border-[#CDB4DB]/50 transition-colors">
      {/* Main row */}
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
          {/* Left: client + date */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-semibold text-neutral-900 text-sm">{booking.user?.name || '—'}</span>
              <StatusBadge status={booking.status} />
            </div>
            <div className="text-xs text-neutral-400 flex flex-wrap gap-x-3 gap-y-0.5 mb-3">
              <span>{booking.user?.email}</span>
              {booking.user?.phone && <span>{booking.user.phone}</span>}
            </div>

            {/* Services */}
            <div className="space-y-0.5 mb-3">
              {(booking.services || []).map((s, i) => (
                <div key={i} className="flex items-center justify-between gap-2">
                  <span className="text-sm text-neutral-700">{s.name}</span>
                  <span className="text-xs text-neutral-400 shrink-0">{s.price}€</span>
                </div>
              ))}
            </div>

            {/* Date / time */}
            <div className="flex items-center gap-3 text-xs text-neutral-500">
              <span className="capitalize font-medium">{formatDate(booking.date)}</span>
              <span className="text-neutral-300">·</span>
              <span>{booking.startTime} – {booking.endTime}</span>
            </div>

            {/* Client notes */}
            {booking.notes && (
              <p className="mt-2 text-xs text-neutral-400 italic border-l-2 border-neutral-100 pl-2">
                {booking.notes}
              </p>
            )}
          </div>

          {/* Right: financials + status */}
          <div className="flex flex-row sm:flex-col items-center sm:items-end gap-4 sm:gap-3 sm:shrink-0 sm:min-w-[160px]">
            {/* Total a pagar */}
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wide text-neutral-400 font-medium">Total a pagar</p>
              <p className="text-base font-bold text-neutral-900">{totalPrice}€</p>
            </div>

            {/* Pagado */}
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wide text-neutral-400 font-medium mb-1">Pagado en local</p>
              {editingPaid ? (
                <div className="flex items-center gap-1 justify-end">
                  <input
                    ref={paidInputRef}
                    type="number"
                    min="0"
                    step="0.01"
                    value={paidVal}
                    onChange={(e) => setPaidVal(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handlePaidSave(); if (e.key === 'Escape') setEditingPaid(false) }}
                    className="w-20 px-2 py-1 border border-[#CDB4DB] rounded-lg text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#CDB4DB]"
                    autoFocus
                    disabled={savingPaid}
                  />
                  <button
                    onClick={handlePaidSave}
                    disabled={savingPaid}
                    className="p-1 rounded-md bg-emerald-500 text-white hover:bg-emerald-600 transition-colors disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setEditingPaid(true); setPaidVal(String(booking.paidAmount ?? '')) }}
                  className="group flex items-center gap-1 justify-end text-right"
                >
                  <span className={`text-sm font-semibold ${booking.paidAmount != null ? 'text-emerald-600' : 'text-neutral-300'}`}>
                    {booking.paidAmount != null ? `${booking.paidAmount}€` : '—'}
                  </span>
                  <Pencil className="w-3 h-3 text-neutral-300 group-hover:text-[#9b7fa8] transition-colors" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions bar */}
      <div className="px-4 sm:px-5 py-2.5 bg-neutral-50 border-t border-neutral-100 flex flex-wrap items-center gap-2">
        {/* Status selector */}
        <select
          value={booking.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="text-xs border border-neutral-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#CDB4DB] cursor-pointer"
        >
          <option value="pendiente">Pendiente</option>
          <option value="confirmada">Confirmada</option>
          <option value="completada">Completada</option>
          <option value="cancelada">Cancelada</option>
        </select>

        {/* Notes toggle */}
        <button
          onClick={() => setNotesOpen(!notesOpen)}
          className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
            notesOpen || adminNotesVal
              ? 'border-[#CDB4DB] bg-[#CDB4DB]/10 text-[#7d6389]'
              : 'border-neutral-200 bg-white text-neutral-500 hover:border-[#CDB4DB] hover:text-[#9b7fa8]'
          }`}
        >
          <StickyNote className="w-3.5 h-3.5" />
          <span>Nota{adminNotesVal ? ' ·' : ''}</span>
          {notesOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {/* Delete (only for cancelada) */}
        {booking.status === 'cancelada' && (
          <button
            onClick={handleDelete}
            className="ml-auto flex items-center gap-1 text-xs text-red-400 hover:text-red-600 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Eliminar
          </button>
        )}
      </div>

      {/* Admin notes panel */}
      {notesOpen && (
        <div className="px-4 sm:px-5 py-3 border-t border-neutral-100 bg-[#fdfcff]">
          <label className="text-[10px] uppercase tracking-wide text-neutral-400 font-medium block mb-2">
            Nota interna (solo tú la ves)
          </label>
          <textarea
            value={adminNotesVal}
            onChange={(e) => { setAdminNotesVal(e.target.value); setNotesDirty(true) }}
            rows={2}
            placeholder="Añade una nota para esta reserva..."
            className="w-full text-sm text-neutral-700 rounded-lg border border-neutral-200 px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#CDB4DB] focus:border-transparent bg-white placeholder:text-neutral-300"
          />
          {notesDirty && (
            <button
              onClick={handleNotesSave}
              disabled={savingNotes}
              className="mt-2 text-xs bg-[#B48EC5] hover:bg-[#a37ab5] text-white font-medium px-4 py-1.5 rounded-full transition-colors disabled:opacity-60"
            >
              {savingNotes ? 'Guardando...' : 'Guardar nota'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function AdminBookingsPage() {
  const [tab, setTab] = useState<'citas' | 'cursos'>('citas')
  const [bookings, setBookings] = useState<BookingData[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [search, setSearch] = useState('')

  useEffect(() => { fetchBookings() }, [])

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings')
      if (!res.ok) throw new Error()
      setBookings(await res.json())
    } catch { toast.error('Error al cargar reservas') }
    finally { setLoading(false) }
  }

  const handleUpdate = (id: string, patch: Partial<BookingData>) => {
    if (patch.status === '__deleted__') {
      setBookings((prev) => prev.filter((b) => b._id !== id))
    } else {
      setBookings((prev) => prev.map((b) => b._id === id ? { ...b, ...patch } : b))
    }
  }

  const filtered = bookings
    .filter((b) => statusFilter === 'all' || b.status === statusFilter)
    .filter((b) =>
      !search ||
      b.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      (b.services || []).some((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const dc = b.date.localeCompare(a.date)
      return dc !== 0 ? dc : (b.startTime || '').localeCompare(a.startTime || '')
    })

  const counts = { all: bookings.length } as Record<string, number>
  for (const b of bookings) { counts[b.status] = (counts[b.status] || 0) + 1 }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-neutral-200 border-t-[#CDB4DB] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-neutral-900">Reservas</h1>
          <p className="text-xs text-neutral-400 mt-0.5">{bookings.length} citas en total</p>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 mb-6 bg-neutral-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setTab('citas')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'citas' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
        >
          Citas
        </button>
        <button
          onClick={() => setTab('cursos')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'cursos' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
        >
          Cursos
        </button>
      </div>

      {tab === 'cursos' && <AdminCourseBookingsTab />}
      {tab === 'citas' && <>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o servicio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#CDB4DB] focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-neutral-400 shrink-0" />
          <div className="flex flex-wrap gap-1.5">
            {[
              { value: 'all', label: 'Todas' },
              { value: 'confirmada', label: 'Confirmadas' },
              { value: 'pendiente', label: 'Pendientes' },
              { value: 'completada', label: 'Completadas' },
              { value: 'cancelada', label: 'Canceladas' },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setStatusFilter(value)}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                  statusFilter === value
                    ? 'bg-[#CDB4DB] text-white border-[#CDB4DB]'
                    : 'bg-white text-neutral-500 border-neutral-200 hover:border-[#CDB4DB] hover:text-[#9b7fa8]'
                }`}
              >
                {label}
                {counts[value] != null && (
                  <span className={`ml-1 ${statusFilter === value ? 'text-white/80' : 'text-neutral-400'}`}>
                    {counts[value]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings list */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-10 text-center">
          <p className="text-neutral-400 text-sm">No hay reservas{search ? ` para "${search}"` : ''}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => (
            <BookingRow key={b._id} booking={b} onUpdate={handleUpdate} />
          ))}
        </div>
      )}
      </>}
    </div>
  )
}
