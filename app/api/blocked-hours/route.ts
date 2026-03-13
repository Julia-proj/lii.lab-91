import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import BlockedHour from '@/models/BlockedHour'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const blockedHourSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  reason: z.string().optional(),
})

export async function GET(req: NextRequest) {
  try {
    await dbConnect()
    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date')

    const query = date ? { date } : {}
    const blocked = await BlockedHour.find(query).sort({ date: 1, startTime: 1 })
    return NextResponse.json(blocked)
  } catch (error) {
    console.error('Error fetching blocked hours:', error)
    return NextResponse.json({ error: 'Error al obtener horas bloqueadas' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const body = await req.json()
    const parsed = blockedHourSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }

    if (parsed.data.startTime >= parsed.data.endTime) {
      return NextResponse.json({ error: 'La hora de inicio debe ser anterior a la hora de fin' }, { status: 400 })
    }

    await dbConnect()

    // Check for overlapping blocked hours on the same date
    const overlap = await BlockedHour.findOne({
      date: parsed.data.date,
      startTime: { $lt: parsed.data.endTime },
      endTime: { $gt: parsed.data.startTime },
    })
    if (overlap) {
      return NextResponse.json({ error: 'Se solapa con una hora ya bloqueada' }, { status: 409 })
    }

    const blocked = await BlockedHour.create({
      date: parsed.data.date,
      startTime: parsed.data.startTime,
      endTime: parsed.data.endTime,
      reason: parsed.data.reason,
      blockedBy: session.user.id,
    })

    return NextResponse.json(blocked, { status: 201 })
  } catch (error) {
    console.error('Error blocking hour:', error)
    return NextResponse.json({ error: 'Error al bloquear hora' }, { status: 500 })
  }
}
