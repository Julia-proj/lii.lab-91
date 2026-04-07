import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

// Layout del panel admin: solo accesible para usuarios con rol 'admin'
export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let session = null
  try {
    session = await auth()
  } catch {
    redirect('/')
  }

  if (!session || session.user?.role !== 'admin') {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-[#F9F9FB] dark:bg-[#09090B] flex transition-colors duration-200">
      <AdminSidebar />
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
