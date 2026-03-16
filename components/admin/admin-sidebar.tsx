'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { BarChart3, Calendar, CalendarOff, Scissors, Menu, X, ArrowLeft, LogOut } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { href: '/admin', label: 'Panel', icon: BarChart3 },
  { href: '/admin/bookings', label: 'Reservas', icon: Calendar },
  { href: '/admin/schedule', label: 'Horario', icon: CalendarOff },
  { href: '/admin/services', label: 'Servicios', icon: Scissors },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!session || session.user?.role !== 'admin') return null

  const nav = (
    <nav className="flex-1">
      <ul className="space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-4 lg:py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-[#CDB4DB]/15 text-[#7d6389] font-semibold'
                    : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800'
                }`}
              >
                <span className={`p-1.5 rounded-md transition-colors ${
                  isActive ? 'bg-[#CDB4DB]/20 text-[#9b7fa8]' : 'text-neutral-400'
                }`}>
                  <Icon className="w-5 h-5 lg:w-4 lg:h-4" />
                </span>
                <span className="text-base lg:text-sm">{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#9b7fa8]" />
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
      <div className="px-4 py-5 border-b border-neutral-100">
        <Link href="/" className="block">
          <span className="font-serif text-xl tracking-wide text-neutral-900">Lii.lab</span>
          <p className="text-[10px] text-neutral-400 mt-0.5 tracking-widest uppercase">Administración</p>
        </Link>
      </div>

      {/* Nav */}
      <div className="flex-1 px-2 py-4 overflow-y-auto">
        {nav}
      </div>

      {/* Bottom: user + links */}
      <div className="px-3 pb-5 border-t border-neutral-100 pt-4 space-y-1">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-[#CDB4DB]/30 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-[#7d6389]">
              {session.user?.name?.[0]?.toUpperCase() || 'A'}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-neutral-700 truncate">{session.user?.name}</p>
            <p className="text-[11px] text-neutral-400 truncate">{session.user?.email}</p>
          </div>
        </div>

        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2 px-3 py-3 lg:py-2 text-sm text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 transition-colors rounded-lg w-full"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          Volver al sitio
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-2 px-3 py-3 lg:py-2 text-sm text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors rounded-lg w-full"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Cerrar sesión
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle — bigger tap area */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Abrir menú"
        className="lg:hidden fixed top-3 left-3 z-50 bg-white border border-neutral-200 rounded-xl p-3 shadow-sm active:scale-95 transition-transform"
      >
        {mobileOpen ? <X className="w-5 h-5 text-neutral-700" /> : <Menu className="w-5 h-5 text-neutral-700" />}
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 lg:w-56 bg-white border-r border-neutral-100 shadow-md lg:shadow-sm
          transition-transform duration-200 ease-in-out lg:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
