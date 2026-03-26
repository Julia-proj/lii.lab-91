'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calendar, User } from 'lucide-react'

const navItems = [
  { href: '/dashboard',         label: 'Mis reservas', icon: Calendar },
  { href: '/dashboard/profile', label: 'Perfil',        icon: User },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <div className="bg-neutral-100 rounded-2xl p-1 flex gap-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-plum' : ''}`} />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
