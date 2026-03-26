import { dbConnect } from '@/lib/db'
import BlockedDate, { IBlockedDateDocument } from '@/models/BlockedDate'
import type { IRepository } from './base.repository'

class BlockedDateRepository implements IRepository<IBlockedDateDocument> {
  async findAll(filter: Record<string, unknown> = {}) {
    await dbConnect()
    return BlockedDate.find(filter).sort({ date: 1 })
  }

  async findById(id: string) {
    await dbConnect()
    return BlockedDate.findById(id)
  }

  async findByDate(date: string) {
    await dbConnect()
    return BlockedDate.findOne({ date })
  }

  async create(data: Partial<IBlockedDateDocument>) {
    await dbConnect()
    return BlockedDate.create(data)
  }

  async update(id: string, data: Partial<IBlockedDateDocument>) {
    await dbConnect()
    return BlockedDate.findByIdAndUpdate(id, data, { new: true })
  }

  async remove(id: string) {
    await dbConnect()
    await BlockedDate.findByIdAndDelete(id)
  }
}

export const blockedDateRepository = new BlockedDateRepository()
