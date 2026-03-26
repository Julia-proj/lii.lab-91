import { userRepository } from '@/backend/repositories/user.repository'
import type { RegisterInput, ProfileInput } from '@/lib/validators'

export const AuthService = {
  async register(data: RegisterInput) {
    const email = data.email.toLowerCase().trim()
    const existing = await userRepository.findByEmail(email)
    if (existing) throw new Error('Ya existe una cuenta con este email')

    const user = await userRepository.create({
      name: data.name,
      email,
      phone: data.phone,
      password: data.password,
      role: 'user',
    })
    return user
  },

  async getProfile(userId: string) {
    const user = await userRepository.findById(userId)
    if (!user) throw new Error('Usuario no encontrado')
    return user
  },

  async updateProfile(userId: string, data: ProfileInput) {
    const user = await userRepository.update(userId, { name: data.name, phone: data.phone })
    if (!user) throw new Error('Usuario no encontrado')
    return user
  },
}
