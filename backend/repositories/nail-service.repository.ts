import { dbConnect } from '@/lib/db'
import Service, { IServiceDocument } from '@/models/Service'
import type { IRepository } from './base.repository'

class NailServiceRepository implements IRepository<IServiceDocument> {
  async findAll(filter: Record<string, unknown> = {}) {
    await dbConnect()
    return Service.find(filter).sort({ category: 1, name: 1 })
  }

  async findById(id: string) {
    await dbConnect()
    return Service.findById(id)
  }

  async create(data: Partial<IServiceDocument>) {
    await dbConnect()
    return Service.create(data)
  }

  async update(id: string, data: Partial<IServiceDocument>) {
    await dbConnect()
    return Service.findByIdAndUpdate(id, data, { new: true })
  }

  async remove(id: string) {
    await dbConnect()
    await Service.findByIdAndUpdate(id, { active: false })
  }
}

export const nailServiceRepository = new NailServiceRepository()
