import { dbConnect } from '@/lib/db'
import Booking from '@/models/Booking'
import '@/models/Service'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, Euro, CheckCircle, CalendarClock, Check } from 'lucide-react'

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
        <Link href="/booking" className="text-lavender hover:underline mt-4 inline-block">
          Volver a reservar
        </Link>
      </div>
    )
  }

  const services = (booking.services || []) as unknown as ServiceData[]
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

  const isPending = booking.status === 'pendiente'
  const isConfirmed = booking.status === 'confirmada'

  return (
    <div className="max-w-md mx-auto text-center">

      {isConfirmed ? (
        /* ── Confirmed state ── */
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h1 className="font-serif text-2xl mb-2">¡Cita confirmada!</h1>
          <p className="text-neutral-500 text-sm">
            Lili ha confirmado tu cita. Te esperamos.
          </p>
        </div>
      ) : (
        /* ── Pending state — reassuring UX ── */
        <div className="mb-6">

          {/* Icon: soft lavender circle */}
          <div className="w-20 h-20 rounded-full bg-lavender/10 flex items-center justify-center mx-auto mb-5">
            <div className="w-14 h-14 rounded-full bg-lavender/20 flex items-center justify-center">
              <CalendarClock className="w-7 h-7 text-lavender" />
            </div>
          </div>

          <h1 className="font-serif text-2xl mb-2">¡Solicitud enviada!</h1>
          <p className="text-neutral-500 text-sm leading-relaxed">
            Tu solicitud ha llegado a Lili.<br />
            En cuanto la revise, te confirmamos la cita.
          </p>

          {/* Progress steps */}
          <div className="flex items-start justify-center gap-0 mt-6">
            {/* Step 1: done */}
            <div className="flex flex-col items-center gap-1.5 w-20">
              <div className="w-7 h-7 rounded-full bg-lavender flex items-center justify-center shadow-sm">
                <Check className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-[11px] font-medium text-lavender">Enviada</span>
            </div>

            {/* Connector */}
            <div className="w-10 h-px bg-neutral-200 mt-3.5" />

            {/* Step 2: in progress */}
            <div className="flex flex-col items-center gap-1.5 w-20">
              <div className="w-7 h-7 rounded-full border-2 border-neutral-200 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-200 animate-pulse" />
              </div>
              <span className="text-[11px] text-neutral-400">Confirmando</span>
            </div>

            {/* Connector */}
            <div className="w-10 h-px bg-neutral-100 mt-3.5" />

            {/* Step 3: future */}
            <div className="flex flex-col items-center gap-1.5 w-20">
              <div className="w-7 h-7 rounded-full border-2 border-neutral-100 flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-neutral-200" />
              </div>
              <span className="text-[11px] text-neutral-300">Lista</span>
            </div>
          </div>
        </div>
      )}

      {/* Booking details card */}
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
            <Calendar className="w-4 h-4 text-lavender shrink-0" />
            <span className="capitalize">{formatDate(booking.date)}</span>
          </div>
          <div className="flex items-center gap-3 text-neutral-600">
            <Clock className="w-4 h-4 text-lavender shrink-0" />
            <span>{booking.startTime} – {booking.endTime} · {formatDuration(booking.startTime, booking.endTime)}</span>
          </div>
          <div className="flex items-center gap-3 text-neutral-600">
            <Euro className="w-4 h-4 text-lavender shrink-0" />
            <span>{totalPrice}€ · Pago en local</span>
          </div>
        </div>
      </div>

      {/* Pending: what happens next */}
      {isPending && (
        <div className="mt-4 bg-neutral-50 rounded-xl border border-neutral-100 p-4 text-left">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">¿Qué pasa ahora?</p>
          <ul className="space-y-2.5">
            <li className="flex items-start gap-2.5 text-sm text-neutral-500 leading-snug">
              <span className="text-lavender font-bold shrink-0 mt-px">·</span>
              <span>Puedes consultar el estado de tu cita en cualquier momento desde <strong className="font-medium text-neutral-700">Mis reservas.</strong></span>
            </li>
            <li className="flex items-start gap-2.5 text-sm text-neutral-500 leading-snug">
              <span className="text-lavender font-bold shrink-0 mt-px">·</span>
              <span>Si la cita se confirma sin cambios, <strong className="font-medium text-neutral-700">no recibirás ningún mensaje</strong> — aparecerá directamente como confirmada.</span>
            </li>
            <li className="flex items-start gap-2.5 text-sm text-neutral-500 leading-snug">
              <span className="text-lavender font-bold shrink-0 mt-px">·</span>
              <span>Si hubiera algún cambio en el horario, Lili te <strong className="font-medium text-neutral-700">contactará directamente.</strong></span>
            </li>
          </ul>
        </div>
      )}

      {/* CTAs */}
      <div className="mt-6 flex flex-col gap-3">
        <Link
          href="/dashboard"
          className="bg-lavender hover:bg-plum text-white font-medium py-3 rounded-full transition-colors text-center"
        >
          {isPending ? 'Seguir el estado de mi reserva' : 'Ver mis reservas'}
        </Link>
        <Link
          href="/"
          className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
