import { dbConnect } from '@/lib/db'
import Booking from '@/models/Booking'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, Euro, CheckCircle } from 'lucide-react'

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const { id } = await params
  await dbConnect()

  const booking = await Booking.findById(id)
    .populate('service', 'name category price duration')
    .lean()

  if (!booking) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500">Reserva no encontrada</p>
        <Link href="/booking" className="text-[#CDB4DB] hover:underline mt-4 inline-block">
          Volver a reservar
        </Link>
      </div>
    )
  }

  const service = booking.service as { name: string; price: number; duration: number }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatDuration = (min: number) => {
    const h = Math.floor(min / 60)
    const m = min % 60
    if (h === 0) return `${m}min`
    if (m === 0) return `${h}h`
    return `${h}h ${m}min`
  }

  return (
    <div className="max-w-md mx-auto text-center">
      <div className="mb-6">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="font-serif text-2xl mb-2">¡Reserva confirmada!</h1>
        <p className="text-neutral-500 text-sm">
          Te hemos enviado un email con los detalles de tu cita.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-6 text-left">
        <h3 className="font-medium text-lg mb-4">{service.name}</h3>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3 text-neutral-600">
            <Calendar className="w-4 h-4 text-[#CDB4DB]" />
            <span className="capitalize">{formatDate(booking.date)}</span>
          </div>
          <div className="flex items-center gap-3 text-neutral-600">
            <Clock className="w-4 h-4 text-[#CDB4DB]" />
            <span>{booking.startTime} - {booking.endTime} · {formatDuration(service.duration)}</span>
          </div>
          <div className="flex items-center gap-3 text-neutral-600">
            <Euro className="w-4 h-4 text-[#CDB4DB]" />
            <span>{service.price}€ · Pago en local</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <Link
          href="/dashboard"
          className="bg-[#CDB4DB] hover:bg-[#bda0cb] text-white font-medium py-3 rounded-full transition-colors text-center"
        >
          Ver mis reservas
        </Link>
        <Link
          href="/"
          className="text-sm text-neutral-500 hover:text-neutral-700"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
