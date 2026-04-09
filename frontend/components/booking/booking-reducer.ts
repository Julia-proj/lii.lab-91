import type { BookingState, BookingAction } from './booking-types'

export const initialState: BookingState = {
  step: 1,
  category: null,
  services: [],
  quantities: {},
  date: null,
  timeSlot: null,
  notes: '',
}

export function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'SET_CATEGORY':
      return { ...state, category: action.payload }
    case 'ADD_SERVICE': {
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
