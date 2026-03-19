'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { CalendarDays, Scissors, Settings, Menu, X, ArrowLeft, LogOut, Sun, Moon } from 'lucide-react'
import { useState, useEffect } from 'react'

const navItems = [
  { href: '/admin',          label: 'Agenda',    icon: CalendarDays },
  { href: '/admin/services', label: 'Servicios', icon: Scissors },
  { href: '/admin/settings', label: 'Ajustes',   icon: Settings },
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
    <nav className="flex-1">
      <ul className="space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-4 lg:py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  active
                    ? 'bg-white/10 text-white'
                    : 'text-neutral-400 hover:bg-white/6 hover:text-neutral-100'
                }`}
              >
                <span className={`p-1.5 rounded-md transition-colors ${
                  active ? 'bg-plum/40 text-white' : 'text-neutral-500'
                }`}>
                  <Icon className="w-5 h-5 lg:w-4 lg:h-4" />
                </span>
                <span className="text-base lg:text-sm">{item.label}</span>
                {active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-plum/60" />
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/8">
        <Link href="/" className="block">
          <span className="font-serif text-xl tracking-wide text-white">Lii.lab</span>
          <p className="text-[10px] text-neutral-500 mt-0.5 tracking-widest uppercase">Administración</p>
        </Link>
      </div>

      {/* Nav */}
      <div className="flex-1 px-2 py-4 overflow-y-auto">
        {nav}
      </div>

      {/* Bottom: user + actions */}
      <div className="px-3 pb-5 border-t border-white/8 pt-4 space-y-1">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-plum/30 border border-plum/40 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-white/80">
              {session.user?.name?.[0]?.toUpperCase() || 'A'}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-neutral-200 truncate">{session.user?.name}</p>
            <p className="text-[11px] text-neutral-500 truncate">{session.user?.email}</p>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 px-3 py-3 lg:py-2 text-sm text-neutral-500 hover:text-neutral-200 hover:bg-white/5 transition-colors rounded-lg w-full"
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
          className="flex items-center gap-2 px-3 py-3 lg:py-2 text-sm text-neutral-500 hover:text-neutral-200 hover:bg-white/5 transition-colors rounded-lg w-full"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          Volver al sitio
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-2 px-3 py-3 lg:py-2 text-sm text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors rounded-lg w-full"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Cerrar sesión
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Abrir menú"
        className="lg:hidden fixed top-3 left-3 z-50 bg-[#111115] border border-white/10 rounded-xl p-3 shadow-lg active:scale-95 transition-transform"
      >
        {mobileOpen
          ? <X className="w-5 h-5 text-neutral-300" />
          : <Menu className="w-5 h-5 text-neutral-300" />
        }
      </button>

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
          w-64 lg:w-56 bg-[#111115] border-r border-white/6
          transition-transform duration-200 ease-in-out lg:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
