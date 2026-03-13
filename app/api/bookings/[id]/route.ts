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

    // Users can only see their own bookings, admins can see all
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

    const booking = await Booking.findById(id)
    if (!booking) {
      return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 })
    }

    // Users can only cancel their own bookings
    if (session.user.role !== 'admin' && booking.user.toString() !== session.user.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    // Admin can change any valid status, user can only cancel
    const validStatuses = ['pendiente', 'confirmada', 'cancelada', 'completada']
    let changed = false;
    if (session.user.role === 'admin') {
      if (body.status) {
        if (!validStatuses.includes(body.status)) {
          return NextResponse.json({ error: 'Estado no válido' }, { status: 400 })
        }
        booking.status = body.status
        changed = true;
      }
      if (typeof body.paidAmount === 'number') {
        booking.paidAmount = body.paidAmount;
        changed = true;
      }
      if (typeof body.adminNotes === 'string') {
        booking.adminNotes = body.adminNotes;
        changed = true;
      }
    } else if (body.status === 'cancelada') {
      booking.status = 'cancelada'
      changed = true;
    } else {
      return NextResponse.json({ error: 'Acción no permitida' }, { status: 400 })
    }

    if (changed) {
      await booking.save()
    }

    const populated = await Booking.findById(booking._id)
      .populate('services', 'name category price duration')
      .populate('user', 'name email phone')

    // Send cancellation notification if status changed to cancelled
    if (booking.status === 'cancelada' && populated?.user && populated?.services?.length > 0) {
      const user = populated.user as { name: string; email: string; phone?: string }
      const svcList = populated.services as { name: string; price: number }[]
      const serviceNames = svcList.map((s) => s.name).join(', ')
      const totalPrice = svcList.reduce((sum, s) => sum + s.price, 0)
      notifyCancellation({
        clientName: user.name,
        clientEmail: user.email,
        clientPhone: user.phone,
        serviceName: serviceNames,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        price: totalPrice,
      }).catch((err) => console.error('Cancellation notification error:', err))
    }

    return NextResponse.json(populated)
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
