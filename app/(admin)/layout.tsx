import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

// Layout del panel admin: solo accesible para usuarios con rol 'admin'
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  // Si no hay sesión o el usuario no es admin, redirigir a inicio
  if (!session || session.user?.role !== 'admin') {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex">
      <AdminSidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-0 pt-16 lg:pt-8">
        {children}
      </main>
    </div>
  )
}
