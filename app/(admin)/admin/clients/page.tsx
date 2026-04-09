'use client'

import { useState, useEffect } from 'react'
import { Search, Users, Calendar, TrendingUp, Phone, Mail } from 'lucide-react'
import { toast } from 'sonner'

interface Client {
  _id: string
  name: string
  email: string
  phone?: string
  createdAt: string
  bookingCount: number
  lastVisit: string | null
  totalSpent: number
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/admin/clients')
      .then((r) => r.json())
      .then((json) => setClients(json.data ?? []))
      .catch(() => toast.error('Error al cargar clientes'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone && c.phone.includes(search))
  )

  const fmt = (d: string) =>
    new Date(d + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-neutral-900 dark:text-neutral-100">Clientes</h1>
          <p className="text-xs text-neutral-400 mt-0.5">{clients.length} registradas</p>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total clientes', value: clients.length, icon: Users, color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Con citas', value: clients.filter(c => c.bookingCount > 0).length, icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Ingresos totales', value: `${clients.reduce((s, c) => s + c.totalSpent, 0).toFixed(0)}€`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className={`${s.bg} rounded-xl p-3 border border-black/[0.04]`}>
              <Icon className={`w-4 h-4 ${s.color} mb-1.5`} />
              <p className={`text-lg font-bold leading-none ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-neutral-500 mt-1">{s.label}</p>
            </div>
          )
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Buscar por nombre, email o teléfono..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-plum/30 bg-white dark:bg-card dark:border-white/10"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-card rounded-2xl border border-neutral-100 dark:border-white/8 overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-sm text-neutral-400 py-10 text-center">No hay clientes</p>
        ) : (
          <div className="divide-y divide-neutral-50 dark:divide-white/5">
            {filtered.map((client) => (
              <div key={client._id} className="flex items-start gap-4 px-5 py-4 hover:bg-neutral-50/50 dark:hover:bg-white/3 transition-colors">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-plum/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-plum">
                    {client.name[0].toUpperCase()}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">{client.name}</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                    <span className="flex items-center gap-1 text-xs text-neutral-400">
                      <Mail className="w-3 h-3" />{client.email}
                    </span>
                    {client.phone && (
                      <span className="flex items-center gap-1 text-xs text-neutral-400">
                        <Phone className="w-3 h-3" />{client.phone}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-300 mt-1">
                    Registrada {fmt(client.createdAt.split('T')[0])}
                  </p>
                </div>

                {/* Stats */}
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-neutral-800 dark:text-neutral-100">
                    {client.bookingCount} {client.bookingCount === 1 ? 'cita' : 'citas'}
                  </p>
                  {client.totalSpent > 0 && (
                    <p className="text-xs text-emerald-600 font-medium">{client.totalSpent.toFixed(0)}€</p>
                  )}
                  {client.lastVisit && (
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Última: {fmt(client.lastVisit)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
