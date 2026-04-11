'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-sm text-neutral-500 mb-4">El enlace no es válido o ha expirado.</p>
        <Link href="/forgot-password" className="text-sm text-plum hover:underline font-medium">
          Solicitar uno nuevo
        </Link>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Error al restablecer la contraseña')
        return
      }
      setDone(true)
      setTimeout(() => router.push('/login'), 2500)
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-serif text-xl mb-2">Contraseña actualizada</h2>
        <p className="text-sm text-neutral-500">Redirigiendo al inicio de sesión…</p>
      </div>
    )
  }

  return (
    <>
      <h1 className="font-serif text-2xl text-center mb-6">Nueva contraseña</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
            Nueva contraseña
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-plum focus:border-transparent"
            placeholder="Mínimo 6 caracteres"
          />
        </div>
        <div>
          <label htmlFor="confirm" className="block text-sm font-medium text-neutral-700 mb-1">
            Confirmar contraseña
          </label>
          <input
            id="confirm"
            type="password"
            required
            minLength={6}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-plum focus:border-transparent"
            placeholder="Repite la contraseña"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-plum hover:bg-plum-hover text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60"
        >
          {loading ? 'Guardando...' : 'Guardar contraseña'}
        </button>
      </form>
    </>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 sm:p-8">
      <Suspense fallback={
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-neutral-200 border-t-plum rounded-full animate-spin" />
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  )
}
