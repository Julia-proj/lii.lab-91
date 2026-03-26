import { dbConnect } from '@/lib/db'
import CourseBooking, { ICourseBookingDocument } from '@/models/CourseBooking'
import type { IRepository } from './base.repository'

class CourseBookingRepository implements IRepository<ICourseBookingDocument> {
  async findAll(filter: Record<string, unknown> = {}) {
    await dbConnect()
    return CourseBooking.find(filter)
      .populate('user', 'name email phone')
      .sort({ startDate: -1 })
      .lean()
  }

  async findById(id: string) {
    await dbConnect()
    return CourseBooking.findById(id).populate('user', 'name email phone').lean()
  }

  async create(data: Partial<ICourseBookingDocument>) {
    await dbConnect()
    return CourseBooking.create(data)
  }

  async update(id: string, data: Partial<ICourseBookingDocument>) {
    await dbConnect()
    return CourseBooking.findByIdAndUpdate(id, data, { new: true })
  }

  async remove(id: string) {
    await dbConnect()
    await CourseBooking.findByIdAndDelete(id)
  }

  async findActive() {
    await dbConnect()
    return CourseBooking.find({ status: { $in: ['confirmada', 'pendiente'] } }).lean()
  }
}

export const courseBookingRepository = new CourseBookingRepository()
