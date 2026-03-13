/**
 * HORARIO SEMANAL DEL ESTUDIO
 *
 * Define el horario de apertura para cada dia de la semana.
 * Cada dia tiene uno o mas "bloques" (franjas horarias de trabajo),
 * por ejemplo manana (10:00-14:00) y tarde (15:00-18:45).
 *
 * Este horario es la fuente de verdad para:
 * - La generacion de slots disponibles (lib/slots.ts)
 * - El calendario del admin (admin/schedule/page.tsx)
 * - El calendario de reservas del usuario (datetime-step.tsx)
 *
 * Para cambiar los horarios del estudio, solo hay que modificar este objeto.
 */
import type { WeekSchedule } from '@/types'

// Formato: 0 = Domingo, 1 = Lunes, ..., 6 = Sabado
export const WEEK_SCHEDULE: WeekSchedule = {
  0: { open: false, blocks: [] }, // Domingo — cerrado
  1: { open: true, blocks: [{ start: '10:00', end: '14:00' }, { start: '15:00', end: '18:45' }] }, // Lunes
  2: { open: true, blocks: [{ start: '11:00', end: '14:00' }, { start: '15:00', end: '21:00' }] }, // Martes
  3: { open: true, blocks: [{ start: '09:00', end: '14:00' }, { start: '15:00', end: '18:45' }] }, // Miercoles
  4: { open: true, blocks: [{ start: '11:00', end: '14:00' }, { start: '15:00', end: '21:00' }] }, // Jueves
  5: { open: true, blocks: [{ start: '09:00', end: '14:00' }, { start: '15:00', end: '18:45' }] }, // Viernes
  6: { open: false, blocks: [] }, // Sabado — cerrado
}

/** Devuelve true si el dia de la semana esta marcado como abierto */
export function isDayOpen(dayOfWeek: number): boolean {
  return WEEK_SCHEDULE[dayOfWeek]?.open ?? false
}

/** Devuelve los bloques horarios de un dia (array vacio si esta cerrado) */
export function getBlocksForDay(dayOfWeek: number) {
  return WEEK_SCHEDULE[dayOfWeek]?.blocks ?? []
}

/**
 * Convierte una hora "HH:mm" a minutos desde medianoche.
 * Ejemplo: "14:30" → 870 (14*60 + 30)
 */
export function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

/**
 * Convierte minutos desde medianoche a formato "HH:mm".
 * Ejemplo: 870 → "14:30"
 */
export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}
