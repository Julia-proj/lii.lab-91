import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { courseBookingSchema } from '@/lib/validators'
import { CourseService } from '@/backend/services/course.service'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 })

  try {
    const bookings = await CourseService.getAll(session.user.id, session.user.role)
    return NextResponse.json({ success: true, data: bookings })
  } catch {
    return NextResponse.json({ success: false, error: 'Error al obtener reservas de curso' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 })

  const parsed = courseBookingSchema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ success: false, error: parsed.error.errors[0].message }, { status: 400 })

  try {
    const booking = await CourseService.create(parsed.data, session.user.id)
    return NextResponse.json({ success: true, data: booking }, { status: 201 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error al crear reserva de curso'
    return NextResponse.json({ success: false, error: msg }, { status: msg.includes('bloqueada') || msg.includes('reservado') ? 409 : 400 })
  }
}
