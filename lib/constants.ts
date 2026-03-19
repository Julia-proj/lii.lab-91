/**
 * Shared constants used across admin UI and API routes.
 * Single source of truth — update here, applies everywhere.
 */

// ── Booking status colours ───────────────────────────────────────────────────

export const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  confirmada: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  pendiente:  { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-400'   },
  cancelada:  { bg: 'bg-red-50',     text: 'text-red-600',     dot: 'bg-red-400'     },
  completada: { bg: 'bg-neutral-100',text: 'text-neutral-500', dot: 'bg-neutral-400' },
}

export const COURSE_STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  confirmada: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  pendiente:  { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-400'   },
  cancelada:  { bg: 'bg-red-50',     text: 'text-red-600',     dot: 'bg-red-400'     },
}

// ── Service categories ───────────────────────────────────────────────────────

export const SERVICE_CATEGORIES = [
  'manicura',
  'pedicura',
  'pestañas',
  'cejas',
  'depilacion',
  'otro',
] as const

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number]
