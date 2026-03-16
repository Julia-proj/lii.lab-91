import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import Booking from '@/models/Booking'
import { auth } from '@/lib/auth'
import { notifyCancellation } from '@/lib/notifications'

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

    const booking = await Booking.findById(id)
      .populate('services', 'name category price duration')
      .populate('user', 'name email phone')

    if (!booking) {
      return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 })
    }

    if (session.user.role !== 'admin' && booking.user._id.toString() !== session.user.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error fetching booking:', error)
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

    // Fetch only what's needed for auth check (lean — fast, no mongoose overhead)
    const existing = await Booking.findById(id).select('user status').lean()
    if (!existing) {
      return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 })
    }

    // Auth check: users can only touch their own bookings
    if (session.user.role !== 'admin' && existing.user.toString() !== session.user.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    // Build the $set payload
    const validStatuses = ['pendiente', 'confirmada', 'cancelada', 'completada']
    const updateFields: Record<string, unknown> = {}

    if (session.user.role === 'admin') {
      if (body.status !== undefined) {
        if (!validStatuses.includes(body.status)) {
          return NextResponse.json({ error: 'Estado no válido' }, { status: 400 })
        }
        updateFields.status = body.status
      }
      if (typeof body.paidAmount === 'number') {
        updateFields.paidAmount = body.paidAmount
      }
      if (typeof body.adminNotes === 'string') {
        updateFields.adminNotes = body.adminNotes
      }
    } else {
      // Regular user: only allowed to cancel
      if (body.status === 'cancelada') {
        updateFields.status = 'cancelada'
      } else {
        return NextResponse.json({ error: 'Acción no permitida' }, { status: 403 })
      }
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ error: 'Nada que actualizar' }, { status: 400 })
    }

    // Use findByIdAndUpdate — avoids save() validation issues with legacy documents
    const updated = await Booking.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: false }
    )
      .populate('services', 'name category price duration')
      .populate('user', 'name email phone')

    if (!updated) {
      return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 })
    }

    // Fire cancellation notification (non-blocking)
    if (updateFields.status === 'cancelada') {
      const user = updated.user as { name: string; email: string; phone?: string }
      const svcList = updated.services as { name: string; price: number }[]
      if (user?.email && svcList?.length > 0) {
        notifyCancellation({
          clientName: user.name,
          clientEmail: user.email,
          clientPhone: user.phone,
          serviceName: svcList.map((s) => s.name).join(', '),
          date: updated.date,
          startTime: updated.startTime,
          endTime: updated.endTime,
          price: svcList.reduce((sum, s) => sum + s.price, 0),
        }).catch((err) => console.error('Cancellation notification error:', err))
      }
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json({ error: 'Error al actualizar reserva' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { id } = await params
    await dbConnect()

    const booking = await Booking.findByIdAndDelete(id)
    if (!booking) {
      return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Reserva eliminada' })
  } catch (error) {
    console.error('Error deleting booking:', error)
    return NextResponse.json({ error: 'Error al eliminar reserva' }, { status: 500 })
  }
}
