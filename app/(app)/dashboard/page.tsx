import { BookingList } from '@/components/dashboard/booking-list'

export const metadata = {
  title: 'Mis citas | Lii.lab',
  description: 'Consulta y gestiona tus reservas.',
}

export default function DashboardPage() {
  return (
    <div>
      <BookingList />
    </div>
  )
}
