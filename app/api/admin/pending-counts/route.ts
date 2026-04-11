import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { Booking, CourseBooking } from '@/models'
import { auth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 403 })
    }

    await dbConnect()

    // Query pending regular bookings
    const pendingAgendaCount = await Booking.countDocuments({ status: 'pendiente' })
    // Query pending courses
    const pendingCoursesCount = await CourseBooking.countDocuments({ status: 'pendiente' })

    return NextResponse.json({
      success: true,
      data: {
        agenda: pendingAgendaCount,
        courses: pendingCoursesCount,
      },
    })
  } catch (error: any) {
    console.error('[API_PENDING_COUNTS] Error:', error.message)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}