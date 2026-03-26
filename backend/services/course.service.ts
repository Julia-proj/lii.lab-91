import { courseBookingRepository } from '@/backend/repositories/course-booking.repository'
import { blockedDateRepository } from '@/backend/repositories/blocked-date.repository'
import { userRepository } from '@/backend/repositories/user.repository'
import { getCourseDays } from '@/lib/course-availability'
import { sendWhatsAppToAdmin } from '@/lib/whatsapp'
import { isSameDay } from 'date-fns'
import type { CourseBookingInput } from '@/lib/validators'

export const CourseService = {
  async getAll(userId: string, role: string) {
    const filter = role === 'admin' ? {} : { user: userId }
    return courseBookingRepository.findAll(filter)
  },

  async getById(id: string) {
    const booking = await courseBookingRepository.findById(id)
    if (!booking) throw new Error('Reserva no encontrada')
    return booking
  },

  async create(data: CourseBookingInput, userId: string) {
    const startDate = new Date(data.startDate + 'T00:00:00')
    const courseType = data.courseType || 'manic-0.0'

    let courseDays: Date[]
    if (courseType === 'perfeccionamiento') {
      const dow = startDate.getDay()
      if (dow === 0 || dow === 6) throw new Error('La fecha seleccionada debe ser un día laborable')
      courseDays = [startDate]
    } else {
      courseDays = getCourseDays(startDate)
      if (courseDays.length !== 3) throw new Error('La fecha seleccionada no permite 3 días laborables consecutivos')
    }

    const [blockedDocs, activeCourses] = await Promise.all([
      blockedDateRepository.findAll(),
      courseBookingRepository.findActive(),
    ])
    const blockedDates = blockedDocs.map((b) => new Date(b.date))
    const existingCourseDays = activeCourses.flatMap((c) => c.days.map((d) => new Date(d)))

    for (const day of courseDays) {
      if (blockedDates.some((bd) => isSameDay(bd, day))) {
        throw new Error('Una de las fechas está bloqueada. Por favor, elige otra fecha.')
      }
      if (existingCourseDays.some((cd) => isSameDay(cd, day))) {
        throw new Error('Una de las fechas ya tiene un curso reservado. Por favor, elige otra fecha.')
      }
    }

    const courseBooking = await courseBookingRepository.create({
      user: userId as unknown as import('mongoose').Types.ObjectId,
      startDate: data.startDate,
      days: courseDays.map((d) => d.toISOString().split('T')[0]),
      courseType,
      status: 'confirmada',
      notes: data.notes || '',
    })

    userRepository.findById(userId).then((user) => {
      const daysFormatted = courseDays.map((d, i) =>
        `Día ${i + 1}: ${d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}`
      ).join('\n')
      const msg =
        `Nueva reserva de CURSO Lii.lab:\n` +
        `${user?.name || 'Cliente'}\n` +
        `${user?.email || ''}\n` +
        (user?.phone ? `${user.phone}\n` : '') +
        `${courseType === 'perfeccionamiento' ? 'Perfeccionamiento · 349,99€' : 'MANIC 0.0 · 749,99€'}\n` +
        `${daysFormatted}`
      sendWhatsAppToAdmin(msg).catch(() => undefined)
    }).catch(() => undefined)

    return courseBooking
  },

  async update(id: string, body: { status?: string }, userId: string, role: string) {
    const booking = await courseBookingRepository.findById(id)
    if (!booking) throw new Error('Reserva no encontrada')

    const ownerId = (booking.user as { _id: { toString(): string } })?._id?.toString() ?? (booking.user as unknown as string)
    if (ownerId !== userId && role !== 'admin') throw new Error('No autorizado')

    const allowedStatuses = ['pendiente', 'confirmada', 'cancelada']
    if (body.status && allowedStatuses.includes(body.status)) {
      if (role === 'admin' || body.status === 'cancelada') {
        return courseBookingRepository.update(id, { status: body.status as ICourseStatus })
      }
    }
    return booking
  },

  async remove(id: string) {
    await courseBookingRepository.remove(id)
  },
}

type ICourseStatus = 'pendiente' | 'confirmada' | 'cancelada'
