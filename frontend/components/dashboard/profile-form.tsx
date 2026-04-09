'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { Lock, Phone, User } from 'lucide-react'
import { profileSchema, type ProfileInput } from '@/shared/validators'

export function ProfileForm() {
  const { data: session, update } = useSession()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    if (session?.user) fetchProfile()
  }, [session])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/auth/profile')
      if (res.ok) {
        const json = await res.json()
        const data = json.data
        reset({ name: data?.name || '', phone: data?.phone || '' })
      }
    } catch {
      reset({ name: session?.user?.name || '', phone: '' })
    }
  }

  const onSubmit = async (data: ProfileInput) => {
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const json = await res.json()
        toast.error(json.error || 'Error al actualizar perfil')
        return
      }
      toast.success('Perfil actualizado')
      update()
    } catch {
      toast.error('Error de conexión')
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
          <p className="text-sm text-neutral-500 truncate">{email}</p>
        </div>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="px-5 pt-5 pb-1">
          <p className="text-xs uppercase tracking-[0.15em] text-neutral-500 font-medium">
            Datos personales
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-5 pt-4 pb-5 space-y-4">
          {/* Email — locked */}
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1.5">Email</label>
            <div className="relative">
              <input
                type="email"
                disabled
                value={email}
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm bg-neutral-50 text-neutral-500 pr-10"
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-300" />
            </div>
            <p className="text-xs text-neutral-300 mt-1">No se puede cambiar</p>
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
                {...register('name')}
                placeholder="Tu nombre"
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-plum/30 focus:border-plum/40 transition-all pr-10"
              />
              <User className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-300" />
            </div>
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
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
                {...register('phone')}
                placeholder="+34 600 000 000"
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-plum/30 focus:border-plum/40 transition-all pr-10"
              />
              <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-300" />
            </div>
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-plum hover:bg-plum-hover text-white font-semibold py-3.5 rounded-xl transition-colors text-sm disabled:opacity-60 mt-2"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  )
}
