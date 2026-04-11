import { z } from 'zod'

// --- Auth ---

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'El nombre es obligatorio'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(9, 'Teléfono no válido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

export const registerFormSchema = registerSchema.extend({
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

export const profileSchema = z.object({
  name: z.string().min(2, 'El nombre es obligatorio'),
  phone: z.string().min(9, 'Teléfono no válido').optional(),
})

export const inlineLoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

// --- Bookings ---

export const bookingSchema = z.object({
  services: z.array(z.string()).min(1),
  quantities: z.record(z.string(), z.number().int().min(1)).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Formato de hora inválido'),
  notes: z.string().optional(),
})

export const courseBookingSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido'),
  courseType: z.enum(['manic-0.0', 'perfeccionamiento']).default('manic-0.0'),
  notes: z.string().optional(),
})

// --- Admin ---

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
  image: z.string().optional(),
})

// --- Types ---

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type RegisterFormInput = z.infer<typeof registerFormSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type InlineLoginInput = z.infer<typeof inlineLoginSchema>
export type BookingInput = z.infer<typeof bookingSchema>
export type CourseBookingInput = z.infer<typeof courseBookingSchema>
export type BlockedDateInput = z.infer<typeof blockedDateSchema>
export type ServiceInput = z.infer<typeof serviceSchema>
