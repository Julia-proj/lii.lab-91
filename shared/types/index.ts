export type UserRole = 'user' | 'admin'

export type BookingStatus = 'pendiente' | 'confirmada' | 'cancelada' | 'completada'

export type CourseBookingStatus = 'pendiente' | 'confirmada' | 'cancelada'

export type GuideOrderStatus = 'pendiente' | 'pagado' | 'fallido'

export type ServiceCategory = 'Manicura' | 'Pedicura' | 'Reconstruccion' | 'Retirado' | 'Combo'

export interface TimeSlot {
  start: string // "10:00"
  end: string   // "10:45"
}

export interface TimeBlock {
  start: string // "10:00"
  end: string   // "14:00"
}

export interface DaySchedule {
  open: boolean
  blocks: TimeBlock[]
}

export type WeekSchedule = Record<number, DaySchedule> // 0=Sunday..6=Saturday

export interface IUser {
  _id: string
  name: string
  email: string
  phone?: string
  password?: string
  role: UserRole
  googleId?: string
  image?: string
  createdAt: Date
  updatedAt: Date
}

export interface IService {
  _id: string
  name: string
  category: ServiceCategory
  price: number
  duration: number // minutes
  description?: string
  active: boolean
  popular: boolean
  image?: string
  includes?: string
  createdAt: Date
  updatedAt: Date
}

export interface IBooking {
  _id: string
  user: string | IUser
  services: (string | IService)[]
  quantities?: Record<string, number> // serviceId -> quantity
  date: string // YYYY-MM-DD
  startTime: string // "HH:mm"
  endTime: string   // "HH:mm"
  status: BookingStatus
  notes?: string
  paidAmount?: number
  adminNotes?: string
  reminderSent?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface IBlockedDate {
  _id: string
  date: string // YYYY-MM-DD
  reason?: string
  blockedBy: string | IUser
  createdAt: Date
}

export interface ICourseBooking {
  _id: string
  user: string | IUser
  startDate: string // YYYY-MM-DD
  days: string[]    // array of 3 YYYY-MM-DD strings
  status: CourseBookingStatus
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface IGuideOrder {
  _id: string
  user: string | IUser
  stripeSessionId: string
  status: GuideOrderStatus
  downloadUrl?: string
  paidAt?: Date
  createdAt: Date
  updatedAt: Date
}
