import { dbConnect } from '@/lib/db'
import User, { IUserDocument } from '@/models/User'
import type { IRepository } from './base.repository'

class UserRepository implements IRepository<IUserDocument> {
  async findAll(filter: Record<string, unknown> = {}) {
    await dbConnect()
    return User.find(filter).sort({ createdAt: -1 })
  }

  async findById(id: string) {
    await dbConnect()
    return User.findById(id)
  }

  async findByEmail(email: string) {
    await dbConnect()
    return User.findOne({ email: email.toLowerCase() })
  }

  async create(data: Partial<IUserDocument>) {
    await dbConnect()
    return User.create(data)
  }

  async update(id: string, data: Partial<IUserDocument>) {
    await dbConnect()
    return User.findByIdAndUpdate(id, data, { new: true })
  }

  async remove(id: string) {
    await dbConnect()
    await User.findByIdAndDelete(id)
  }
}

export const userRepository = new UserRepository()
