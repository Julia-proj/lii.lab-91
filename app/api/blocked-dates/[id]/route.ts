import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { ScheduleService } from '@/backend/services/schedule.service'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const { id } = await params
  try {
    await ScheduleService.unblockDate(id)
    return NextResponse.json({ message: 'Fecha desbloqueada' })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error al desbloquear fecha'
    return NextResponse.json({ error: msg }, { status: 404 })
  }
}
