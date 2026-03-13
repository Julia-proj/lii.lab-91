/**
 * Generador de horarios disponibles (slots).
 *
 * Algoritmo:
 * 1. Se obtienen los bloques horarios del dia (ej: manana y tarde).
 * 2. Dentro de cada bloque, un cursor avanza en intervalos de 15 minutos.
 * 3. Para cada posicion del cursor, se verifica si el servicio cabe dentro
 *    del bloque y si no colisiona con reservas existentes.
 * 4. Solo los horarios sin conflicto se devuelven como disponibles.
 */

import { getBlocksForDay, isDayOpen, parseTimeToMinutes, minutesToTime } from './schedule'

/** Parametros necesarios para calcular los slots disponibles */
interface SlotParams {
  date: Date
  serviceDuration: number // duracion del servicio en minutos
  existingBookings: Array<{ startTime: string; endTime: string }> // reservas ya existentes ese dia
}

/**
 * Genera los horarios disponibles para una fecha y duracion de servicio dados.
 * Devuelve un array de strings "HH:mm" que representan las horas de inicio disponibles.
 */
export function generateAvailableSlots(params: SlotParams): string[] {
  const { date, serviceDuration, existingBookings } = params
  const dayOfWeek = date.getDay() // 0=Domingo ... 6=Sabado

  // Si el dia esta cerrado (ej: domingo), no hay slots disponibles
  if (!isDayOpen(dayOfWeek)) return []

  // Obtenemos los bloques de trabajo del dia (ej: [{start:'10:00', end:'14:00'}, ...])
  const blocks = getBlocksForDay(dayOfWeek)
  const slots: string[] = []

  // Recorremos cada bloque horario del dia
  for (const block of blocks) {
    const blockStartMin = parseTimeToMinutes(block.start)
    const blockEndMin = parseTimeToMinutes(block.end)
    // El cursor marca la posicion actual dentro del bloque (en minutos desde medianoche)
    let cursor = blockStartMin

    // Avanzamos mientras el servicio completo quepa antes del fin del bloque
    while (cursor + serviceDuration <= blockEndMin) {
      const slotStart = minutesToTime(cursor)
      const slotEnd = minutesToTime(cursor + serviceDuration)

      // Verificamos si este slot colisiona con alguna reserva existente
      const hasConflict = existingBookings.some((booking) =>
        timesOverlap(slotStart, slotEnd, booking.startTime, booking.endTime)
      )

      // Solo agregamos el slot si no tiene conflictos con reservas existentes
      if (!hasConflict) {
        slots.push(slotStart)
      }

      // Avanzamos en intervalos de 15 minutos para ofrecer granularidad al cliente
      cursor += 15
    }
  }

  return slots
}

/**
 * Comprueba si dos intervalos de tiempo se solapan.
 *
 * Usa comparacion lexicografica de strings "HH:mm", que funciona correctamente
 * porque el formato con ceros a la izquierda mantiene el orden cronologico.
 *
 * La logica: dos intervalos [s1,e1) y [s2,e2) se solapan si y solo si
 * s1 < e2 AND s2 < e1. Si alguna condicion no se cumple, los intervalos
 * no se cruzan (uno termina antes de que empiece el otro).
 */
function timesOverlap(s1: string, e1: string, s2: string, e2: string): boolean {
  return s1 < e2 && s2 < e1
}
