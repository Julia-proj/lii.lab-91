import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import CourseBooking from '@/models/CourseBooking'
import BlockedDate from '@/models/BlockedDate'
import { auth } from '@/lib/auth'
import { courseBookingSchema } from '@/lib/validators'
import { getCourseDays, findAvailableCourseWindows } from '@/lib/course-availability'
import { isSameDay, startOfDay, addDays } from 'date-fns'

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    await dbConnect()

    // Admin sees all, user sees only their own
    const filter =
      session.user.role === 'admin' ? {} : { user: session.user.id }

    const bookings = await CourseBooking.find(filter)
      .populate('user', 'name email phone')
      .sort({ startDate: -1 })
      .lean()

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error fetching course bookings:', error)
    return NextResponse.json(
      { error: 'Error al obtener reservas de curso' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = courseBookingSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    await dbConnect()

    const startDate = new Date(parsed.data.startDate + 'T00:00:00')

    // Validate: compute the 3 course days
    const courseDays = getCourseDays(startDate)
    if (courseDays.length !== 3) {
      return NextResponse.json(
        { error: 'La fecha seleccionada no permite 3 días laborables consecutivos' },
        { status: 400 }
      )
    }

    // Double-check availability (race condition protection)
    const blockedDocs = await BlockedDate.find().lean()
    const blockedDates = blockedDocs.map((b) => new Date(b.date))

    const activeCourses = await CourseBooking.find({
      status: { $in: ['confirmada', 'pendiente'] },
    }).lean()
    const existingCourseDays = activeCourses.flatMap((c) =>
      c.days.map((d: string | Date) => new Date(d))
    )

    // Check none of our 3 days are blocked or taken
    for (const day of courseDays) {
      if (blockedDates.some((bd) => isSameDay(bd, day))) {
        return NextResponse.json(
          { error: 'Una de las fechas está bloqueada. Por favor, elige otra fecha.' },
          { status: 409 }
        )
      }
      if (existingCourseDays.some((cd) => isSameDay(cd, day))) {
        return NextResponse.json(
          { error: 'Una de las fechas ya tiene un curso reservado. Por favor, elige otra fecha.' },
          { status: 409 }
        )
      }
    }

    const courseBooking = await CourseBooking.create({
      user: session.user.id,
      startDate: parsed.data.startDate,
      days: courseDays.map((d) => d.toISOString().split('T')[0]),
      status: 'confirmada',
      notes: parsed.data.notes || '',
    })

    return NextResponse.json(courseBooking, { status: 201 })
  } catch (error) {
    console.error('Error creating course booking:', error)
    return NextResponse.json(
      { error: 'Error al crear reserva de curso' },
      { status: 500 }
    )
  }
}
