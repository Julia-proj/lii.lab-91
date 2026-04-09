import { NextRequest, NextResponse } from 'next/server'
import { ScheduleService } from '@/backend/services/schedule.service'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const weeksAhead = Math.min(Math.max(parseInt(searchParams.get('weeks') || '12', 10) || 12, 1), 52)
  const courseType = searchParams.get('type') || 'manic-0.0'

  try {
    const availableStartDates = await ScheduleService.getCourseAvailability(courseType, weeksAhead)
    return NextResponse.json({ success: true, data: { availableStartDates } })
  } catch {
    return NextResponse.json({ success: false, error: 'Error al obtener disponibilidad del curso' }, { status: 500 })
  }
}
