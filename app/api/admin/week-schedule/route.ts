import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { dbConnect } from '@/lib/db'
import Settings from '@/backend/models/Settings'
import { WEEK_SCHEDULE } from '@/backend/lib/schedule'
import type { WeekSchedule } from '@/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    await dbConnect()
    const doc = await Settings.findOne({ key: 'weekSchedule' }).lean()
    const schedule = (doc?.value as WeekSchedule) ?? WEEK_SCHEDULE

    return NextResponse.json({ schedule })
  } catch (error) {
    console.error('Error fetching week schedule:', error)
    return NextResponse.json({ error: 'Error al obtener horario' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const body = await req.json()
    const schedule = body.schedule as WeekSchedule

    // Basic validation
    if (!schedule || typeof schedule !== 'object') {
      return NextResponse.json({ error: 'Datos de horario inválidos' }, { status: 400 })
    }
    for (let dow = 0; dow <= 6; dow++) {
      const day = schedule[dow]
      if (!day || typeof day.open !== 'boolean' || !Array.isArray(day.blocks)) {
        return NextResponse.json({ error: `Datos inválidos para el día ${dow}` }, { status: 400 })
      }
      for (const block of day.blocks) {
        if (
          typeof block.start !== 'string' ||
          typeof block.end !== 'string' ||
          !/^\d{2}:\d{2}$/.test(block.start) ||
          !/^\d{2}:\d{2}$/.test(block.end) ||
          block.start >= block.end
        ) {
          return NextResponse.json({ error: 'Formato de hora inválido en un bloque' }, { status: 400 })
        }
      }
    }

    await dbConnect()
    await Settings.findOneAndUpdate(
      { key: 'weekSchedule' },
      { key: 'weekSchedule', value: schedule },
      { upsert: true, new: true }
    )

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error saving week schedule:', error)
    return NextResponse.json({ error: 'Error al guardar horario' }, { status: 500 })
  }
}
