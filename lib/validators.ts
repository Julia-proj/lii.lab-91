import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2, 'El nombre es obligatorio'),
  email: z.string().email('Email no válido'),
  phone: z.string().min(9, 'Teléfono no válido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

export const loginSchema = z.object({
  email: z.string().email('Email no válido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
})

export const bookingSchema = z.object({
  serviceId: z.string().min(1, 'Servicio obligatorio'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Formato de hora inválido'),
  quantity: z.number().int().min(1).max(10).optional(),
  notes: z.string().optional(),
})

export const courseBookingSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido'),
  notes: z.string().optional(),
})

export const blockedDateSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido'),
  reason: z.string().optional(),
})

export const serviceSchema = z.object({
  name: z.string().min(1, 'Nombre obligatorio'),
  category: z.enum(['Manicura', 'Pedicura', 'Reconstruccion', 'Retirado', 'Combo']),
  price: z.number().positive('El precio debe ser positivo'),
  duration: z.number().int().positive('La duración debe ser positiva'),
  description: z.string().optional(),
  active: z.boolean().default(true),
  popular: z.boolean().default(false),
  includes: z.string().optional(),
})

export const profileSchema = z.object({
  name: z.string().min(2, 'El nombre es obligatorio'),
  phone: z.string().min(9, 'Teléfono no válido'),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type BookingInput = z.infer<typeof bookingSchema>
export type CourseBookingInput = z.infer<typeof courseBookingSchema>
export type BlockedDateInput = z.infer<typeof blockedDateSchema>
export type ServiceInput = z.infer<typeof serviceSchema>
export type ProfileInput = z.infer<typeof profileSchema>
