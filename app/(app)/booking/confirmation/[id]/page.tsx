import { dbConnect } from '@/lib/db'
import Booking from '@/models/Booking'
import '@/models/Service'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, Euro, CheckCircle, Hourglass } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface ServiceData {
  name: string
  price: number
  duration: number
}

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  let session = null
  try {
    session = await auth()
  } catch {
    redirect('/login')
  }
  if (!session) redirect('/login')

  const { id } = await params

  let booking = null
  try {
    await dbConnect()
    booking = await Booking.findById(id)
      .populate('services', 'name category price duration')
      .lean()
  } catch {
    // DB error — show fallback
  }

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

  const services = (booking.services || []) as ServiceData[]
  const totalPrice = services.reduce((sum, s) => sum + s.price, 0)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatDuration = (startTime: string, endTime: string) => {
    const [sh, sm] = startTime.split(':').map(Number)
    const [eh, em] = endTime.split(':').map(Number)
    const min = (eh * 60 + em) - (sh * 60 + sm)
    const h = Math.floor(min / 60)
    const m = min % 60
    if (h === 0) return `${m}min`
    if (m === 0) return `${h}h`
    return `${h}h ${m}min`
  }

  return (
    <div className="max-w-md mx-auto text-center">
      <div className="mb-6">
        {booking.status === 'confirmada' ? (
          <>
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h1 className="font-serif text-2xl mb-2">¡Cita confirmada!</h1>
            <p className="text-neutral-500 text-sm">
              Lili ha confirmado tu cita. Te esperamos.
            </p>
          </>
        ) : (
          <>
            <Hourglass className="w-16 h-16 text-amber-400 mx-auto mb-4" />
            <h1 className="font-serif text-2xl mb-2">¡Reserva recibida!</h1>
            <p className="text-neutral-500 text-sm">
              Tu solicitud está pendiente de confirmación.{' '}
              <span className="font-medium text-neutral-700">
                Cuando Lili la confirme recibirás un email o WhatsApp.
              </span>
            </p>
          </>
        )}
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-6 text-left">
        {services.length === 1 ? (
          <h3 className="font-medium text-lg mb-4">{services[0].name}</h3>
        ) : (
          <div className="mb-4">
            <h3 className="font-medium text-base mb-2">Servicios reservados</h3>
            <div className="space-y-1">
              {services.map((s, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-neutral-700">{s.name}</span>
                  <span className="text-neutral-500">{s.price}€</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3 text-neutral-600">
            <Calendar className="w-4 h-4 text-[#CDB4DB]" />
            <span className="capitalize">{formatDate(booking.date)}</span>
          </div>
          <div className="flex items-center gap-3 text-neutral-600">
            <Clock className="w-4 h-4 text-[#CDB4DB]" />
            <span>{booking.startTime} - {booking.endTime} · {formatDuration(booking.startTime, booking.endTime)}</span>
          </div>
          <div className="flex items-center gap-3 text-neutral-600">
            <Euro className="w-4 h-4 text-[#CDB4DB]" />
            <span>{totalPrice}€ · Pago en local</span>
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
