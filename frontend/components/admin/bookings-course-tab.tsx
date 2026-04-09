'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { toast } from 'sonner'
import { CourseBookingRow, type CourseBookingData } from '@/components/admin/course-booking-row'

export function BookingsCourseTab() {
  const [bookings, setBookings] = useState<CourseBookingData[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/course-bookings')
      .then((r) => r.json())
      .then((json) => setBookings(json.data ?? []))
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
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 text-sm bg-white dark:bg-card dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-plum/40 dark:placeholder:text-neutral-500"
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
