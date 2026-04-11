'use client'

import { LogIn } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { IService } from '@/types'

interface InlineAuthFormProps {
  services: IService[]
  loginEmail: string
  loginPassword: string
  loginError: string
  loginLoading: boolean
  loginSucceeded: boolean
  onEmailChange: (v: string) => void
  onPasswordChange: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
  onBack: () => void
}

export function InlineAuthForm({
  services,
  loginEmail,
  loginPassword,
  loginError,
  loginLoading,
  loginSucceeded,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onBack,
}: InlineAuthFormProps) {
  const router = useRouter()

  const handleGoToRegister = () => {
    if (services.length > 0) {
      localStorage.setItem(
        'liilab-booking-state',
        JSON.stringify({ services })
      )
    }
    router.push('/register?callbackUrl=/booking?resume=true')
  }

  return (
    <div>
      <h2 className="font-serif text-xl mb-2 text-center">Inicia sesion para continuar</h2>
      <p className="text-sm text-neutral-500 mb-6 text-center">
        {services.length} servicio{services.length > 1 ? 's' : ''} seleccionado{services.length > 1 ? 's' : ''}
      </p>

      <div className="bg-white rounded-xl border border-neutral-200 p-6 max-w-sm mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <LogIn className="w-4 h-4 text-lavender" />
          <span className="text-sm font-medium text-neutral-700">Accede a tu cuenta</span>
        </div>

        {loginSucceeded ? (
          <div className="flex items-center justify-center gap-2 py-6 text-sm text-neutral-500">
            <div className="animate-spin w-4 h-4 border-2 border-lavender border-t-transparent rounded-full" />
            Verificando sesion...
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => onEmailChange(e.target.value)}
              required
              className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-lavender focus:border-transparent"
            />
            <input
              type="password"
              placeholder="Contrasena"
              value={loginPassword}
              onChange={(e) => onPasswordChange(e.target.value)}
              required
              className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-lavender focus:border-transparent"
            />
            {loginError && <p className="text-xs text-red-500">{loginError}</p>}
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-plum hover:bg-plum-hover text-white font-semibold py-3 rounded-full transition-colors disabled:opacity-60 shadow-sm text-sm"
            >
              {loginLoading ? 'Entrando...' : 'Iniciar sesion'}
            </button>
          </form>
        )}

        {!loginSucceeded && (
          <>
            <button
              type="button"
              onClick={handleGoToRegister}
              className="w-full mt-3 text-sm text-plum hover:text-plum-hover hover:underline font-medium"
            >
              No tengo cuenta - Registrarme
            </button>
            <button
              type="button"
              onClick={onBack}
              className="w-full mt-2 text-sm text-neutral-500 hover:text-neutral-700 hover:underline"
            >
              Volver a los servicios
            </button>
          </>
        )}
      </div>
    </div>
  )
}
