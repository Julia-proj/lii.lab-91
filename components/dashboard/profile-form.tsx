'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

export function ProfileForm() {
  const { data: session, update } = useSession()
  const [form, setForm] = useState({ name: '', phone: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session?.user) {
      fetchProfile()
    }
  }, [session])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/auth/profile')
      if (res.ok) {
        const data = await res.json()
        setForm({ name: data.name || '', phone: data.phone || '' })
      }
    } catch {
      // Use session data as fallback
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
      update() // Refresh session
    } catch {
      toast.error('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md">
      <h2 className="font-serif text-lg mb-4">Mi perfil</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            disabled
            value={session?.user?.email || ''}
            className="w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm bg-neutral-50 text-neutral-500"
          />
          <p className="text-xs text-neutral-400 mt-1">El email no se puede cambiar</p>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
            Nombre
          </label>
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#CDB4DB] focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
            Teléfono
          </label>
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#CDB4DB] focus:border-transparent"
            placeholder="+34 600 000 000"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#B48EC5] hover:bg-[#a37ab5] text-white font-semibold py-2.5 px-6 rounded-full transition-colors text-sm disabled:opacity-60 shadow-sm hover:shadow-md"
        >
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  )
}
