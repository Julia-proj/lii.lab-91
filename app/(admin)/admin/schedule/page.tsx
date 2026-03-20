'use client'

import { useState, useEffect, useCallback } from 'react'
import { CalendarOff, Clock, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { WEEK_SCHEDULE } from '@/lib/schedule'

interface BlockedDateData {
  _id: string
  date: string
  reason?: string
}

interface BlockedHourData {
  _id: string
  date: string
  startTime: string
  endTime: string
  reason?: string
}

interface BookingData {
  _id: string
  date: string
  startTime: string
  endTime: string
  services: { name: string }[]
  user: { name: string }
  status: string
}

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']

// 24h time slots every 15 min, 8:00–21:00
const TIME_SLOTS: string[] = []
for (let h = 8; h <= 21; h++) {
  for (const m of [0, 15, 30, 45]) {
    if (h === 21 && m > 0) break
    TIME_SLOTS.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
  }
}
const DAY_NAMES_FULL = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) days.push(d)
  return days
}

function formatDateStr(year: number, month: number, day: number): string {
  return `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
}

export default function AdminSchedulePage() {
  const now = new Date()
  const [currentMonth, setCurrentMonth] = useState(now.getMonth())
  const [currentYear, setCurrentYear] = useState(now.getFullYear())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const [blockedDates, setBlockedDates] = useState<BlockedDateData[]>([])
  const [blockedHours, setBlockedHours] = useState<BlockedHourData[]>([])
  const [bookings, setBookings] = useState<BookingData[]>([])
  const [loading, setLoading] = useState(true)

  // Block date form
  const [newDateReason, setNewDateReason] = useState('')
  const [addingDate, setAddingDate] = useState(false)

  // Block hour form
  const [newHourStart, setNewHourStart] = useState('')
  const [newHourEnd, setNewHourEnd] = useState('')
  const [newHourReason, setNewHourReason] = useState('')
  const [addingHour, setAddingHour] = useState(false)

  const fetchAll = useCallback(async () => {
    try {
      const [datesRes, hoursRes, bookingsRes] = await Promise.all([
        fetch('/api/blocked-dates'),
        fetch('/api/blocked-hours'),
        fetch('/api/bookings'),
      ])
      const [datesData, hoursData, bookingsData] = await Promise.all([
        datesRes.json(),
        hoursRes.json(),
        bookingsRes.json(),
      ])
      setBlockedDates(datesData)
      setBlockedHours(hoursData)
      setBookings(Array.isArray(bookingsData) ? bookingsData : [])
    } catch {
      toast.error('Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const blockedDateSet = new Set(blockedDates.map((d) => d.date))

  const getBookingsForDate = (dateStr: string) =>
    bookings.filter((b) => b.date === dateStr && b.status !== 'cancelada')

  const getBlockedHoursForDate = (dateStr: string) =>
    blockedHours.filter((bh) => bh.date === dateStr)

  // ------- Block date -------
  const handleBlockDate = async (dateStr: string) => {
    setAddingDate(true)
    try {
      const res = await fetch('/api/blocked-dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: dateStr, reason: newDateReason || undefined }),
      })
      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || 'Error al bloquear fecha')
        return
      }
      const data = await res.json()
      setBlockedDates((prev) => [...prev, data].sort((a, b) => a.date.localeCompare(b.date)))
      setNewDateReason('')
      toast.success('Fecha bloqueada')
    } catch {
      toast.error('Error de conexion')
    } finally {
      setAddingDate(false)
    }
  }

  const handleUnblockDate = async (id: string) => {
    if (!confirm('Desbloquear esta fecha?')) return
    try {
      const res = await fetch(`/api/blocked-dates/${id}`, { method: 'DELETE' })
      if (!res.ok) { toast.error('Error al desbloquear'); return }
      setBlockedDates((prev) => prev.filter((d) => d._id !== id))
      toast.success('Fecha desbloqueada')
    } catch {
      toast.error('Error de conexion')
    }
  }

  // ------- Block hour -------
  const handleBlockHour = async () => {
    if (!selectedDate || !newHourStart || !newHourEnd) return
    if (newHourStart >= newHourEnd) {
      toast.error('La hora de inicio debe ser anterior a la de fin')
      return
    }
    setAddingHour(true)
    try {
      const res = await fetch('/api/blocked-hours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          startTime: newHourStart,
          endTime: newHourEnd,
          reason: newHourReason || undefined,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || 'Error al bloquear hora')
        return
      }
      const data = await res.json()
      setBlockedHours((prev) => [...prev, data])
      setNewHourStart('')
      setNewHourEnd('')
      setNewHourReason('')
      toast.success('Hora bloqueada')
    } catch {
      toast.error('Error de conexion')
    } finally {
      setAddingHour(false)
    }
  }

  const handleUnblockHour = async (id: string) => {
    try {
      const res = await fetch(`/api/blocked-hours/${id}`, { method: 'DELETE' })
      if (!res.ok) { toast.error('Error al desbloquear'); return }
      setBlockedHours((prev) => prev.filter((bh) => bh._id !== id))
      toast.success('Hora desbloqueada')
    } catch {
      toast.error('Error de conexion')
    }
  }

  // ------- Calendar nav -------
  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1) }
    else setCurrentMonth(currentMonth - 1)
  }
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1) }
    else setCurrentMonth(currentMonth + 1)
  }

  const monthDays = getMonthDays(currentYear, currentMonth)
  const monthName = new Date(currentYear, currentMonth).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })

  const formatDateFull = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
  }

  // Selected date details
  const selectedDow = selectedDate ? new Date(selectedDate + 'T00:00:00').getDay() : null
  const selectedSchedule = selectedDow !== null ? WEEK_SCHEDULE[selectedDow] : null
  const selectedIsBlocked = selectedDate ? blockedDateSet.has(selectedDate) : false
  const selectedBlockedDateObj = selectedDate ? blockedDates.find((d) => d.date === selectedDate) : null
  const selectedBookings = selectedDate ? getBookingsForDate(selectedDate) : []
  const selectedBlockedHours = selectedDate ? getBlockedHoursForDate(selectedDate) : []

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-6 h-6 border-2 border-neutral-200 border-t-plum rounded-full animate-spin mx-auto" />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-2xl text-neutral-900 dark:text-neutral-100">Horario</h1>
        <p className="text-xs text-neutral-400 mt-0.5">Gestiona disponibilidad y bloqueos</p>
      </div>

      {/* Weekly schedule — responsive grid */}
      <div className="bg-white dark:bg-[#1e1e24] rounded-2xl border border-neutral-100 dark:border-white/8 p-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-3">Horario semanal</h2>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 text-center text-xs">
          {[1, 2, 3, 4, 5, 6, 0].map((dow) => {
            const day = WEEK_SCHEDULE[dow]
            return (
              <div key={dow} className={`rounded-xl px-1.5 py-2.5 border ${
                day?.open
                  ? 'bg-white dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/30'
                  : 'bg-white dark:bg-white/4 border-neutral-100 dark:border-white/6'
              }`}>
                <p className={`font-bold text-[11px] mb-1 ${day?.open ? 'text-neutral-700 dark:text-neutral-300' : 'text-neutral-300 dark:text-neutral-600'}`}>{DAY_NAMES[dow]}</p>
                {day?.open ? (
                  day.blocks.map((b, i) => (
                    <p key={i} className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium leading-tight">{b.start}<br />{b.end}</p>
                  ))
                ) : (
                  <p className="text-[10px] text-neutral-200 dark:text-neutral-700 font-medium">—</p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Interactive calendar */}
        <div className="bg-white dark:bg-[#1e1e24] rounded-2xl border border-neutral-100 dark:border-white/8 p-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-2 hover:bg-neutral-100 dark:hover:bg-white/8 rounded-lg transition-colors">
              <ChevronLeft className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
            </button>
            <h2 className="font-serif text-base capitalize text-neutral-900 dark:text-neutral-100">{monthName}</h2>
            <button onClick={nextMonth} className="p-2 hover:bg-neutral-100 dark:hover:bg-white/8 rounded-lg transition-colors">
              <ChevronRight className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs mb-1">
            {DAY_NAMES.map((d) => (
              <div key={d} className="py-1 text-neutral-400 dark:text-neutral-500 font-medium">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {monthDays.map((day, i) => {
              if (day === null) return <div key={`e-${i}`} />
              const dateStr = formatDateStr(currentYear, currentMonth, day)
              const dow = new Date(dateStr + 'T00:00:00').getDay()
              const isOpen = WEEK_SCHEDULE[dow]?.open ?? false
              const isBlocked = blockedDateSet.has(dateStr)
              const dayBookings = getBookingsForDate(dateStr)
              const dayBlockedHours = getBlockedHoursForDate(dateStr)
              const isSelected = selectedDate === dateStr
              const isToday = dateStr === now.toISOString().split('T')[0]

              let bg = 'bg-white dark:bg-transparent hover:bg-neutral-50 dark:hover:bg-white/5'
              if (isSelected) bg = 'bg-plum/15 dark:bg-plum/25 ring-2 ring-plum/40'
              else if (isBlocked) bg = 'bg-red-50/60 dark:bg-red-900/20 hover:bg-red-50 dark:hover:bg-red-900/30'
              else if (!isOpen) bg = 'bg-white dark:bg-white/3 hover:bg-neutral-50 dark:hover:bg-white/5'

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`relative rounded-lg p-1.5 text-sm transition-all ${bg} ${!isOpen && !isBlocked ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-700 dark:text-neutral-300'}`}
                >
                  <span className={`${isToday ? 'font-bold text-plum dark:text-lavender' : ''}`}>{day}</span>
                  <div className="flex items-center justify-center gap-0.5 mt-0.5">
                    {dayBookings.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-plum/60 dark:bg-lavender/70" />
                    )}
                    {dayBlockedHours.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                    )}
                    {isBlocked && (
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-4 mt-4 text-[10px] text-neutral-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-plum/60 dark:bg-lavender/70" /> Citas</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400" /> Horas bloq.</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" /> Día bloq.</span>
          </div>
        </div>

        {/* Right panel: selected day details */}
        <div className="space-y-4">
          {selectedDate ? (
            <>
              <div className="bg-white dark:bg-[#1e1e24] rounded-2xl border border-neutral-100 dark:border-white/8 p-4">
                <h3 className="font-serif text-base mb-1 capitalize text-neutral-900 dark:text-neutral-100">{formatDateFull(selectedDate)}</h3>
                {selectedDow !== null && (
                  <p className="text-xs text-neutral-400 mb-3">
                    {selectedSchedule?.open
                      ? `Horario: ${selectedSchedule.blocks.map((b) => `${b.start} - ${b.end}`).join(', ')}`
                      : 'Día cerrado (sin horario)'
                    }
                  </p>
                )}

                {/* Block/unblock full day */}
                {selectedIsBlocked ? (
                  <div className="flex items-center justify-between bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                    <div>
                      <p className="text-sm font-medium text-red-700 dark:text-red-400">Día bloqueado</p>
                      {selectedBlockedDateObj?.reason && (
                        <p className="text-xs text-red-500 dark:text-red-500/80">{selectedBlockedDateObj.reason}</p>
                      )}
                    </div>
                    <button
                      onClick={() => selectedBlockedDateObj && handleUnblockDate(selectedBlockedDateObj._id)}
                      className="text-xs bg-white dark:bg-white/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/40 rounded-full px-3 py-1 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                    >
                      Desbloquear
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={newDateReason}
                      onChange={(e) => setNewDateReason(e.target.value)}
                      placeholder="Motivo (opcional)"
                      className="flex-1 rounded-lg border border-neutral-200 dark:border-white/10 px-3 py-2 text-sm bg-white dark:bg-[#111115] dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-plum/30 placeholder:text-neutral-300 dark:placeholder:text-neutral-600"
                    />
                    <button
                      onClick={() => handleBlockDate(selectedDate)}
                      disabled={addingDate}
                      className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 px-4 rounded-full transition-colors disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <CalendarOff className="w-3.5 h-3.5" />
                      {addingDate ? 'Bloqueando...' : 'Bloquear día'}
                    </button>
                  </div>
                )}
              </div>

              {/* Block specific hours */}
              {!selectedIsBlocked && selectedSchedule?.open && (
                <div className="bg-white dark:bg-[#1e1e24] rounded-2xl border border-neutral-100 dark:border-white/8 p-4">
                  <h3 className="font-medium text-sm mb-3 flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
                    <Clock className="w-4 h-4 text-orange-400" />
                    Bloquear horas
                  </h3>
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <p className="text-[10px] uppercase tracking-wide text-neutral-400 mb-1">Desde</p>
                        <select
                          value={newHourStart}
                          onChange={(e) => setNewHourStart(e.target.value)}
                          className="w-full rounded-lg border border-neutral-200 dark:border-white/10 px-3 py-2 text-sm bg-white dark:bg-[#111115] dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-plum/30 cursor-pointer"
                        >
                          <option value="">— hora —</option>
                          {TIME_SLOTS.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] uppercase tracking-wide text-neutral-400 mb-1">Hasta</p>
                        <select
                          value={newHourEnd}
                          onChange={(e) => setNewHourEnd(e.target.value)}
                          className="w-full rounded-lg border border-neutral-200 dark:border-white/10 px-3 py-2 text-sm bg-white dark:bg-[#111115] dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-plum/30 cursor-pointer"
                        >
                          <option value="">— hora —</option>
                          {TIME_SLOTS.filter((t) => !newHourStart || t > newHourStart).map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newHourReason}
                        onChange={(e) => setNewHourReason(e.target.value)}
                        placeholder="Motivo (opcional)"
                        className="flex-1 rounded-lg border border-neutral-200 dark:border-white/10 px-3 py-2 text-sm bg-white dark:bg-[#111115] dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-plum/30 placeholder:text-neutral-300 dark:placeholder:text-neutral-600"
                      />
                      <button
                        onClick={handleBlockHour}
                        disabled={!newHourStart || !newHourEnd || addingHour}
                        className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 px-4 rounded-full transition-colors disabled:opacity-50 shrink-0"
                      >
                        {addingHour ? '...' : 'Bloquear'}
                      </button>
                    </div>
                  </div>

                  {selectedBlockedHours.length > 0 && (
                    <div className="space-y-1.5">
                      {selectedBlockedHours.map((bh) => (
                        <div key={bh._id} className="flex items-center justify-between bg-orange-50 dark:bg-orange-900/20 rounded-lg px-3 py-2">
                          <div>
                            <span className="text-sm font-medium text-orange-700 dark:text-orange-400">{bh.startTime} – {bh.endTime}</span>
                            {bh.reason && <span className="text-xs text-orange-500 dark:text-orange-500/80 ml-2">{bh.reason}</span>}
                          </div>
                          <button
                            onClick={() => handleUnblockHour(bh._id)}
                            className="text-orange-400 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Bookings for this day */}
              <div className="bg-white dark:bg-[#1e1e24] rounded-2xl border border-neutral-100 dark:border-white/8 p-4">
                <h3 className="font-medium text-sm mb-3 text-neutral-900 dark:text-neutral-100">Citas del día</h3>
                {selectedBookings.length === 0 ? (
                  <p className="text-xs text-neutral-400">No hay citas</p>
                ) : (
                  <div className="space-y-2">
                    {selectedBookings
                      .sort((a, b) => a.startTime.localeCompare(b.startTime))
                      .map((b) => (
                        <div key={b._id} className="flex items-center justify-between text-sm border-b border-neutral-50 dark:border-white/5 pb-2 last:border-0">
                          <div>
                            <span className="font-medium text-neutral-800 dark:text-neutral-200">{b.startTime} – {b.endTime}</span>
                            <span className="text-neutral-400 mx-1.5">&middot;</span>
                            <span className="text-neutral-600 dark:text-neutral-400">{(b.services || []).map((s) => s.name).join(', ')}</span>
                          </div>
                          <div className="text-xs text-neutral-400">
                            {b.user?.name}
                            <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${
                              b.status === 'confirmada' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                              b.status === 'pendiente' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                              'bg-neutral-100 dark:bg-white/8 text-neutral-500 dark:text-neutral-400'
                            }`}>
                              {b.status}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white dark:bg-[#1e1e24] rounded-2xl border border-neutral-100 dark:border-white/8 p-8 text-center">
              <CalendarOff className="w-8 h-8 text-neutral-200 dark:text-neutral-700 mx-auto mb-3" />
              <p className="text-sm text-neutral-400">Selecciona un día para ver detalles y gestionar bloqueos</p>
            </div>
          )}
        </div>
      </div>

      {/* All blocked dates summary */}
      {blockedDates.length > 0 && (
        <div className="bg-white dark:bg-[#1e1e24] rounded-2xl border border-neutral-100 dark:border-white/8 p-4">
          <h2 className="font-medium mb-3 text-sm flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
            <CalendarOff className="w-4 h-4 text-red-400" />
            Todas las fechas bloqueadas
          </h2>
          <div className="space-y-1.5">
            {blockedDates.map((d) => (
              <div key={d._id} className="flex items-center justify-between py-1.5 border-b border-neutral-50 dark:border-white/5 last:border-0">
                <div>
                  <span className="text-sm font-medium capitalize text-neutral-800 dark:text-neutral-200">{formatDateFull(d.date)}</span>
                  {d.reason && <span className="text-xs text-neutral-400 ml-2">{d.reason}</span>}
                </div>
                <button
                  onClick={() => handleUnblockDate(d._id)}
                  className="text-neutral-400 hover:text-red-500 p-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
