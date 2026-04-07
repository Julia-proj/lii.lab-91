'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Admin error:', error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-sm">
        <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-4" />
        <h2 className="font-serif text-xl text-neutral-900 dark:text-neutral-100 mb-2">
          Error en el panel
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
          {error.message || 'Ha ocurrido un error inesperado.'}
        </p>
        <button
          onClick={reset}
          className="px-5 py-2 text-sm font-medium bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full hover:opacity-90 transition-opacity"
        >
          Reintentar
        </button>
        {error.digest && (
          <p className="mt-4 text-[10px] text-neutral-300 font-mono">ref: {error.digest}</p>
        )}
      </div>
    </div>
  )
}
