import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { serviceSchema } from '@/lib/validators'
import { NailServiceService } from '@/backend/services/nail-service.service'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const service = await NailServiceService.getById(id)
    return NextResponse.json(service)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error al obtener servicio'
    return NextResponse.json({ error: msg }, { status: 404 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const parsed = serviceSchema.partial().safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })

  const { id } = await params
  try {
    const service = await NailServiceService.update(id, parsed.data)
    return NextResponse.json(service)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error al actualizar servicio'
    return NextResponse.json({ error: msg }, { status: 404 })
  }
}

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
    await NailServiceService.deactivate(id)
    return NextResponse.json({ message: 'Servicio desactivado' })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error al eliminar servicio'
    return NextResponse.json({ error: msg }, { status: 404 })
  }
}
