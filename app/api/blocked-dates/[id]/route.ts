import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import BlockedDate from '@/models/BlockedDate'
import { auth } from '@/lib/auth'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { id } = await params
    await dbConnect()

    const blocked = await BlockedDate.findByIdAndDelete(id)
    if (!blocked) {
      return NextResponse.json({ error: 'Fecha bloqueada no encontrada' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Fecha desbloqueada' })
  } catch (error) {
    console.error('Error unblocking date:', error)
    return NextResponse.json({ error: 'Error al desbloquear fecha' }, { status: 500 })
  }
}
