'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface BookingData {
  _id: string
  service: { name: string; category: string; price: number; duration: number }
  user: { name: string; email: string; phone: string }
  date: string
  startTime: string
  endTime: string
  status: string
  quantity?: number
  notes?: string
  createdAt: string
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingData[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setBookings(data)
    } catch {
      toast.error('Error al cargar reservas')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) {
        toast.error('Error al actualizar')
        return
      }

      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
      )
      toast.success('Estado actualizado')
    } catch {
      toast.error('Error de conexion')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminar esta reserva permanentemente?')) return
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        toast.error('Error al eliminar')
        return
      }
      setBookings((prev) => prev.filter((b) => b._id !== id))
      toast.success('Reserva eliminada')
    } catch {
      toast.error('Error de conexion')
    }
  }

  const formatDateFull = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  }

  const formatDateShort = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const statusColors: Record<string, string> = {
    confirmada: 'bg-green-50 text-green-700',
    pendiente: 'bg-yellow-50 text-yellow-700',
    cancelada: 'bg-red-50 text-red-700',
    completada: 'bg-neutral-100 text-neutral-600',
  }

  const filtered = bookings
    .filter((b) => statusFilter === 'all' || b.status === statusFilter)
    .filter(
      (b) =>
        !search ||
        b.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        b.service?.name?.toLowerCase().includes(search.toLowerCase()) ||
        b.user?.email?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date)
      if (dateCompare !== 0) return dateCompare
      return (b.startTime || '').localeCompare(a.startTime || '')
    })

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-6 h-6 border-2 border-neutral-200 border-t-[#CDB4DB] rounded-full animate-spin mx-auto" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-serif text-2xl mb-6">Reservas</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, servicio o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#CDB4DB] focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-neutral-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#CDB4DB]"
          >
            <option value="all">Todos</option>
            <option value="confirmada">Confirmadas</option>
            <option value="pendiente">Pendientes</option>
            <option value="cancelada">Canceladas</option>
            <option value="completada">Completadas</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center text-neutral-400">
          No hay reservas
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="space-y-3 lg:hidden">
            {filtered.map((b) => (
              <div key={b._id} className="bg-white rounded-xl border border-neutral-200 p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-sm">{b.user?.name || '—'}</p>
                    <p className="text-xs text-neutral-400">{b.user?.email}</p>
                    {b.user?.phone && <p className="text-xs text-neutral-400">{b.user.phone}</p>}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColors[b.status] || ''}`}>
                    {b.status}
                  </span>
                </div>
                <p className="text-sm font-medium text-[#9b7fa8]">
                  {b.service?.name || '—'}{b.quantity && b.quantity > 1 ? ` x${b.quantity}` : ''}
                </p>
                <div className="mt-2 flex items-center gap-3 text-xs text-neutral-500">
                  <span className="capitalize">{formatDateFull(b.date)}</span>
                </div>
                <div className="mt-1 flex items-center gap-3 text-sm">
                  <span className="font-semibold">{b.startTime} - {b.endTime}</span>
                  <span className="text-neutral-400">&middot;</span>
                  <span className="text-neutral-500">{(b.service?.price ?? 0) * (b.quantity || 1)}&euro;</span>
                </div>
                {b.notes && <p className="mt-2 text-xs text-neutral-400 italic">{b.notes}</p>}
                <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center gap-2">
                  <select
                    value={b.status}
                    onChange={(e) => handleStatusChange(b._id, e.target.value)}
                    className="text-xs border border-neutral-200 rounded-lg px-3 py-1.5 flex-1"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmada">Confirmada</option>
                    <option value="completada">Completada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                  {b.status === 'cancelada' && (
                    <button
                      onClick={() => handleDelete(b._id)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden lg:block bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-neutral-500">Cliente</th>
                    <th className="text-left px-4 py-3 font-medium text-neutral-500">Servicio</th>
                    <th className="text-left px-4 py-3 font-medium text-neutral-500">Dia</th>
                    <th className="text-left px-4 py-3 font-medium text-neutral-500">Hora</th>
                    <th className="text-left px-4 py-3 font-medium text-neutral-500">Precio</th>
                    <th className="text-left px-4 py-3 font-medium text-neutral-500">Estado</th>
                    <th className="text-left px-4 py-3 font-medium text-neutral-500">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filtered.map((b) => (
                    <tr key={b._id} className="hover:bg-neutral-50/50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{b.user?.name || '—'}</p>
                          <p className="text-xs text-neutral-400">{b.user?.email}</p>
                          {b.user?.phone && <p className="text-xs text-neutral-400">{b.user.phone}</p>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p>{b.service?.name || '—'}{b.quantity && b.quantity > 1 ? ` x${b.quantity}` : ''}</p>
                        <p className="text-xs text-neutral-400">{b.service?.category}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="capitalize">{formatDateFull(b.date)}</p>
                        <p className="text-xs text-neutral-400">{formatDateShort(b.date)}</p>
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {b.startTime} - {b.endTime}
                      </td>
                      <td className="px-4 py-3">{(b.service?.price ?? 0) * (b.quantity || 1)}&euro;</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[b.status] || ''}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <select
                            value={b.status}
                            onChange={(e) => handleStatusChange(b._id, e.target.value)}
                            className="text-xs border border-neutral-200 rounded px-2 py-1"
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="confirmada">Confirmada</option>
                            <option value="completada">Completada</option>
                            <option value="cancelada">Cancelada</option>
                          </select>
                          {b.status === 'cancelada' && (
                            <button
                              onClick={() => handleDelete(b._id)}
                              className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
