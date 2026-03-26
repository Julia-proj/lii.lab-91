import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { bookingSchema } from '@/lib/validators'
import { BookingService } from '@/backend/services/booking.service'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const bookings = await BookingService.getAll(session.user.id, session.user.role)
    return NextResponse.json(bookings)
  } catch {
    return NextResponse.json({ error: 'Error al obtener reservas' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const parsed = bookingSchema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })

  try {
    const booking = await BookingService.create(parsed.data, session.user.id)
    return NextResponse.json(booking, { status: 201 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error al crear reserva'
    const status = msg.includes('disponible') || msg.includes('pasadas') ? 409 : 400
    return NextResponse.json({ error: msg }, { status })
  }
}
