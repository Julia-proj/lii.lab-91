import { NextRequest, NextResponse } from 'next/server'
import { ScheduleService } from '@/backend/services/schedule.service'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const dateStr = searchParams.get('date')
  const serviceId = searchParams.get('serviceId')
  const excludeId = searchParams.get('excludeId') ?? undefined
  const durationParam = searchParams.get('duration')

  if (!dateStr || !serviceId) {
    return NextResponse.json({ success: false, error: 'Se requieren date y serviceId' }, { status: 400 })
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return NextResponse.json({ success: false, error: 'Formato de fecha inválido' }, { status: 400 })
  }

  let duration: number | undefined
  if (durationParam) {
    const parsed = parseInt(durationParam, 10)
    if (isNaN(parsed) || parsed <= 0) {
      return NextResponse.json({ success: false, error: 'Duración inválida' }, { status: 400 })
    }
    duration = parsed
  }

  try {
    const result = await ScheduleService.getAvailableSlots(dateStr, serviceId, { duration, excludeId })
    return NextResponse.json({ success: true, data: result })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error al obtener horarios'
    return NextResponse.json({ success: false, error: msg }, { status: msg.includes('no encontrado') ? 404 : 500 })
  }
}
