'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calendar, User } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Mis reservas', icon: Calendar },
  { href: '/dashboard/profile', label: 'Perfil', icon: User },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="flex gap-1 mb-6 border-b border-neutral-200">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              isActive
                ? 'border-[#CDB4DB] text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
