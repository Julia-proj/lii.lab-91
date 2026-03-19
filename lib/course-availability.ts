import { WEEK_SCHEDULE } from './schedule'
import { addDays, isBefore, isSameDay, startOfDay } from 'date-fns'

interface CourseAvailabilityParams {
  startFrom: Date
  weeksAhead?: number
  blockedDates: Date[]
  existingCourseDays: Date[]
}

/**
 * Find available windows of 3 consecutive working days for course booking.
 * Returns array of valid start dates.
 */
export function findAvailableCourseWindows({
  startFrom,
  weeksAhead = 12,
  blockedDates,
  existingCourseDays,
}: CourseAvailabilityParams): Date[] {
  const endAt = addDays(startFrom, weeksAhead * 7)
  const validStartDates: Date[] = []
  let cursor = startOfDay(startFrom)

  while (isBefore(cursor, endAt)) {
    const threeDays = getThreeConsecutiveWorkingDays(cursor, blockedDates, existingCourseDays)

    if (threeDays.length === 3) {
      validStartDates.push(new Date(cursor))
    }

    cursor = addDays(cursor, 1)
  }

  return validStartDates
}

/**
 * Starting from `start`, tries to find 3 strictly consecutive working days.
 * If any day is a weekend, blocked, or already booked for a course, sequence breaks.
 */
function getThreeConsecutiveWorkingDays(
  start: Date,
  blockedDates: Date[],
  existingCourseDays: Date[]
): Date[] {
  const days: Date[] = []
  let cursor = startOfDay(start)

  while (days.length < 3) {
    const dow = cursor.getDay() // 0=Sunday..6=Saturday
    const schedule = WEEK_SCHEDULE[dow]

    // Must be a working day
    if (!schedule || !schedule.open) {
      return days // Break sequence — incomplete
    }

    // Must not be blocked
    if (blockedDates.some((bd) => isSameDay(bd, cursor))) {
      return days // Break
    }

    // Must not already have a course booking
    if (existingCourseDays.some((cd) => isSameDay(cd, cursor))) {
      return days // Break
    }

    days.push(new Date(cursor))
    cursor = addDays(cursor, 1)
  }

  return days
}

/**
 * Given a start date, compute the 3 course days (the start date + next 2 working days).
 */
export function getCourseDays(startDate: Date): Date[] {
  return getThreeConsecutiveWorkingDays(startOfDay(startDate), [], [])
}

/**
 * Find available single working days for the perfeccionamiento course (1 day format).
 */
export function findAvailableSingleDays({
  startFrom,
  weeksAhead = 12,
  blockedDates,
  existingCourseDays,
}: CourseAvailabilityParams): Date[] {
  const endAt = addDays(startFrom, weeksAhead * 7)
  const validDates: Date[] = []
  let cursor = startOfDay(startFrom)

  while (isBefore(cursor, endAt)) {
    const dow = cursor.getDay()
    const schedule = WEEK_SCHEDULE[dow]

    if (
      schedule?.open &&
      !blockedDates.some((bd) => isSameDay(bd, cursor)) &&
      !existingCourseDays.some((cd) => isSameDay(cd, cursor))
    ) {
      validDates.push(new Date(cursor))
    }

    cursor = addDays(cursor, 1)
  }

  return validDates
}
