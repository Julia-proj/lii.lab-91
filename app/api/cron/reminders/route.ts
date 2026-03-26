import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import Booking from '@/models/Booking'
import { sendBookingReminder } from '@/lib/notifications'
import { addDays, format } from 'date-fns'

type UserPopulated = { name: string; email: string; phone?: string }
type ServicePopulated = { name: string; price: number }

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const tomorrow = addDays(new Date(), 1)
    const tomorrowStr = format(tomorrow, 'yyyy-MM-dd')

    const bookings = await Booking.find({
      date: tomorrowStr,
      status: { $in: ['confirmada', 'pendiente'] },
    })
      .populate('services', 'name price duration')
      .populate('user', 'name email phone')
      .lean()

    let sent = 0
    let failed = 0

    for (const booking of bookings) {
      const user = booking.user as unknown as UserPopulated
      const svcList = (booking.services || []) as unknown as ServicePopulated[]

      if (!user || svcList.length === 0) continue

      const serviceNames = svcList.map((s) => s.name).join(', ')
      const totalPrice = svcList.reduce((sum, s) => sum + s.price, 0)

      try {
        await sendBookingReminder({
          clientName: user.name,
          clientEmail: user.email,
          clientPhone: user.phone,
          serviceName: serviceNames,
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime,
          price: totalPrice,
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
