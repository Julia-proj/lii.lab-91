'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { SidebarNav } from '@/components/admin/sidebar-nav'
import { SidebarBottom } from '@/components/admin/sidebar-bottom'

export function AdminSidebar() {
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('admin-theme')
    const dark = saved === 'dark'
    setIsDark(dark)
    document.documentElement.classList.toggle('dark', dark)
    return () => { document.documentElement.classList.remove('dark') }
  }, [])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('admin-theme', next ? 'dark' : 'light')
  }

  if (!session || session.user?.role !== 'admin') return null

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 lg:py-5 border-b border-neutral-200 dark:border-white/8 flex items-center justify-between">
        <Link href="/" className="block">
          <span className="font-serif text-xl tracking-wide text-neutral-900 dark:text-white">Lii.lab</span>
          <p className="text-xs text-neutral-500 mt-0.5 tracking-widest uppercase">Administración</p>
        </Link>
        <button onClick={() => setMobileOpen(false)} aria-label="Cerrar menú"
          className="lg:hidden p-2 rounded-lg text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/8 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 px-2 py-2 lg:py-4 overflow-y-auto">
        <SidebarNav onNavigate={() => setMobileOpen(false)} />
      </div>

      <SidebarBottom
        session={session}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onNavigate={() => setMobileOpen(false)}
      />
    </div>
  )

  return (
    <>
      {!mobileOpen && (
        <button onClick={() => setMobileOpen(true)} aria-label="Abrir menú"
          className="lg:hidden fixed top-3 left-3 z-50 bg-warm-bg dark:bg-background border border-neutral-200 dark:border-white/15 rounded-xl p-3 shadow-lg active:scale-95 transition-transform">
          <Menu className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
        </button>
      )}

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 lg:w-56 bg-warm-bg dark:bg-background border-r border-neutral-200 dark:border-white/6 transition-transform duration-200 ease-in-out lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </aside>
    </>
  )
}
