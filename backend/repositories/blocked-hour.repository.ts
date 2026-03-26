import { dbConnect } from '@/lib/db'
import BlockedHour, { IBlockedHourDocument } from '@/models/BlockedHour'
import type { IRepository } from './base.repository'

class BlockedHourRepository implements IRepository<IBlockedHourDocument> {
  async findAll(filter: Record<string, unknown> = {}) {
    await dbConnect()
    return BlockedHour.find(filter).sort({ date: 1, startTime: 1 })
  }

  async findById(id: string) {
    await dbConnect()
    return BlockedHour.findById(id)
  }

  async findByDate(date: string) {
    await dbConnect()
    return BlockedHour.find({ date })
  }

  async create(data: Partial<IBlockedHourDocument>) {
    await dbConnect()
    return BlockedHour.create(data)
  }

  async update(id: string, data: Partial<IBlockedHourDocument>) {
    await dbConnect()
    return BlockedHour.findByIdAndUpdate(id, data, { new: true })
  }

  async remove(id: string) {
    await dbConnect()
    await BlockedHour.findByIdAndDelete(id)
  }

  async findOverlap(date: string, startTime: string, endTime: string) {
    await dbConnect()
    return BlockedHour.findOne({
      date,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    })
  }
}

export const blockedHourRepository = new BlockedHourRepository()
