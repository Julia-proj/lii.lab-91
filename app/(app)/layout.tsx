import Link from 'next/link'
import { auth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  let session = null
  try {
    session = await auth()
  } catch {
    // auth unavailable, continue without session
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl tracking-wide text-neutral-900">
            Lii.lab
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/booking" className="text-neutral-600 hover:text-neutral-900 transition-colors">
              Reservar
            </Link>
            <Link href="/dashboard" className="text-neutral-600 hover:text-neutral-900 transition-colors">
              Mi panel
            </Link>
            {session?.user?.role === 'admin' && (
              <Link href="/admin" className="text-neutral-600 hover:text-neutral-900 transition-colors">
                Admin
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
