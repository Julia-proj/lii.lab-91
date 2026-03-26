import { dbConnect } from '@/lib/db'
import Booking, { IBookingDocument } from '@/models/Booking'
import type { IRepository } from './base.repository'

class BookingRepository implements IRepository<IBookingDocument> {
  async findAll(filter: Record<string, unknown> = {}) {
    await dbConnect()
    return Booking.find(filter)
      .populate('services', 'name category price duration')
      .populate('user', 'name email phone')
      .sort({ date: -1, startTime: -1 })
  }

  async findById(id: string) {
    await dbConnect()
    return Booking.findById(id)
      .populate('services', 'name category price duration')
      .populate('user', 'name email phone')
  }

  async create(data: Partial<IBookingDocument>) {
    await dbConnect()
    return Booking.create(data)
  }

  async update(id: string, data: Partial<IBookingDocument>) {
    await dbConnect()
    return Booking.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: false })
      .populate('services', 'name category price duration')
      .populate('user', 'name email phone')
  }

  async remove(id: string) {
    await dbConnect()
    await Booking.findByIdAndDelete(id)
  }

  async findConflict(date: string, startTime: string, endTime: string, excludeId?: string) {
    await dbConnect()
    const filter: Record<string, unknown> = {
      date,
      status: { $in: ['confirmada', 'pendiente'] },
      $expr: {
        $and: [
          { $lt: ['$startTime', endTime] },
          { $gt: ['$endTime', startTime] },
        ],
      },
    }
    if (excludeId) filter._id = { $ne: excludeId }
    return Booking.findOne(filter).lean()
  }
}

export const bookingRepository = new BookingRepository()
