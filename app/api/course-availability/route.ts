import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import BlockedDate from '@/models/BlockedDate'
import CourseBooking from '@/models/CourseBooking'
import { findAvailableCourseWindows } from '@/lib/course-availability'
import { addDays, startOfDay } from 'date-fns'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const weeksAhead = Math.min(Math.max(parseInt(searchParams.get('weeks') || '12', 10) || 12, 1), 52)

    await dbConnect()

    const blockedDocs = await BlockedDate.find().lean()
    const blockedDates = blockedDocs.map((b) => new Date(b.date))

    const activeCourses = await CourseBooking.find({
      status: { $in: ['confirmada', 'pendiente'] },
    }).lean()
    const existingCourseDays = activeCourses.flatMap((c) =>
      c.days.map((d: string | Date) => new Date(d))
    )

    const startFrom = startOfDay(addDays(new Date(), 1)) // Start from tomorrow

    const availableStartDates = findAvailableCourseWindows({
      startFrom,
      weeksAhead,
      blockedDates,
      existingCourseDays,
    })

    return NextResponse.json({
      availableStartDates: availableStartDates.map((d) =>
        d.toISOString().split('T')[0]
      ),
    })
  } catch (error) {
    console.error('Error fetching course availability:', error)
    return NextResponse.json(
      { error: 'Error al obtener disponibilidad del curso' },
      { status: 500 }
    )
  }
}
