'use client'

import { Calendar } from 'lucide-react'

type CourseType = 'manic-0.0' | 'perfeccionamiento'

interface CourseDatePickerProps {
  courseType: CourseType
  days: number
  loading: boolean
  availableDates: string[]
  selectedDate: string | null
  onSelect: (date: string) => void
  getCourseDays: (startDate: string) => string[]
  formatDate: (dateStr: string) => string
  formatDateFull: (dateStr: string) => string
}

export function CourseDatePicker({
  days,
  loading,
  availableDates,
  selectedDate,
  onSelect,
  getCourseDays,
  formatDate,
  formatDateFull,
}: CourseDatePickerProps) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
      <h3 className="font-medium mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-lavender" />
        Selecciona fecha{days > 1 ? ' de inicio' : ''}
      </h3>

      {loading ? (
        <div className="text-center py-8">
          <div className="w-6 h-6 border-2 border-neutral-200 border-t-lavender rounded-full animate-spin mx-auto" />
          <p className="text-sm text-neutral-500 mt-2">Cargando disponibilidad...</p>
        </div>
      ) : availableDates.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-neutral-500">No hay fechas disponibles en las próximas semanas.</p>
          <p className="text-sm text-neutral-500 mt-1">
            Contacta con nosotros por Instagram para más información.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {availableDates.slice(0, 12).map((dateStr) => {
            const courseDays = getCourseDays(dateStr)
            const isSelected = selectedDate === dateStr
            return (
              <button
                key={dateStr}
                onClick={() => onSelect(dateStr)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-lavender bg-lavender/5 ring-2 ring-lavender/30'
                    : 'border-neutral-200 hover:border-lavender/50'
                }`}
              >
                <p className="font-medium text-sm capitalize">{formatDateFull(dateStr)}</p>
                {days > 1 ? (
                  <p className="text-xs text-neutral-500 mt-1">
                    3 días: {courseDays.map((d) => formatDate(d)).join(' → ')}
                  </p>
                ) : (
                  <p className="text-xs text-neutral-500 mt-1">1 día intensivo</p>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
