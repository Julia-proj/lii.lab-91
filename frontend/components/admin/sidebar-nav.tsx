'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarDays, Scissors, BarChart2, CalendarOff, GraduationCap, type LucideIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const navGroups: { label: string; items: { href: string; label: string; icon: LucideIcon; badgeKey?: 'agenda' | 'courses' }[] }[] = [
  {
    label: 'Principal',
    items: [
      { href: '/admin',              label: 'Agenda',       icon: CalendarDays, badgeKey: 'agenda' },
      { href: '/admin/statistics', label: 'Estadísticas', icon: BarChart2 }, 
    ],
  },
  {
    label: 'Configuración',
    items: [
      { href: '/admin/services',  label: 'Servicios', icon: Scissors },
      { href: '/admin/courses',   label: 'Cursos',    icon: GraduationCap, badgeKey: 'courses' },    
      { href: '/admin/schedule',  label: 'Horario',   icon: CalendarOff },      
    ],
  },
]

interface SidebarNavProps {
  onNavigate?: () => void
}

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const pathname = usePathname()
  const isActive = (href: string) => href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
  
  const [pendingCounts, setPendingCounts] = useState({ agenda: 0, courses: 0 })

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch('/api/admin/pending-counts')
        if (!res.ok) throw new Error('request_failed')
        const data = await res.json()
        if (!cancelled && data.success && data.data) setPendingCounts(data.data)
      } catch {
        if (!cancelled) toast.error('Error al cargar los datos')
      }
    }
    load()
    return () => { cancelled = true }
  }, [pathname]) // Re-fetch on navigation

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
              const count = item.badgeKey ? pendingCounts[item.badgeKey] : 0
              
              return (
                <li key={item.href}>
                  <Link href={item.href} onClick={onNavigate}
                    className={`group flex items-center gap-3 px-3 py-2.5 lg:py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative ${
                      active
                        ? 'bg-white shadow-sm text-neutral-900 dark:bg-white/10 dark:text-white'
                        : 'text-neutral-500 hover:bg-white/60 hover:text-neutral-800 dark:text-neutral-500 dark:hover:bg-white/6 dark:hover:text-neutral-100'   
                    }`}>
                    <Icon className={`w-4 h-4 ${active ? 'text-plum' : 'text-neutral-500 dark:text-neutral-500'}`} />
                    <span className="text-sm">{item.label}</span>
                    
                    {count > 0 && (
                      <span className="ml-auto relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C4973B] opacity-50 duration-1000"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C4973B]"></span>
                      </span>
                    )}

                    {active && count === 0 && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-plum/60" />}
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
