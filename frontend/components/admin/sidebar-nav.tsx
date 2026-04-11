'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarDays, Scissors, BarChart2, CalendarOff, Settings, GraduationCap, type LucideIcon } from 'lucide-react'

const navGroups: { label: string; items: { href: string; label: string; icon: LucideIcon }[] }[] = [
  {
    label: 'Principal',
    items: [
      { href: '/admin',              label: 'Agenda',       icon: CalendarDays },
      { href: '/admin/estadisticas', label: 'Estadísticas', icon: BarChart2 },
    ],
  },
  {
    label: 'Configuración',
    items: [
      { href: '/admin/services',  label: 'Servicios', icon: Scissors },
      { href: '/admin/courses',   label: 'Cursos',    icon: GraduationCap },
      { href: '/admin/schedule',  label: 'Horario',   icon: CalendarOff },
      { href: '/admin/settings',  label: 'Sistema',   icon: Settings },
    ],
  },
]

interface SidebarNavProps {
  onNavigate?: () => void
}

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const pathname = usePathname()
  const isActive = (href: string) => href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  return (
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
                  <Link href={item.href} onClick={onNavigate}
                    className={`flex items-center gap-3 px-3 py-2.5 lg:py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                      active
                        ? 'bg-white shadow-sm text-neutral-900 dark:bg-white/10 dark:text-white'
                        : 'text-neutral-500 hover:bg-white/60 hover:text-neutral-800 dark:text-neutral-500 dark:hover:bg-white/6 dark:hover:text-neutral-100'
                    }`}>
                    <Icon className={`w-4 h-4 ${active ? 'text-plum' : 'text-neutral-500 dark:text-neutral-500'}`} />
                    <span className="text-sm">{item.label}</span>
                    {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-plum/60" />}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
