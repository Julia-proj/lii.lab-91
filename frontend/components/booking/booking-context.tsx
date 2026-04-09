'use client'

import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import { useSearchParams } from 'next/navigation'
import type { IService } from '@/types'
import type { BookingState, BookingAction } from './booking-types'
import { bookingReducer, initialState } from './booking-reducer'

export type { BookingState, BookingAction }

const BookingContext = createContext<{
  state: BookingState
  dispatch: React.Dispatch<BookingAction>
} | null>(null)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState)
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('resume') !== 'true') return
    try {
      const saved = localStorage.getItem('liilab-booking-state')
      if (!saved) return
      const parsed = JSON.parse(saved)

      const services: IService[] = parsed.services
        ? parsed.services
        : parsed.service ? [parsed.service] : []

      const quantities: Record<string, number> = parsed.quantities || {}

      if (services.length > 0 && parsed.date && parsed.timeSlot) {
        dispatch({
          type: 'RESTORE',
          payload: { step: 3, category: services[0].category, services, quantities, date: parsed.date, timeSlot: parsed.timeSlot, notes: parsed.notes || '' },
        })
      } else if (services.length > 0) {
        dispatch({
          type: 'RESTORE',
          payload: { step: 2, category: services[0].category, services, quantities, date: null, timeSlot: null, notes: '' },
        })
      }
      localStorage.removeItem('liilab-booking-state')
    } catch {
      // Ignore parse errors
    }
  }, [searchParams])

  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (!context) throw new Error('useBooking must be used within BookingProvider')
  return context
}

export function getTotalDuration(services: IService[], quantities?: Record<string, number>): number {
  return services.reduce((sum, s) => sum + s.duration * (quantities?.[s._id] ?? 1), 0)
}

export function getTotalPrice(services: IService[], quantities?: Record<string, number>): number {
  return services.reduce((sum, s) => sum + s.price * (quantities?.[s._id] ?? 1), 0)
}
