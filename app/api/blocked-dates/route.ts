import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import BlockedDate from '@/models/BlockedDate'
import { auth } from '@/lib/auth'
import { blockedDateSchema } from '@/lib/validators'

export async function GET() {
  try {
    await dbConnect()
    const blocked = await BlockedDate.find().sort({ date: 1 })
    return NextResponse.json(blocked)
  } catch (error) {
    console.error('Error fetching blocked dates:', error)
    return NextResponse.json({ error: 'Error al obtener fechas bloqueadas' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const body = await req.json()
    const parsed = blockedDateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }

    await dbConnect()

    const existing = await BlockedDate.findOne({ date: parsed.data.date })
    if (existing) {
      return NextResponse.json({ error: 'Esta fecha ya está bloqueada' }, { status: 409 })
    }

    const blocked = await BlockedDate.create({
      date: parsed.data.date,
      reason: parsed.data.reason,
      blockedBy: session.user.id,
    })

    return NextResponse.json(blocked, { status: 201 })
  } catch (error) {
    console.error('Error blocking date:', error)
    return NextResponse.json({ error: 'Error al bloquear fecha' }, { status: 500 })
  }
}
