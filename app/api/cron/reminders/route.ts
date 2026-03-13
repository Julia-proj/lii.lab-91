import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import Booking from '@/models/Booking'
import { sendBookingReminder } from '@/lib/notifications'
import { addDays, format } from 'date-fns'

export async function GET(req: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized calls
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    // Find bookings for tomorrow
    const tomorrow = addDays(new Date(), 1)
    const tomorrowStr = format(tomorrow, 'yyyy-MM-dd')

    const bookings = await Booking.find({
      date: tomorrowStr,
      status: { $in: ['confirmada', 'pendiente'] },
    })
      .populate('service', 'name price duration')
      .populate('user', 'name email phone')
      .lean()

    let sent = 0
    let failed = 0

    for (const booking of bookings) {
      const user = booking.user as { name: string; email: string; phone?: string }
      const service = booking.service as { name: string; price: number }

      if (!user || !service) continue

      try {
        await sendBookingReminder({
          clientName: user.name,
          clientEmail: user.email,
          clientPhone: user.phone,
          serviceName: service.name,
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime,
          price: service.price,
        })
        sent++
      } catch (err) {
        console.error(`Reminder failed for booking ${booking._id}:`, err)
        failed++
      }
    }

    return NextResponse.json({
      message: `Reminders processed: ${sent} sent, ${failed} failed out of ${bookings.length} bookings`,
      sent,
      failed,
      total: bookings.length,
    })
  } catch (error) {
    console.error('Cron reminders error:', error)
    return NextResponse.json({ error: 'Error processing reminders' }, { status: 500 })
  }
}
