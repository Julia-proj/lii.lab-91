import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { BookingService } from '@/backend/services/booking.service'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  try {
    const booking = await BookingService.getById(id)
    if (!booking) return NextResponse.json({ success: false, error: 'Reserva no encontrada' }, { status: 404 })

    const ownerId = (booking.user as { _id: { toString(): string } })?._id?.toString() ?? booking.user.toString()
    if (session.user.role !== 'admin' && ownerId !== session.user.id) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 403 })
    }
    return NextResponse.json({ success: true, data: booking })
  } catch {
    return NextResponse.json({ success: false, error: 'Error al obtener reserva' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  try {
    const updated = await BookingService.update(id, await req.json(), session.user.id, session.user.role)
    return NextResponse.json({ success: true, data: updated })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error al actualizar reserva'
    if (msg === 'No autorizado') return NextResponse.json({ success: false, error: msg }, { status: 403 })
    if (msg === 'Reserva no encontrada') return NextResponse.json({ success: false, error: msg }, { status: 404 })
    if (msg === 'Ese horario ya está ocupado') return NextResponse.json({ success: false, error: msg }, { status: 409 })
    return NextResponse.json({ success: false, error: msg }, { status: 400 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 403 })
  }

  const { id } = await params
  try {
    await BookingService.remove(id)
    return NextResponse.json({ success: true })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error al eliminar reserva'
    return NextResponse.json({ success: false, error: msg }, { status: 404 })
  }
}
