import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import Service from '@/models/Service'
import Booking from '@/models/Booking'
import BlockedDate from '@/models/BlockedDate'
import BlockedHour from '@/models/BlockedHour'
import { generateAvailableSlots } from '@/lib/slots'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const dateStr = searchParams.get('date')
    const serviceId = searchParams.get('serviceId')
    const excludeId = searchParams.get('excludeId') // booking id to exclude from conflict check (reschedule)

    if (!dateStr || !serviceId) {
      return NextResponse.json(
        { error: 'Se requieren date y serviceId' },
        { status: 400 }
      )
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return NextResponse.json({ error: 'Formato de fecha inválido' }, { status: 400 })
    }

    await dbConnect()

    const service = await Service.findById(serviceId)
    if (!service || !service.active) {
      return NextResponse.json({ error: 'Servicio no encontrado' }, { status: 404 })
    }

    // Check if date is blocked
    const blocked = await BlockedDate.findOne({ date: dateStr })
    if (blocked) {
      return NextResponse.json({ slots: [], blocked: true })
    }

    // Get existing bookings for this date, excluding the current booking if rescheduling
    const bookingFilter: Record<string, unknown> = {
      date: dateStr,
      status: { $in: ['confirmada', 'pendiente'] },
    }
    if (excludeId) {
      bookingFilter._id = { $ne: excludeId }
    }
    const existingBookings = await Booking.find(bookingFilter).select('startTime endTime')

    // Get blocked hours for this date — treat them as fake bookings so slots
    // that overlap with blocked hours are excluded
    const blockedHours = await BlockedHour.find({ date: dateStr }).select('startTime endTime')

    const allBlocked = [
      ...existingBookings.map((b) => ({ startTime: b.startTime, endTime: b.endTime })),
      ...blockedHours.map((bh) => ({ startTime: bh.startTime, endTime: bh.endTime })),
    ]

    const date = new Date(dateStr + 'T00:00:00')

    // Allow duration override for multi-service bookings (total duration)
    const durationOverride = searchParams.get('duration')
    let effectiveDuration = service.duration
    if (durationOverride) {
      const parsed = parseInt(durationOverride, 10)
      if (isNaN(parsed) || parsed <= 0) {
        return NextResponse.json({ error: 'Duración inválida' }, { status: 400 })
      }
      effectiveDuration = parsed
    }

    let slots = generateAvailableSlots({
      date,
      serviceDuration: effectiveDuration,
      existingBookings: allBlocked,
    })

    // Filter out past time slots if the date is today (Europe/Madrid timezone)
    const nowInSpain = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Madrid' }))
    const today = `${nowInSpain.getFullYear()}-${String(nowInSpain.getMonth() + 1).padStart(2, '0')}-${String(nowInSpain.getDate()).padStart(2, '0')}`
    if (dateStr === today) {
      const nowMinutes = nowInSpain.getHours() * 60 + nowInSpain.getMinutes()
      slots = slots.filter((slot) => {
        const [h, m] = slot.split(':').map(Number)
        return h * 60 + m > nowMinutes
      })
    }

    return NextResponse.json({ slots, blocked: false })
  } catch (error) {
    console.error('Error fetching available slots:', error)
    return NextResponse.json({ error: 'Error al obtener horarios' }, { status: 500 })
  }
}
