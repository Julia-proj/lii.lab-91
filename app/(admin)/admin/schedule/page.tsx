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
  service: { name: string }
  user: { name: string }
  status: string
}

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']
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
        <div className="w-6 h-6 border-2 border-neutral-200 border-t-[#CDB4DB] rounded-full animate-spin mx-auto" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-serif text-2xl mb-6">Gestion de horario</h1>

      {/* Weekly schedule overview */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 mb-6">
        <h2 className="font-medium mb-3 text-sm">Horario semanal</h2>
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {[1, 2, 3, 4, 5, 6, 0].map((dow) => {
            const day = WEEK_SCHEDULE[dow]
            return (
              <div key={dow} className={`rounded-lg p-2 ${day?.open ? 'bg-green-50' : 'bg-neutral-50'}`}>
                <p className="font-semibold mb-1">{DAY_NAMES[dow]}</p>
                {day?.open ? (
                  day.blocks.map((b, i) => (
                    <p key={i} className="text-green-700">{b.start}-{b.end}</p>
                  ))
                ) : (
                  <p className="text-neutral-400">Cerrado</p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive calendar */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="font-serif text-base capitalize">{monthName}</h2>
            <button onClick={nextMonth} className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs mb-1">
            {DAY_NAMES.map((d) => (
              <div key={d} className="py-1 text-neutral-400 font-medium">{d}</div>
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

              let bg = 'bg-white hover:bg-neutral-50'
              if (isSelected) bg = 'bg-[#CDB4DB]/20 ring-2 ring-[#CDB4DB]'
              else if (isBlocked) bg = 'bg-red-50 hover:bg-red-100'
              else if (!isOpen) bg = 'bg-neutral-50'

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`relative rounded-lg p-1.5 text-sm transition-all ${bg} ${!isOpen && !isBlocked ? 'text-neutral-300' : 'text-neutral-700'}`}
                >
                  <span className={`${isToday ? 'font-bold text-[#9b7fa8]' : ''}`}>{day}</span>
                  <div className="flex items-center justify-center gap-0.5 mt-0.5">
                    {dayBookings.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#CDB4DB]" />
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
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#CDB4DB]" /> Citas</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400" /> Horas bloq.</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" /> Dia bloq.</span>
          </div>
        </div>

        {/* Right panel: selected day details */}
        <div className="space-y-4">
          {selectedDate ? (
            <>
              <div className="bg-white rounded-xl border border-neutral-200 p-4">
                <h3 className="font-serif text-base mb-1 capitalize">{formatDateFull(selectedDate)}</h3>
                {selectedDow !== null && (
                  <p className="text-xs text-neutral-400 mb-3">
                    {selectedSchedule?.open
                      ? `Horario: ${selectedSchedule.blocks.map((b) => `${b.start} - ${b.end}`).join(', ')}`
                      : 'Dia cerrado (sin horario)'
                    }
                  </p>
                )}

                {/* Block/unblock full day */}
                {selectedIsBlocked ? (
                  <div className="flex items-center justify-between bg-red-50 rounded-lg p-3">
                    <div>
                      <p className="text-sm font-medium text-red-700">Dia bloqueado</p>
                      {selectedBlockedDateObj?.reason && (
                        <p className="text-xs text-red-500">{selectedBlockedDateObj.reason}</p>
                      )}
                    </div>
                    <button
                      onClick={() => selectedBlockedDateObj && handleUnblockDate(selectedBlockedDateObj._id)}
                      className="text-xs bg-white text-red-600 border border-red-200 rounded-full px-3 py-1 hover:bg-red-50 transition-colors"
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
                      className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#CDB4DB]"
                    />
                    <button
                      onClick={() => handleBlockDate(selectedDate)}
                      disabled={addingDate}
                      className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 px-4 rounded-full transition-colors disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <CalendarOff className="w-3.5 h-3.5" />
                      {addingDate ? 'Bloqueando...' : 'Bloquear dia'}
                    </button>
                  </div>
                )}
              </div>

              {/* Block specific hours */}
              {!selectedIsBlocked && selectedSchedule?.open && (
                <div className="bg-white rounded-xl border border-neutral-200 p-4">
                  <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-400" />
                    Bloquear horas
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="time"
                        value={newHourStart}
                        onChange={(e) => setNewHourStart(e.target.value)}
                        className="rounded-lg border border-neutral-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#CDB4DB]"
                      />
                      <span className="text-neutral-400 text-xs">a</span>
                      <input
                        type="time"
                        value={newHourEnd}
                        onChange={(e) => setNewHourEnd(e.target.value)}
                        className="rounded-lg border border-neutral-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#CDB4DB]"
                      />
                    </div>
                    <input
                      type="text"
                      value={newHourReason}
                      onChange={(e) => setNewHourReason(e.target.value)}
                      placeholder="Motivo"
                      className="flex-1 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#CDB4DB]"
                    />
                    <button
                      onClick={handleBlockHour}
                      disabled={!newHourStart || !newHourEnd || addingHour}
                      className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-1.5 px-4 rounded-full transition-colors disabled:opacity-50"
                    >
                      {addingHour ? '...' : 'Bloquear'}
                    </button>
                  </div>

                  {selectedBlockedHours.length > 0 && (
                    <div className="space-y-1.5">
                      {selectedBlockedHours.map((bh) => (
                        <div key={bh._id} className="flex items-center justify-between bg-orange-50 rounded-lg px-3 py-2">
                          <div>
                            <span className="text-sm font-medium text-orange-700">{bh.startTime} - {bh.endTime}</span>
                            {bh.reason && <span className="text-xs text-orange-500 ml-2">{bh.reason}</span>}
                          </div>
                          <button
                            onClick={() => handleUnblockHour(bh._id)}
                            className="text-orange-400 hover:text-red-500 transition-colors"
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
              <div className="bg-white rounded-xl border border-neutral-200 p-4">
                <h3 className="font-medium text-sm mb-3">Citas del dia</h3>
                {selectedBookings.length === 0 ? (
                  <p className="text-xs text-neutral-400">No hay citas</p>
                ) : (
                  <div className="space-y-2">
                    {selectedBookings
                      .sort((a, b) => a.startTime.localeCompare(b.startTime))
                      .map((b) => (
                        <div key={b._id} className="flex items-center justify-between text-sm border-b border-neutral-50 pb-2 last:border-0">
                          <div>
                            <span className="font-medium">{b.startTime} - {b.endTime}</span>
                            <span className="text-neutral-400 mx-1.5">&middot;</span>
                            <span className="text-neutral-600">{b.service?.name}</span>
                          </div>
                          <div className="text-xs text-neutral-400">
                            {b.user?.name}
                            <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${
                              b.status === 'confirmada' ? 'bg-green-50 text-green-600' :
                              b.status === 'pendiente' ? 'bg-yellow-50 text-yellow-600' :
                              'bg-neutral-100 text-neutral-500'
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
            <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center text-neutral-400 text-sm">
              Selecciona un dia en el calendario para ver detalles y bloquear fechas u horas
            </div>
          )}
        </div>
      </div>

      {/* All blocked dates summary */}
      {blockedDates.length > 0 && (
        <div className="bg-white rounded-xl border border-neutral-200 p-4 mt-6">
          <h2 className="font-medium mb-3 text-sm flex items-center gap-2">
            <CalendarOff className="w-4 h-4 text-red-400" />
            Todas las fechas bloqueadas
          </h2>
          <div className="space-y-1.5">
            {blockedDates.map((d) => (
              <div key={d._id} className="flex items-center justify-between py-1.5 border-b border-neutral-50 last:border-0">
                <div>
                  <span className="text-sm font-medium capitalize">{formatDateFull(d.date)}</span>
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
