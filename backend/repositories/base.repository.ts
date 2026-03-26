export interface IRepository<T> {
  findAll(filter?: Record<string, unknown>): Promise<T[]>
  findById(id: string): Promise<T | null>
  create(data: Partial<T>): Promise<T>
  update(id: string, data: Partial<T>): Promise<T | null>
  remove(id: string): Promise<void>
}
