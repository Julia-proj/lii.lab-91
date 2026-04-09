import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { bookingSchema } from '@/lib/validators'
import { BookingService } from '@/backend/services/booking.service'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 })

  try {
    const bookings = await BookingService.getAll(session.user.id, session.user.role)
    return NextResponse.json({ success: true, data: bookings })
  } catch {
    return NextResponse.json({ success: false, error: 'Error al obtener reservas' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 })

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ success: false, error: 'Formato de solicitud inválido' }, { status: 400 })
  }
  const parsed = bookingSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ success: false, error: parsed.error.errors[0].message }, { status: 400 })

  try {
    const booking = await BookingService.create(parsed.data, session.user.id)
    return NextResponse.json({ success: true, data: booking }, { status: 201 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error al crear reserva'
    const status = msg.includes('disponible') || msg.includes('pasadas') ? 409 : 400
    return NextResponse.json({ success: false, error: msg }, { status })
  }
}
