import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import Booking from '@/models/Booking'
import Service from '@/models/Service'
import { auth } from '@/lib/auth'
import { bookingSchema } from '@/lib/validators'
import { minutesToTime, parseTimeToMinutes } from '@/lib/schedule'
import { notifyNewBooking } from '@/lib/notifications'

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    await dbConnect()

    const filter: Record<string, unknown> = session.user.role === 'admin'
      ? {}
      : { user: session.user.id }

    const bookings = await Booking.find(filter)
      .populate('service', 'name category price duration')
      .populate('user', 'name email phone')
      .sort({ date: -1, startTime: -1 })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json({ error: 'Error al obtener reservas' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = bookingSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }

    await dbConnect()

    const service = await Service.findById(parsed.data.serviceId)
    if (!service || !service.active) {
      return NextResponse.json({ error: 'Servicio no disponible' }, { status: 404 })
    }

    // Calcular duración real (considerando cantidad para Decoraciones, etc.)
    const quantity = parsed.data.quantity ?? 1
    const effectiveDuration = service.duration * quantity

    // Calculate end time
    const startMin = parseTimeToMinutes(parsed.data.startTime)
    const endTime = minutesToTime(startMin + effectiveDuration)

    // Reject bookings for past dates (timezone-aware: Europe/Madrid)
    const nowInSpain = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Madrid' }))
    const today = `${nowInSpain.getFullYear()}-${String(nowInSpain.getMonth() + 1).padStart(2, '0')}-${String(nowInSpain.getDate()).padStart(2, '0')}`
    if (parsed.data.date < today) {
      return NextResponse.json({ error: 'No se pueden reservar fechas pasadas' }, { status: 400 })
    }

    // Reject past times for same-day bookings
    if (parsed.data.date === today) {
      const nowMinutes = nowInSpain.getHours() * 60 + nowInSpain.getMinutes()
      if (startMin <= nowMinutes) {
        return NextResponse.json({ error: 'No se pueden reservar horas ya pasadas' }, { status: 400 })
      }
    }

    // Check for conflicts (atomic check)
    const conflict = await Booking.findOne({
      date: parsed.data.date,
      status: { $in: ['confirmada', 'pendiente'] },
      $expr: {
        $and: [
          { $lt: ['$startTime', endTime] },
          { $gt: ['$endTime', parsed.data.startTime] },
        ],
      },
    })

    if (conflict) {
      return NextResponse.json(
        { error: 'El horario seleccionado ya no está disponible' },
        { status: 409 }
      )
    }

    const booking = await Booking.create({
      user: session.user.id,
      service: parsed.data.serviceId,
      date: parsed.data.date,
      startTime: parsed.data.startTime,
      endTime,
      status: 'confirmada',
      quantity: quantity > 1 ? quantity : undefined,
      notes: parsed.data.notes,
    })

    // Populate for response
    const populated = await Booking.findById(booking._id)
      .populate('service', 'name category price duration')
      .populate('user', 'name email phone')

    // Send notifications (fire and forget — don't block the response)
    if (populated?.user && populated?.service) {
      const user = populated.user as { name: string; email: string; phone?: string }
      const svc = populated.service as { name: string; price: number }
      notifyNewBooking({
        clientName: user.name,
        clientEmail: user.email,
        clientPhone: user.phone,
        serviceName: svc.name,
        date: parsed.data.date,
        startTime: parsed.data.startTime,
        endTime,
        price: svc.price,
      }).catch((err) => console.error('Notification error:', err))
    }

    return NextResponse.json(populated, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json({ error: 'Error al crear reserva' }, { status: 500 })
  }
}
