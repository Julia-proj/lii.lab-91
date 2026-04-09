'use client'

import Link from 'next/link'
import { CalendarOff, ExternalLink } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="font-serif text-2xl text-neutral-900 dark:text-neutral-100">Ajustes</h1>
        <p className="text-xs text-neutral-400 mt-0.5">Configuración del panel</p>
      </div>

      {/* Bloqueos — redirigir a Horario */}
      <div className="bg-white dark:bg-card rounded-2xl border border-neutral-100 dark:border-white/8 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-white/8 flex items-center justify-center shrink-0">
              <CalendarOff className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Bloquear días y horas</p>
              <p className="text-xs text-neutral-400 mt-0.5">Gestiona tu disponibilidad desde el Horario</p>
            </div>
          </div>
          <Link
            href="/admin/schedule"
            className="flex items-center gap-1.5 text-xs font-medium text-plum hover:text-plum-hover border border-plum/20 hover:border-plum/40 rounded-lg px-3 py-2 transition-colors shrink-0"
          >
            Ir a Horario
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}
