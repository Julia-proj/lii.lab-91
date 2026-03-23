import { DashboardNav } from '@/components/dashboard/dashboard-nav'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  let session = null
  try { session = await auth() } catch { /* ignore */ }
  if (!session) redirect('/login')

  const firstName = session.user?.name?.split(' ')[0] || 'Hola'
  const initial = firstName[0]?.toUpperCase() || '?'

  return (
    <div className="space-y-5">
      {/* Greeting header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <p className="text-[11px] uppercase tracking-[0.15em] text-neutral-400 mb-0.5 font-medium">
            Mi panel
          </p>
          <h1 className="font-serif text-2xl text-neutral-900 leading-tight">
            Hola, {firstName}
          </h1>
        </div>
        <div className="w-11 h-11 rounded-full bg-lavender/20 border border-lavender/40 flex items-center justify-center shrink-0">
          <span className="text-base font-bold text-plum">{initial}</span>
        </div>
      </div>

      <DashboardNav />
      {children}
    </div>
  )
}
