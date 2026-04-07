import { bookingRepository } from '@/backend/repositories/booking.repository'
import { nailServiceRepository } from '@/backend/repositories/nail-service.repository'
import { notifyNewBooking, notifyCancellation, notifyAdminConfirmation, notifyReschedule } from '@/lib/notifications'
import { parseTimeToMinutes, minutesToTime } from '@/lib/schedule'
import type { BookingInput } from '@/lib/validators'

function getTodayInSpain() {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Madrid' }))
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return { today: `${y}-${m}-${d}`, nowMinutes: now.getHours() * 60 + now.getMinutes() }
}

export const BookingService = {
  async getAll(userId: string, role: string) {
    const filter = role === 'admin' ? {} : { user: userId }
    return bookingRepository.findAll(filter)
  },

  async getById(id: string) {
    return bookingRepository.findById(id)
  },

  async create(data: BookingInput, userId: string) {
    const { services: serviceIds, quantities = {}, date, startTime, notes } = data

    const services = await nailServiceRepository.findAll({ _id: { $in: serviceIds }, active: true })
    if (services.length !== serviceIds.length) {
      throw new Error('Uno o más servicios no están disponibles')
    }

    const totalDuration = services.reduce((sum, svc) => {
      const qty = quantities[svc._id.toString()] ?? 1
      return sum + svc.duration * qty
    }, 0)

    const endTime = minutesToTime(parseTimeToMinutes(startTime) + totalDuration)
    const { today, nowMinutes } = getTodayInSpain()

    if (date < today) throw new Error('No se pueden reservar fechas pasadas')
    if (date === today && parseTimeToMinutes(startTime) <= nowMinutes) {
      throw new Error('No se pueden reservar horas ya pasadas')
    }

    const conflict = await bookingRepository.findConflict(date, startTime, endTime)
    if (conflict) throw new Error('El horario seleccionado ya no está disponible')

    const booking = await bookingRepository.create({
      user: userId as unknown as import('mongoose').Types.ObjectId,
      services: serviceIds as unknown as import('mongoose').Types.ObjectId[],
      quantities: Object.keys(quantities).length > 0 ? new Map(Object.entries(quantities)) : undefined,
      date,
      startTime,
      endTime,
      status: 'pendiente',
      notes: notes || undefined,
    })

    const populated = await bookingRepository.findById(booking._id.toString())

    if (populated?.user && populated?.services?.length > 0) {
      const user = populated.user as unknown as { name: string; email: string; phone?: string }
      const svcList = populated.services as unknown as { name: string; price: number }[]
      const totalPrice = svcList.reduce((sum, s, i) => {
        const qty = quantities[serviceIds[i]] ?? 1
        return sum + s.price * qty
      }, 0)
      notifyNewBooking({
        clientName: user.name,
        clientEmail: user.email,
        clientPhone: user.phone,
        serviceName: svcList.map((s) => s.name).join(', '),
        date,
        startTime,
        endTime,
        price: totalPrice,
      }).catch(() => undefined)
    }

    return populated
  },

  async update(id: string, body: Record<string, unknown>, userId: string, role: string) {
    const existing = await bookingRepository.findById(id)
    if (!existing) throw new Error('Reserva no encontrada')

    const ownerId = (existing.user as { _id: { toString(): string } })?._id?.toString() ?? existing.user.toString()
    if (role !== 'admin' && ownerId !== userId) throw new Error('No autorizado')

    const validStatuses = ['pendiente', 'confirmada', 'cancelada', 'completada']
    const updateFields: Record<string, unknown> = {}

    if (role === 'admin') {
      if (body.status !== undefined) {
        if (!validStatuses.includes(body.status as string)) throw new Error('Estado no válido')
        updateFields.status = body.status
      }
      if (typeof body.paidAmount === 'number') updateFields.paidAmount = body.paidAmount
      if (typeof body.adminNotes === 'string') updateFields.adminNotes = body.adminNotes
      if (typeof body.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.date)) updateFields.date = body.date
      if (typeof body.startTime === 'string') updateFields.startTime = body.startTime
      if (typeof body.endTime === 'string') updateFields.endTime = body.endTime

      if (updateFields.date || updateFields.startTime || updateFields.endTime) {
        const newDate = (updateFields.date as string) || existing.date
        const newStart = (updateFields.startTime as string) || existing.startTime
        const newEnd = (updateFields.endTime as string) || existing.endTime
        const conflict = await bookingRepository.findConflict(newDate, newStart, newEnd, id)
        if (conflict) throw new Error('Ese horario ya está ocupado')
      }
    } else {
      if (body.status === 'cancelada') updateFields.status = 'cancelada'
      else throw new Error('Acción no permitida')
    }

    if (Object.keys(updateFields).length === 0) throw new Error('Nada que actualizar')

    const updated = await bookingRepository.update(id, updateFields)
    if (!updated) throw new Error('Reserva no encontrada')

    const user = updated.user as unknown as { name: string; email: string; phone?: string }
    const svcList = updated.services as unknown as { name: string; price: number }[]

    if (user?.email && svcList?.length > 0) {
      const payload = {
        clientName: user.name,
        clientEmail: user.email,
        clientPhone: user.phone,
        serviceName: svcList.map((s) => s.name).join(', '),
        date: updated.date,
        startTime: updated.startTime,
        endTime: updated.endTime,
        price: svcList.reduce((sum, s) => sum + s.price, 0),
      }

      if (updateFields.status === 'cancelada') {
        notifyCancellation(payload).catch(() => undefined)
      } else if (updateFields.status === 'confirmada') {
        const wasConfirmed = existing.status === 'confirmada'
        if (!wasConfirmed) notifyAdminConfirmation(payload).catch(() => undefined)
      } else if (updateFields.date || updateFields.startTime || updateFields.endTime) {
        // Admin moved the booking — notify the client of the new date/time
        notifyReschedule(payload).catch(() => undefined)
      }
    }

    return updated
  },

  async remove(id: string) {
    const booking = await bookingRepository.findById(id)
    if (!booking) throw new Error('Reserva no encontrada')
    await bookingRepository.remove(id)
  },
}
