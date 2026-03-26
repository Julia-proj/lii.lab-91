import { nailServiceRepository } from '@/backend/repositories/nail-service.repository'
import type { ServiceInput } from '@/lib/validators'

export const NailServiceService = {
  async getAll(filters: { category?: string; all?: boolean; popular?: boolean }) {
    const filter: Record<string, unknown> = {}
    if (!filters.all) filter.active = true
    if (filters.category) filter.category = filters.category
    if (filters.popular) filter.popular = true
    return nailServiceRepository.findAll(filter)
  },

  async getById(id: string) {
    const service = await nailServiceRepository.findById(id)
    if (!service) throw new Error('Servicio no encontrado')
    return service
  },

  async create(data: ServiceInput) {
    return nailServiceRepository.create(data)
  },

  async update(id: string, data: Partial<ServiceInput>) {
    const service = await nailServiceRepository.update(id, data)
    if (!service) throw new Error('Servicio no encontrado')
    return service
  },

  async deactivate(id: string) {
    const service = await nailServiceRepository.update(id, { active: false })
    if (!service) throw new Error('Servicio no encontrado')
    return service
  },
}
