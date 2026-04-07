'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { CalendarDays, Scissors, Menu, X, ArrowLeft, LogOut, Sun, Moon, BarChart2, CalendarOff } from 'lucide-react'
import { useState, useEffect } from 'react'

const navGroups = [
  {
    label: 'Trabajo',
    items: [
      { href: '/admin',              label: 'Agenda',       icon: CalendarDays },
      { href: '/admin/estadisticas', label: 'Estadísticas', icon: BarChart2 },
    ],
  },
  {
    label: 'Configuración',
    items: [
      { href: '/admin/schedule',  label: 'Horario',   icon: CalendarOff },
      { href: '/admin/services',  label: 'Servicios', icon: Scissors },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('admin-theme')
    const dark = saved === 'dark'
    setIsDark(dark)
    document.documentElement.classList.toggle('dark', dark)
    // Remove dark class when leaving admin (sidebar unmounts)
    return () => { document.documentElement.classList.remove('dark') }
  }, [])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('admin-theme', next ? 'dark' : 'light')
  }

  if (!session || session.user?.role !== 'admin') return null

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)



  const nav = (
    <nav className="flex-1 space-y-2 lg:space-y-4">
      {navGroups.map((group) => (
        <div key={group.label}>
          <p className="px-3 mb-1 text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-600">
            {group.label}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 lg:py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                      active
                        ? 'bg-white shadow-sm text-neutral-900 dark:bg-white/10 dark:text-white'
                        : 'text-neutral-500 hover:bg-white/60 hover:text-neutral-800 dark:text-neutral-500 dark:hover:bg-white/6 dark:hover:text-neutral-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-plum' : 'text-neutral-500 dark:text-neutral-500'}`} />
                    <span className="text-sm">{item.label}</span>
                    {active && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-plum/60" />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-3 lg:py-5 border-b border-neutral-200 dark:border-white/8 flex items-center justify-between">
        <Link href="/" className="block">
          <span className="font-serif text-xl tracking-wide text-neutral-900 dark:text-white">Lii.lab</span>
          <p className="text-xs text-neutral-500 mt-0.5 tracking-widest uppercase">Administración</p>
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          aria-label="Cerrar menú"
          className="lg:hidden p-2 rounded-lg text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/8 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <div className="flex-1 px-2 py-2 lg:py-4 overflow-y-auto">
        {nav}
      </div>

      {/* Bottom: user + actions */}
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

        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-500 hover:text-neutral-800 hover:bg-white/60 dark:hover:text-neutral-200 dark:hover:bg-white/5 transition-colors rounded-lg w-full"
        >
          {isDark
            ? <Sun className="w-4 h-4 shrink-0 text-amber-400" />
            : <Moon className="w-4 h-4 shrink-0" />
          }
          {isDark ? 'Modo claro' : 'Modo oscuro'}
        </button>

        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-500 hover:text-neutral-800 hover:bg-white/60 dark:hover:text-neutral-200 dark:hover:bg-white/5 transition-colors rounded-lg w-full"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          Volver al sitio
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors rounded-lg w-full"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Cerrar sesión
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle — only shown when sidebar is closed */}
      {!mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menú"
          className="lg:hidden fixed top-3 left-3 z-50 bg-[#f5f3f0] dark:bg-[#111115] border border-neutral-200 dark:border-white/15 rounded-xl p-3 shadow-lg active:scale-95 transition-transform"
        >
          <Menu className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
        </button>
      )}

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 lg:w-56 bg-[#f5f3f0] dark:bg-[#111115] border-r border-neutral-200 dark:border-white/6
          transition-transform duration-200 ease-in-out lg:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
