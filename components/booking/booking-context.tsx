'use client'

import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import { useSearchParams } from 'next/navigation'
import type { IService } from '@/types'

export interface BookingState {
  step: 1 | 2 | 3
  category: string | null
  services: IService[]
  // Cantidad por servicio (solo Decoraciones puede tener >1). Clave = _id
  quantities: Record<string, number>
  date: string | null // YYYY-MM-DD
  timeSlot: string | null // HH:mm
  notes: string
}

type BookingAction =
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'ADD_SERVICE'; payload: IService }
  | { type: 'REMOVE_SERVICE'; payload: string } // by _id
  | { type: 'SET_QUANTITY'; payload: { serviceId: string; quantity: number } }
  | { type: 'CONFIRM_SERVICES' } // go to step 2
  | { type: 'SET_DATE'; payload: string }
  | { type: 'SET_TIME'; payload: string }
  | { type: 'SET_NOTES'; payload: string }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GO_TO_STEP'; payload: 1 | 2 | 3 }
  | { type: 'RESTORE'; payload: BookingState }
  | { type: 'RESET' }

const initialState: BookingState = {
  step: 1,
  category: null,
  services: [],
  quantities: {},
  date: null,
  timeSlot: null,
  notes: '',
}

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'SET_CATEGORY':
      return { ...state, category: action.payload }
    case 'ADD_SERVICE': {
      // No duplicados
      if (state.services.some((s) => s._id === action.payload._id)) return state
      return {
        ...state,
        services: [...state.services, action.payload],
        quantities: { ...state.quantities, [action.payload._id]: 1 },
        date: null,
        timeSlot: null,
      }
    }
    case 'REMOVE_SERVICE': {
      const filtered = state.services.filter((s) => s._id !== action.payload)
      const { [action.payload]: _, ...restQty } = state.quantities
      return { ...state, services: filtered, quantities: restQty, date: null, timeSlot: null }
    }
    case 'SET_QUANTITY': {
      const qty = Math.max(1, Math.min(10, action.payload.quantity))
      return {
        ...state,
        quantities: { ...state.quantities, [action.payload.serviceId]: qty },
        date: null,
        timeSlot: null,
      }
    }
    case 'CONFIRM_SERVICES':
      return { ...state, step: 2, date: null, timeSlot: null }
    case 'SET_DATE':
      return { ...state, date: action.payload, timeSlot: null }
    case 'SET_TIME':
      return { ...state, timeSlot: action.payload, step: 3 }
    case 'SET_NOTES':
      return { ...state, notes: action.payload }
    case 'NEXT_STEP':
      return { ...state, step: Math.min(state.step + 1, 3) as BookingState['step'] }
    case 'PREV_STEP':
      return { ...state, step: Math.max(state.step - 1, 1) as BookingState['step'] }
    case 'GO_TO_STEP':
      return { ...state, step: action.payload }
    case 'RESTORE':
      return action.payload
    case 'RESET':
      return initialState
    default:
      return state
  }
}

const BookingContext = createContext<{
  state: BookingState
  dispatch: React.Dispatch<BookingAction>
} | null>(null)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState)
  const searchParams = useSearchParams()

  // Restore state from localStorage when returning from login/register
  useEffect(() => {
    if (searchParams.get('resume') !== 'true') return
    try {
      const saved = localStorage.getItem('liilab-booking-state')
      if (!saved) return
      const parsed = JSON.parse(saved)

      // Support both old format (single service) and new (services array)
      const services: IService[] = parsed.services
        ? parsed.services
        : parsed.service
          ? [parsed.service]
          : []

      // Reconstruir mapa de cantidades desde lo guardado
      const quantities: Record<string, number> = parsed.quantities || {}

      if (services.length > 0 && parsed.date && parsed.timeSlot) {
        dispatch({
          type: 'RESTORE',
          payload: {
            step: 3,
            category: services[0].category,
            services,
            quantities,
            date: parsed.date,
            timeSlot: parsed.timeSlot,
            notes: parsed.notes || '',
          },
        })
      } else if (services.length > 0) {
        dispatch({
          type: 'RESTORE',
          payload: {
            step: 2,
            category: services[0].category,
            services,
            quantities,
            date: null,
            timeSlot: null,
            notes: '',
          },
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

// Helper: calcula duración total considerando cantidades
export function getTotalDuration(services: IService[], quantities?: Record<string, number>): number {
  return services.reduce((sum, s) => {
    const qty = quantities?.[s._id] ?? 1
    return sum + s.duration * qty
  }, 0)
}

// Helper: calcula precio total considerando cantidades
export function getTotalPrice(services: IService[], quantities?: Record<string, number>): number {
  return services.reduce((sum, s) => {
    const qty = quantities?.[s._id] ?? 1
    return sum + s.price * qty
  }, 0)
}
