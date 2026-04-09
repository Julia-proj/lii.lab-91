import type { IService } from '@/types'

export interface BookingState {
  step: 1 | 2 | 3
  category: string | null
  services: IService[]
  quantities: Record<string, number>
  date: string | null
  timeSlot: string | null
  notes: string
}

export type BookingAction =
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'ADD_SERVICE'; payload: IService }
  | { type: 'REMOVE_SERVICE'; payload: string }
  | { type: 'SET_QUANTITY'; payload: { serviceId: string; quantity: number } }
  | { type: 'CONFIRM_SERVICES' }
  | { type: 'SET_DATE'; payload: string }
  | { type: 'SET_TIME'; payload: string }
  | { type: 'SET_NOTES'; payload: string }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GO_TO_STEP'; payload: 1 | 2 | 3 }
  | { type: 'RESTORE'; payload: BookingState }
  | { type: 'RESET' }
