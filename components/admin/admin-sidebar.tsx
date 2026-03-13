'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { BarChart3, Calendar, CalendarOff, Scissors, Menu, X } from 'lucide-react'
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

  // Doble protección: si por caché o error se renderiza para un no-admin, no mostrar nada
  if (!session || session.user?.role !== 'admin') {
    return null
  }

  const nav = (
    <ul className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#CDB4DB]/15 text-[#8e7f97]'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white border border-neutral-200 rounded-lg p-2 shadow-sm"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-60 bg-white border-r border-neutral-200 p-4 transition-transform lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-6">
          <Link href="/" className="font-serif text-xl tracking-wide text-neutral-900">
            Lii.lab
          </Link>
          <p className="text-xs text-neutral-400 mt-0.5">Panel de administración</p>
        </div>
        {nav}
        <div className="mt-8 pt-4 border-t border-neutral-100">
          <Link
            href="/"
            className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            ← Volver al sitio
          </Link>
        </div>
      </aside>
    </>
  )
}
