'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BookOpen } from 'lucide-react'
import { toast } from 'sonner'
import { CourseTypeSelector } from './course-type-selector'
import { CourseInfoPanel } from './course-info-panel'
import { CourseDatePicker } from './course-date-picker'
import { CourseConfirmPanel } from './course-confirm-panel'

type CourseType = 'manic-0.0' | 'perfeccionamiento'

const COURSE_CONFIG: Record<CourseType, { label: string; price: string; days: number; schedule: { label: string; time: string; desc: string }[] }> = {
  'manic-0.0': {
    label: 'MANIC 0.0', price: '749,99€', days: 3,
    schedule: [
      { label: 'Día 1', time: '11:00 – 14:00 y 15:00 – fin', desc: 'Introducción y técnica base' },
      { label: 'Día 2', time: '10:00 – 14:00 y 15:00 – fin', desc: 'Práctica avanzada' },
      { label: 'Día 3', time: '10:00 – fin', desc: 'Perfeccionamiento y diploma' },
    ],
  },
  'perfeccionamiento': {
    label: 'Perfeccionamiento', price: '349,99€', days: 1,
    schedule: [{ label: 'Día 1', time: '10:00 – fin', desc: '2 modelos reales + trucos y optimización' }],
  },
}

export function CourseBookingForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialType = (searchParams.get('type') as CourseType) || 'manic-0.0'
  const [courseType, setCourseType] = useState<CourseType>(initialType === 'perfeccionamiento' ? 'perfeccionamiento' : 'manic-0.0')
  const [availableDates, setAvailableDates] = useState<string[]>([])
  const [selectedDate, setSelectedDate]     = useState<string | null>(null)
  const [notes, setNotes]       = useState('')
  const [loading, setLoading]   = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { fetchAvailability(courseType) }, [courseType])

  const fetchAvailability = async (type: CourseType) => {
    setLoading(true); setSelectedDate(null)
    try {
      const res = await fetch(`/api/course-availability?weeks=12&type=${type}`)
      const json = await res.json()
      setAvailableDates(json.data?.availableStartDates ?? [])
    } catch { toast.error('Error al cargar disponibilidad') }
    finally { setLoading(false) }
  }

  const getCourseDays = (startDate: string): string[] => {
    if (courseType === 'perfeccionamiento') return [startDate]
    const days: string[] = []
    const cursor = new Date(startDate + 'T00:00:00')
    while (days.length < 3) {
      const dow = cursor.getDay()
      if (dow !== 0 && dow !== 6) days.push(cursor.toISOString().split('T')[0])
      cursor.setDate(cursor.getDate() + 1)
    }
    return days
  }

  const formatDate = (d: string) =>
    new Date(d + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })

  const formatDateFull = (d: string) =>
    new Date(d + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })

  const handleSubmit = async () => {
    if (!selectedDate) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/course-bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate: selectedDate, courseType, notes: notes || undefined }),
      })
      const json = await res.json()
      if (!res.ok) {
        toast.error(json.error || 'Error al reservar el curso')
        if (res.status === 409) { fetchAvailability(courseType); setSelectedDate(null) }
        return
      }
      toast.success('¡Curso reservado correctamente!')
      router.push('/dashboard')
    } catch { toast.error('Error de conexión') }
    finally { setSubmitting(false) }
  }

  const config = COURSE_CONFIG[courseType]
  const courseDays = selectedDate ? getCourseDays(selectedDate) : []

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <BookOpen className="w-12 h-12 text-lavender mx-auto mb-3" />
        <h1 className="font-serif text-2xl mb-2">Reservar Curso de Manicura</h1>
      </div>

      <CourseTypeSelector courseType={courseType} onChange={setCourseType} />
      <CourseInfoPanel schedule={config.schedule} price={config.price} />
      <CourseDatePicker
        courseType={courseType} days={config.days} loading={loading}
        availableDates={availableDates} selectedDate={selectedDate} onSelect={setSelectedDate}
        getCourseDays={getCourseDays} formatDate={formatDate} formatDateFull={formatDateFull}
      />
      {selectedDate && (
        <CourseConfirmPanel
          courseDays={courseDays} schedule={config.schedule} price={config.price}
          notes={notes} submitting={submitting} formatDateFull={formatDateFull}
          onNotesChange={setNotes} onSubmit={handleSubmit}
        />
      )}
    </div>
  )
}
