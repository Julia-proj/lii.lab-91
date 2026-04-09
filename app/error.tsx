'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <html lang="es">
      <body className="min-h-screen bg-warm-bg flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-xs tracking-[0.25em] uppercase text-neutral-400 mb-4">Lii.lab</p>
          <h1 className="font-serif text-3xl text-neutral-900 mb-3">Algo ha ido mal</h1>
          <p className="text-sm text-neutral-500 mb-8 leading-relaxed">
            Ha ocurrido un error inesperado. Puedes intentar recargar la página o volver al inicio.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={reset}
              className="px-5 py-2.5 text-sm font-medium bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-colors"
            >
              Intentar de nuevo
            </button>
            <Link
              href="/"
              className="px-5 py-2.5 text-sm font-medium border border-neutral-200 text-neutral-600 rounded-full hover:border-neutral-400 transition-colors"
            >
              Inicio
            </Link>
          </div>
          {error.digest && (
            <p className="mt-6 text-[10px] text-neutral-300 font-mono">ref: {error.digest}</p>
          )}
        </div>
      </body>
    </html>
  )
}
