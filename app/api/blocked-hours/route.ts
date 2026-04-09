import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { ScheduleService } from '@/backend/services/schedule.service'
import { z } from 'zod'

const blockedHourSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  reason: z.string().optional(),
})

export async function GET(req: NextRequest) {
  const date = new URL(req.url).searchParams.get('date') ?? undefined
  try {
    const blocked = await ScheduleService.getBlockedHours(date)
    return NextResponse.json({ success: true, data: blocked })
  } catch {
    return NextResponse.json({ success: false, error: 'Error al obtener horas bloqueadas' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 403 })
  }

  const parsed = blockedHourSchema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ success: false, error: parsed.error.errors[0].message }, { status: 400 })

  try {
    const blocked = await ScheduleService.blockHour(parsed.data, session.user.id)
    return NextResponse.json({ success: true, data: blocked }, { status: 201 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error al bloquear hora'
    return NextResponse.json({ success: false, error: msg }, { status: msg.includes('solapa') ? 409 : 400 })
  }
}
