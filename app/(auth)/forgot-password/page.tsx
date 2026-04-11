'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Error al enviar el correo')
        return
      }
      setSent(true)
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 sm:p-8">
      {sent ? (
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-serif text-2xl mb-3">Correo enviado</h1>
          <p className="text-sm text-neutral-500 leading-relaxed mb-6">
            Si existe una cuenta con ese email, recibirás un enlace para restablecer tu contraseña en los próximos minutos. Revisa también la carpeta de spam.
          </p>
          <Link href="/login" className="text-sm text-plum hover:underline font-medium">
            Volver al inicio de sesión
          </Link>
        </div>
      ) : (
        <>
          <h1 className="font-serif text-2xl text-center mb-2">¿Olvidaste tu contraseña?</h1>
          <p className="text-sm text-neutral-500 text-center mb-6">
            Escribe tu email y te enviaremos un enlace para restablecerla.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-plum focus:border-transparent"
                placeholder="tu@email.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-plum hover:bg-plum-hover text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60"
            >
              {loading ? 'Enviando...' : 'Enviar enlace'}
            </button>
          </form>

          <p className="text-center text-sm text-neutral-500 mt-6">
            <Link href="/login" className="text-plum hover:underline font-medium">
              Volver al inicio de sesión
            </Link>
          </p>
        </>
      )}
    </div>
  )
}
