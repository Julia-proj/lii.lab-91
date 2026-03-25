import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import Booking from '@/models/Booking'
import { auth } from '@/lib/auth'
import { notifyCancellation, notifyAdminConfirmation } from '@/lib/notifications'

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
      // Reschedule: allow admin to change date and times
      if (typeof body.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.date)) {
        updateFields.date = body.date
      }
      if (typeof body.startTime === 'string' && /^\d{2}:\d{2}$/.test(body.startTime)) {
        updateFields.startTime = body.startTime
      }
      if (typeof body.endTime === 'string' && /^\d{2}:\d{2}$/.test(body.endTime)) {
        updateFields.endTime = body.endTime
      }
      // Conflict check when rescheduling
      if (updateFields.date || updateFields.startTime || updateFields.endTime) {
        const newDate = (updateFields.date as string) || (existing as { date: string }).date
        const newStart = (updateFields.startTime as string) || (existing as { startTime?: string }).startTime
        const newEnd = (updateFields.endTime as string) || (existing as { endTime?: string }).endTime
        if (newDate && newStart && newEnd) {
          const conflict = await Booking.findOne({
            _id: { $ne: id },
            date: newDate,
            status: { $nin: ['cancelada'] },
            $or: [
              { startTime: { $lt: newEnd }, endTime: { $gt: newStart } },
            ],
          }).lean()
          if (conflict) {
            return NextResponse.json({ error: 'Ese horario ya está ocupado' }, { status: 409 })
          }
        }
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

    // Fire notifications on status change (non-blocking)
    if (updateFields.status === 'cancelada' || updateFields.status === 'confirmada') {
      const user = updated.user as { name: string; email: string; phone?: string }
      const svcList = updated.services as { name: string; price: number }[]
      const wasAlreadyConfirmed = existing.status === 'confirmada'

      if (user?.email && svcList?.length > 0) {
        const notifPayload = {
          clientName: user.name,
          clientEmail: user.email,
          clientPhone: user.phone,
          serviceName: svcList.map((s) => s.name).join(', '),
          date: updated.date,
          startTime: updated.startTime,
          endTime: updated.endTime,
          price: svcList.reduce((sum, s) => sum + s.price, 0),
        }
        if (updateFields.status === 'cancelada') {
          notifyCancellation(notifPayload)
            .catch((err) => console.error('Cancellation notification error:', err))
        } else if (updateFields.status === 'confirmada' && !wasAlreadyConfirmed) {
          notifyAdminConfirmation(notifPayload)
            .catch((err) => console.error('Confirmation notification error:', err))
        }
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
