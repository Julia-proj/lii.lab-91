'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, CheckCircle, MapPin, Euro, Clock, BookOpen } from 'lucide-react'
import { toast } from 'sonner'

export function CourseBookingForm() {
  const router = useRouter()
  const [availableDates, setAvailableDates] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchAvailability()
  }, [])

  const fetchAvailability = async () => {
    try {
      const res = await fetch('/api/course-availability?weeks=12')
      const data = await res.json()
      setAvailableDates(data.availableStartDates || [])
    } catch {
      toast.error('Error al cargar disponibilidad')
    } finally {
      setLoading(false)
    }
  }

  const getCourseDays = (startDate: string): string[] => {
    const days: string[] = []
    const date = new Date(startDate + 'T00:00:00')
    let cursor = new Date(date)
    while (days.length < 3) {
      const dow = cursor.getDay()
      if (dow !== 0 && dow !== 6) {
        days.push(cursor.toISOString().split('T')[0])
      }
      cursor.setDate(cursor.getDate() + 1)
    }
    return days
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    })
  }

  const formatDateFull = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  }

  const handleSubmit = async () => {
    if (!selectedDate) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/course-bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate: selectedDate, notes: notes || undefined }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Error al reservar el curso')
        if (res.status === 409) {
          fetchAvailability()
          setSelectedDate(null)
        }
        return
      }

      toast.success('¡Curso reservado correctamente!')
      router.push('/dashboard')
    } catch {
      toast.error('Error de conexión')
    } finally {
      setSubmitting(false)
    }
  }

  const courseDays = selectedDate ? getCourseDays(selectedDate) : []

  const courseSchedule = [
    { label: 'Día 1', time: '11:00 – 14:00 y 15:00 – fin', desc: 'Introducción y técnica base' },
    { label: 'Día 2', time: '10:00 – 14:00 y 15:00 – fin', desc: 'Práctica avanzada' },
    { label: 'Día 3', time: '10:00 – fin', desc: 'Perfeccionamiento y diploma' },
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <BookOpen className="w-12 h-12 text-[#CDB4DB] mx-auto mb-3" />
        <h1 className="font-serif text-2xl mb-2">Reservar Curso de Manicura</h1>
        <p className="text-neutral-500 text-sm">
          Curso intensivo de 3 días · 800€ · Kit + Guía incluidos
        </p>
      </div>

      {/* Course info card */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h3 className="font-medium mb-3">Programa del curso</h3>
        <div className="space-y-3">
          {courseSchedule.map((day, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <span className="bg-[#CDB4DB]/20 text-[#8e7f97] px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap">
                {day.label}
              </span>
              <div>
                <p className="text-neutral-700">{day.desc}</p>
                <p className="text-neutral-400 text-xs">{day.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-neutral-100 flex flex-wrap gap-4 text-sm text-neutral-500">
          <span className="flex items-center gap-1.5">
            <Euro className="w-4 h-4 text-[#CDB4DB]" /> 800€ · Pago en el salón
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#CDB4DB]" /> Valdemoro, Madrid
          </span>
        </div>
      </div>

      {/* Date selection */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h3 className="font-medium mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#CDB4DB]" />
          Selecciona fecha de inicio
        </h3>

        {loading ? (
          <div className="text-center py-8">
            <div className="w-6 h-6 border-2 border-neutral-200 border-t-[#CDB4DB] rounded-full animate-spin mx-auto" />
            <p className="text-sm text-neutral-400 mt-2">Cargando disponibilidad...</p>
          </div>
        ) : availableDates.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-neutral-500">No hay fechas disponibles en las próximas semanas.</p>
            <p className="text-sm text-neutral-400 mt-1">
              Contacta con nosotros por Instagram para más información.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availableDates.slice(0, 12).map((dateStr) => {
              const days = getCourseDays(dateStr)
              const isSelected = selectedDate === dateStr

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-[#CDB4DB] bg-[#CDB4DB]/5 ring-2 ring-[#CDB4DB]/30'
                      : 'border-neutral-200 hover:border-[#CDB4DB]/50'
                  }`}
                >
                  <p className="font-medium text-sm capitalize">{formatDateFull(dateStr)}</p>
                  <p className="text-xs text-neutral-400 mt-1">
                    3 días: {days.map((d) => formatDate(d)).join(' → ')}
                  </p>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Confirmation */}
      {selectedDate && (
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Confirmar reserva
          </h3>

          <div className="space-y-2 text-sm mb-4">
            {courseDays.map((d, i) => (
              <div key={d} className="flex items-center gap-2 text-neutral-600">
                <span className="text-xs font-medium text-[#8e7f97] bg-[#CDB4DB]/10 px-2 py-0.5 rounded">
                  Día {i + 1}
                </span>
                <span className="capitalize">{formatDateFull(d)}</span>
                <span className="text-neutral-400">{courseSchedule[i].time}</span>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <label htmlFor="notes" className="text-sm text-neutral-500 mb-1 block">
              Notas (opcional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#CDB4DB] focus:border-transparent"
              rows={2}
              placeholder="Cualquier información adicional..."
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-[#B48EC5] hover:bg-[#a37ab5] text-white font-semibold py-3 rounded-full transition-colors disabled:opacity-60 shadow-sm hover:shadow-md"
          >
            {submitting ? 'Reservando...' : 'Confirmar reserva del curso'}
          </button>

          <p className="text-xs text-neutral-400 text-center mt-3">
            El pago de 800€ se realiza en el salón
          </p>
        </div>
      )}
    </div>
  )
}
