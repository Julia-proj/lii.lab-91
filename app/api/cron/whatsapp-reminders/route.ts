import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import Booking from '@/models/Booking'
import { sendWhatsAppTemplate } from '@/lib/whatsapp'

type UserPopulated = { name: string; email: string; phone?: string }

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const templateSid = process.env.TWILIO_TEMPLATE_SID
    if (!templateSid) {
      return NextResponse.json(
        { success: false, error: 'TWILIO_TEMPLATE_SID not configured' },
        { status: 500 },
      )
    }

    await dbConnect()

    // Calculate tomorrow in Europe/Madrid timezone
    const madridNow = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Europe/Madrid' }),
    )
    const tomorrow = new Date(madridNow)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().slice(0, 10) // YYYY-MM-DD

    const bookings = await Booking.find({
      date: tomorrowStr,
      status: 'confirmada',
      whatsappReminderSent: { $ne: true },
    }).populate('user', 'name email phone')

    let sent = 0
    let failed = 0
    const errors: string[] = []

    for (const booking of bookings) {
      const user = booking.user as unknown as UserPopulated
      if (!user?.phone) continue

      const result = await sendWhatsAppTemplate(user.phone, templateSid, {
        '1': user.name,
        '2': booking.startTime,
      })

      if (result.success) {
        await Booking.updateOne({ _id: booking._id }, { whatsappReminderSent: true })
        sent++
      } else {
        errors.push(`${booking._id}: ${result.error}`)
        failed++
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        date: tomorrowStr,
        sent,
        failed,
        total: bookings.length,
        ...(errors.length > 0 && { errors }),
      },
    })
  } catch (error) {
    console.error('WhatsApp reminders cron error:', error)
    return NextResponse.json(
      { success: false, error: 'Error processing WhatsApp reminders' },
      { status: 500 },
    )
  }
}
