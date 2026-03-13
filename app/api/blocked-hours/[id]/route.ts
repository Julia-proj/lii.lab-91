import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import BlockedHour from '@/models/BlockedHour'
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
    const deleted = await BlockedHour.findByIdAndDelete(id)
    if (!deleted) {
      return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error unblocking hour:', error)
    return NextResponse.json({ error: 'Error al desbloquear hora' }, { status: 500 })
  }
}
