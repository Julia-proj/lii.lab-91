'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { Lock, Phone, User } from 'lucide-react'

export function ProfileForm() {
  const { data: session, update } = useSession()
  const [form, setForm]     = useState({ name: '', phone: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session?.user) fetchProfile()
  }, [session])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/auth/profile')
      if (res.ok) {
        const data = await res.json()
        setForm({ name: data.name || '', phone: data.phone || '' })
      }
    } catch {
      setForm({ name: session?.user?.name || '', phone: '' })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || 'Error al actualizar perfil')
        return
      }
      toast.success('Perfil actualizado')
      update()
    } catch {
      toast.error('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const firstName = session?.user?.name?.split(' ')[0] || '?'
  const initial   = firstName[0]?.toUpperCase() || '?'
  const email     = session?.user?.email || ''

  return (
    <div className="space-y-5 max-w-lg">
      {/* Avatar card */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm px-5 py-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-lavender/20 border border-lavender/40 flex items-center justify-center shrink-0">
          <span className="text-xl font-bold text-plum">{initial}</span>
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-neutral-900 text-base truncate">{session?.user?.name || '—'}</p>
          <p className="text-sm text-neutral-400 truncate">{email}</p>
        </div>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="px-5 pt-5 pb-1">
          <p className="text-[11px] uppercase tracking-[0.15em] text-neutral-400 font-medium">
            Datos personales
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-5 pt-4 pb-5 space-y-4">
          {/* Email — locked */}
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1.5">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                disabled
                value={email}
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm bg-neutral-50 text-neutral-400 pr-10"
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-300" />
            </div>
            <p className="text-[11px] text-neutral-300 mt-1">No se puede cambiar</p>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-xs font-medium text-neutral-500 mb-1.5">
              Nombre completo
            </label>
            <div className="relative">
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Tu nombre"
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-plum/30 focus:border-plum/40 transition-all pr-10"
              />
              <User className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-300" />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-xs font-medium text-neutral-500 mb-1.5">
              Teléfono
            </label>
            <div className="relative">
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+34 600 000 000"
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-plum/30 focus:border-plum/40 transition-all pr-10"
              />
              <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-300" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-plum hover:bg-plum-hover text-white font-semibold py-3.5 rounded-xl transition-colors text-sm disabled:opacity-60 mt-2"
          >
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  )
}
