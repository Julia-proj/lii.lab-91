import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { CourseService } from '@/backend/services/course.service'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  try {
    const booking = await CourseService.getById(id)
    return NextResponse.json({ success: true, data: booking })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error al obtener reserva'
    return NextResponse.json({ success: false, error: msg }, { status: 404 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  try {
    const booking = await CourseService.update(id, await req.json(), session.user.id, session.user.role)
    return NextResponse.json({ success: true, data: booking })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error al actualizar reserva'
    const status = msg === 'No autorizado' ? 403 : msg.includes('no encontrada') ? 404 : 400
    return NextResponse.json({ success: false, error: msg }, { status })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params
  try {
    await CourseService.remove(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: 'Error al eliminar reserva' }, { status: 500 })
  }
}
