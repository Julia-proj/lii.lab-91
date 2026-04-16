'use client'

import { useState, useEffect } from 'react'
import { GraduationCap } from 'lucide-react'
import { toast } from 'sonner'
import { CourseBookingRow } from './course-booking-row'

interface CourseBooking {
  _id: string
  courseType: 'manic-0.0' | 'perfeccionamiento'
  startDate: string
  days: string[]
  status: 'pendiente' | 'confirmada' | 'cancelada'
  notes?: string
  createdAt: string
  user: { name: string; email: string; phone?: string }
}

const COURSE_LABELS: Record<string, { label: string; price: string; color: string; bg: string }> = {
  'manic-0.0':        { label: 'MANIC 0.0',         price: '749,99€', color: 'text-plum',     bg: 'bg-plum/10' },
  'perfeccionamiento': { label: 'Perfeccionamiento', price: '349,99€', color: 'text-stone-500 dark:text-stone-400', bg: 'bg-stone-100/70 dark:bg-stone-800/30' },
}

export default function CoursesPage() {
  const [bookings, setBookings] = useState<CourseBooking[]>([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState<'all' | 'manic-0.0' | 'perfeccionamiento'>('all')

  const load = () => {
    setLoading(true)
    fetch('/api/course-bookings')
      .then((r) => r.json())
      .then((json) => setBookings(json.data ?? []))
      .catch(() => toast.error('Error al cargar cursos'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/course-bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) { toast.success('Estado actualizado'); load() }
    else toast.error('Error al actualizar')
  }

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.courseType === filter)
  const active   = bookings.filter((b) => b.status !== 'cancelada')

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-neutral-200 border-t-plum rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-neutral-900 dark:text-neutral-100">Cursos</h1>
        <p className="text-xs text-neutral-400 mt-0.5">{active.length} inscripciones activas</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { type: 'manic-0.0',         label: 'MANIC 0.0',        price: '749,99€' },
          { type: 'perfeccionamiento',  label: 'Perfeccionamiento', price: '349,99€' },
        ].map((c) => {
          const count = active.filter((b) => b.courseType === c.type).length
          const info  = COURSE_LABELS[c.type]
          return (
            <div key={c.type} className={`${info.bg} rounded-xl p-4 border border-black/[0.04]`}>
              <GraduationCap className={`w-4 h-4 ${info.color} mb-2`} />
              <p className={`text-2xl font-bold ${info.color}`}>{count}</p>
              <p className="text-xs text-neutral-600 font-medium mt-0.5">{c.label}</p>
              <p className="text-[11px] text-neutral-400">{c.price}</p>
            </div>
          )
        })}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(['all', 'manic-0.0', 'perfeccionamiento'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === f
                ? 'bg-plum text-white'
                : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200 dark:bg-white/8 dark:text-neutral-400'
            }`}
          >
            {f === 'all' ? 'Todos' : f === 'manic-0.0' ? 'MANIC 0.0' : 'Perfeccionamiento'}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-white dark:bg-card rounded-2xl border border-neutral-100 dark:border-white/8 overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-sm text-neutral-400 py-10 text-center">No hay inscripciones</p>
        ) : (
          <div className="divide-y divide-neutral-50 dark:divide-white/5">
            {filtered.map((b) => (
              <CourseBookingRow key={b._id} booking={b} onUpdateStatus={updateStatus} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
