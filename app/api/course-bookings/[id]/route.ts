import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import CourseBooking from '@/models/CourseBooking'
import { auth } from '@/lib/auth'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params
    await dbConnect()

    const booking = await CourseBooking.findById(id).populate('user', 'name email phone').lean()
    if (!booking) {
      return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 })
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error fetching course booking:', error)
    return NextResponse.json({ error: 'Error al obtener reserva' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()

    await dbConnect()

    const booking = await CourseBooking.findById(id)
    if (!booking) {
      return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 })
    }

    // Only owner or admin can cancel
    if (booking.user.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    if (body.status === 'cancelada') {
      booking.status = 'cancelada'
      await booking.save()
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error updating course booking:', error)
    return NextResponse.json({ error: 'Error al actualizar reserva' }, { status: 500 })
  }
}
