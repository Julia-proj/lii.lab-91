'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { ArrowLeft, LogOut, Sun, Moon } from 'lucide-react'
import type { Session } from 'next-auth'

interface SidebarBottomProps {
  session: Session
  isDark: boolean
  onToggleTheme: () => void
  onNavigate?: () => void
}

export function SidebarBottom({ session, isDark, onToggleTheme, onNavigate }: SidebarBottomProps) {
  return (
    <div className="px-3 pb-3 lg:pb-5 border-t border-neutral-200 dark:border-white/8 pt-2 lg:pt-4 space-y-0.5">
      <div className="flex items-center gap-2.5 px-2 py-1.5">
        <div className="w-7 h-7 rounded-full bg-plum/15 border border-plum/30 flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-plum">
            {session.user?.name?.[0]?.toUpperCase() || 'A'}
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">{session.user?.name}</p>
          <p className="text-xs text-neutral-500 truncate">{session.user?.email}</p>
        </div>
      </div>

      <button onClick={onToggleTheme}
        className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-500 hover:text-neutral-800 hover:bg-white/60 dark:hover:text-neutral-200 dark:hover:bg-white/5 transition-colors rounded-lg w-full">
        {isDark
          ? <Sun className="w-4 h-4 shrink-0 text-amber-400" />
          : <Moon className="w-4 h-4 shrink-0" />
        }
        {isDark ? 'Modo claro' : 'Modo oscuro'}
      </button>

      <Link href="/" onClick={onNavigate}
        className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-500 hover:text-neutral-800 hover:bg-white/60 dark:hover:text-neutral-200 dark:hover:bg-white/5 transition-colors rounded-lg w-full">
        <ArrowLeft className="w-4 h-4 shrink-0" />
        Volver al sitio
      </Link>

      <button onClick={() => signOut({ callbackUrl: '/' })}
        className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors rounded-lg w-full">
        <LogOut className="w-4 h-4 shrink-0" />
        Cerrar sesión
      </button>
    </div>
  )
}
