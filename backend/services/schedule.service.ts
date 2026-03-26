import { blockedDateRepository } from '@/backend/repositories/blocked-date.repository'
import { blockedHourRepository } from '@/backend/repositories/blocked-hour.repository'
import { bookingRepository } from '@/backend/repositories/booking.repository'
import { courseBookingRepository } from '@/backend/repositories/course-booking.repository'
import { nailServiceRepository } from '@/backend/repositories/nail-service.repository'
import { generateAvailableSlots } from '@/lib/slots'
import { findAvailableCourseWindows, findAvailableSingleDays } from '@/lib/course-availability'
import { addDays, startOfDay } from 'date-fns'
import type { IBlockedDateDocument } from '@/models/BlockedDate'
import type { IBlockedHourDocument } from '@/models/BlockedHour'

export const ScheduleService = {
  async getAvailableSlots(dateStr: string, serviceId: string, options?: { duration?: number; excludeId?: string }) {
    const blocked = await blockedDateRepository.findByDate(dateStr)
    if (blocked) return { slots: [], blocked: true }

    const service = await nailServiceRepository.findById(serviceId)
    if (!service || !service.active) throw new Error('Servicio no encontrado')

    const bookingFilter: Record<string, unknown> = {
      date: dateStr,
      status: { $in: ['confirmada', 'pendiente'] },
    }
    if (options?.excludeId) bookingFilter._id = { $ne: options.excludeId }

    const [existingBookings, blockedHours] = await Promise.all([
      bookingRepository.findAll(bookingFilter),
      blockedHourRepository.findByDate(dateStr),
    ])

    const allBlocked = [
      ...existingBookings.map((b) => ({ startTime: b.startTime, endTime: b.endTime })),
      ...blockedHours.map((bh) => ({ startTime: bh.startTime, endTime: bh.endTime })),
    ]

    const effectiveDuration = options?.duration ?? service.duration
    const date = new Date(dateStr + 'T00:00:00')
    let slots = generateAvailableSlots({ date, serviceDuration: effectiveDuration, existingBookings: allBlocked })

    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Madrid' }))
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    if (dateStr === today) {
      const nowMin = now.getHours() * 60 + now.getMinutes()
      slots = slots.filter((slot) => {
        const [h, m] = slot.split(':').map(Number)
        return h * 60 + m > nowMin
      })
    }

    return { slots, blocked: false }
  },

  async getAllBlockedDates() {
    return blockedDateRepository.findAll()
  },

  async blockDate(date: string, reason: string | undefined, adminId: string) {
    const existing = await blockedDateRepository.findByDate(date)
    if (existing) throw new Error('Esta fecha ya está bloqueada')
    return blockedDateRepository.create({
      date,
      reason,
      blockedBy: adminId as unknown as IBlockedDateDocument['blockedBy'],
    })
  },

  async unblockDate(id: string) {
    const blocked = await blockedDateRepository.findById(id)
    if (!blocked) throw new Error('Fecha bloqueada no encontrada')
    await blockedDateRepository.remove(id)
  },

  async getBlockedHours(date?: string) {
    const filter = date ? { date } : {}
    return blockedHourRepository.findAll(filter)
  },

  async blockHour(data: { date: string; startTime: string; endTime: string; reason?: string }, adminId: string) {
    if (data.startTime >= data.endTime) throw new Error('La hora de inicio debe ser anterior a la hora de fin')
    const overlap = await blockedHourRepository.findOverlap(data.date, data.startTime, data.endTime)
    if (overlap) throw new Error('Se solapa con una hora ya bloqueada')
    return blockedHourRepository.create({
      ...data,
      blockedBy: adminId as unknown as IBlockedHourDocument['blockedBy'],
    })
  },

  async unblockHour(id: string) {
    const hour = await blockedHourRepository.findById(id)
    if (!hour) throw new Error('No encontrado')
    await blockedHourRepository.remove(id)
  },

  async getCourseAvailability(courseType: string, weeksAhead: number) {
    const [blockedDocs, activeCourses] = await Promise.all([
      blockedDateRepository.findAll(),
      courseBookingRepository.findActive(),
    ])
    const blockedDates = blockedDocs.map((b) => new Date(b.date))
    const existingCourseDays = activeCourses.flatMap((c) => c.days.map((d) => new Date(d)))
    const startFrom = startOfDay(addDays(new Date(), 1))

    const available = courseType === 'perfeccionamiento'
      ? findAvailableSingleDays({ startFrom, weeksAhead, blockedDates, existingCourseDays })
      : findAvailableCourseWindows({ startFrom, weeksAhead, blockedDates, existingCourseDays })

    return available.map((d) => d.toISOString().split('T')[0])
  },
}
