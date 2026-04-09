import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { blockedDateSchema } from '@/lib/validators'
import { ScheduleService } from '@/backend/services/schedule.service'

export async function GET() {
  try {
    const blocked = await ScheduleService.getAllBlockedDates()
    return NextResponse.json({ success: true, data: blocked })
  } catch {
    return NextResponse.json({ success: false, error: 'Error al obtener fechas bloqueadas' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 403 })
  }

  const parsed = blockedDateSchema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ success: false, error: parsed.error.errors[0].message }, { status: 400 })

  try {
    const blocked = await ScheduleService.blockDate(parsed.data.date, parsed.data.reason, session.user.id)
    return NextResponse.json({ success: true, data: blocked }, { status: 201 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error al bloquear fecha'
    return NextResponse.json({ success: false, error: msg }, { status: msg.includes('ya está') ? 409 : 500 })
  }
}
