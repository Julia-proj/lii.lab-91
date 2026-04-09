export const metadata = {
  title: 'Admin | Lii.lab',
  description: 'Panel de administración.',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
