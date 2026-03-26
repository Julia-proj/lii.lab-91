import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { Booking, Service } from '@/models'
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
      .populate('services', 'name category price duration')
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

    const { services: serviceIds, quantities = {}, date, startTime, notes } = parsed.data

    // Fetch all requested services
    const services = await Service.find({ _id: { $in: serviceIds }, active: true })
    if (services.length !== serviceIds.length) {
      return NextResponse.json({ error: 'Uno o más servicios no están disponibles' }, { status: 404 })
    }

    // Calculate total duration considering quantities
    const totalDuration = services.reduce((sum, svc) => {
      const qty = quantities[svc._id.toString()] ?? 1
      return sum + svc.duration * qty
    }, 0)

    // Calculate end time
    const startMin = parseTimeToMinutes(startTime)
    const endTime = minutesToTime(startMin + totalDuration)

    // Reject bookings for past dates (timezone-aware: Europe/Madrid)
    const nowInSpain = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Madrid' }))
    const today = `${nowInSpain.getFullYear()}-${String(nowInSpain.getMonth() + 1).padStart(2, '0')}-${String(nowInSpain.getDate()).padStart(2, '0')}`
    if (date < today) {
      return NextResponse.json({ error: 'No se pueden reservar fechas pasadas' }, { status: 400 })
    }

    // Reject past times for same-day bookings
    if (date === today) {
      const nowMinutes = nowInSpain.getHours() * 60 + nowInSpain.getMinutes()
      if (startMin <= nowMinutes) {
        return NextResponse.json({ error: 'No se pueden reservar horas ya pasadas' }, { status: 400 })
      }
    }

    // Check for conflicts (atomic check)
    const conflict = await Booking.findOne({
      date,
      status: { $in: ['confirmada', 'pendiente'] },
      $expr: {
        $and: [
          { $lt: ['$startTime', endTime] },
          { $gt: ['$endTime', startTime] },
        ],
      },
    })

    if (conflict) {
      return NextResponse.json(
        { error: 'El horario seleccionado ya no está disponible' },
        { status: 409 }
      )
    }

    // Create ONE booking with all services
    const booking = await Booking.create({
      user: session.user.id,
      services: serviceIds,
      quantities: Object.keys(quantities).length > 0 ? quantities : undefined,
      date,
      startTime,
      endTime,
      status: 'pendiente',
      notes: notes || undefined,
    })

    // Populate for response
    const populated = await Booking.findById(booking._id)
      .populate('services', 'name category price duration')
      .populate('user', 'name email phone')

    // Send notifications (fire and forget — don't block the response)
    if (populated?.user && populated?.services?.length > 0) {
      const user = populated.user as { name: string; email: string; phone?: string }
      const svcList = populated.services as { name: string; price: number }[]
      const totalPrice = svcList.reduce((sum, s, i) => {
        const svcId = serviceIds[i]
        const qty = quantities[svcId] ?? 1
        return sum + s.price * qty
      }, 0)
      const serviceNames = svcList.map((s) => s.name).join(', ')
      notifyNewBooking({
        clientName: user.name,
        clientEmail: user.email,
        clientPhone: user.phone,
        serviceName: serviceNames,
        date,
        startTime,
        endTime,
        price: totalPrice,
      }).catch((err) => console.error('Notification error:', err))
    }

    return NextResponse.json(populated, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json({ error: 'Error al crear reserva' }, { status: 500 })
  }
}
