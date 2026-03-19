'use client'

import { useState, useEffect } from 'react'
import { GraduationCap, Calendar, User, Check, X, Clock } from 'lucide-react'
import { toast } from 'sonner'

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
  'manic-0.0':       { label: 'MANIC 0.0',         price: '749,99€', color: 'text-plum',       bg: 'bg-plum/10' },
  'perfeccionamiento':{ label: 'Perfeccionamiento', price: '349,99€', color: 'text-rose-600',   bg: 'bg-rose-50' },
}

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  confirmada: { label: 'Confirmada', cls: 'bg-emerald-50 text-emerald-700' },
  pendiente:  { label: 'Pendiente',  cls: 'bg-amber-50 text-amber-700' },
  cancelada:  { label: 'Cancelada',  cls: 'bg-neutral-100 text-neutral-500' },
}

export default function CoursesPage() {
  const [bookings, setBookings] = useState<CourseBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'manic-0.0' | 'perfeccionamiento'>('all')

  const load = () => {
    setLoading(true)
    fetch('/api/course-bookings')
      .then((r) => r.json())
      .then((data) => setBookings(Array.isArray(data) ? data : []))
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

  const fmt = (d: string) =>
    new Date(d + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.courseType === filter)
  const active = bookings.filter((b) => b.status !== 'cancelada')

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-neutral-200 border-t-plum rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl text-neutral-900 dark:text-neutral-100">Cursos</h1>
        <p className="text-xs text-neutral-400 mt-0.5">{active.length} inscripciones activas</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { type: 'manic-0.0',        label: 'MANIC 0.0',        price: '749,99€' },
          { type: 'perfeccionamiento', label: 'Perfeccionamiento', price: '349,99€' },
        ].map((c) => {
          const count = active.filter((b) => b.courseType === c.type).length
          const info = COURSE_LABELS[c.type]
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

      {/* Filter tabs */}
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
      <div className="bg-white dark:bg-[#1e1e24] rounded-2xl border border-neutral-100 dark:border-white/8 overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-sm text-neutral-400 py-10 text-center">No hay inscripciones</p>
        ) : (
          <div className="divide-y divide-neutral-50 dark:divide-white/5">
            {filtered.map((b) => {
              const info = COURSE_LABELS[b.courseType]
              const statusInfo = STATUS_MAP[b.status]
              return (
                <div key={b._id} className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg ${info.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                      <GraduationCap className={`w-4 h-4 ${info.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">{b.user?.name || '—'}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusInfo.cls}`}>{statusInfo.label}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${info.bg} ${info.color}`}>{info.label}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-neutral-400">
                        <User className="w-3 h-3" />
                        <span>{b.user?.email}</span>
                        {b.user?.phone && <><span>·</span><span>{b.user.phone}</span></>}
                      </div>
                      <div className="flex items-start gap-1 mt-1 text-xs text-neutral-500">
                        <Calendar className="w-3 h-3 shrink-0 mt-0.5" />
                        <span>{b.days.map(fmt).join(' · ')}</span>
                      </div>
                      {b.notes && (
                        <p className="text-xs text-neutral-400 mt-1 italic">"{b.notes}"</p>
                      )}
                      <div className="flex items-center gap-1 mt-1 text-[11px] text-neutral-300">
                        <Clock className="w-3 h-3" />
                        Registrado {new Date(b.createdAt).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className={`text-sm font-bold ${info.color}`}>{info.price}</p>
                      {b.status === 'pendiente' && (
                        <div className="flex gap-1 mt-2">
                          <button
                            onClick={() => updateStatus(b._id, 'confirmada')}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => updateStatus(b._id, 'cancelada')}
                            className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
