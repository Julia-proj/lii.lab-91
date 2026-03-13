import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import Service from '@/models/Service'
import { auth } from '@/lib/auth'
import { serviceSchema } from '@/lib/validators'

export async function GET(req: NextRequest) {
  try {
    await dbConnect()
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')

    const filter: Record<string, unknown> = { active: true }
    if (category) filter.category = category
    const popular = searchParams.get('popular')
    if (popular === 'true') filter.popular = true

    const services = await Service.find(filter).sort({ category: 1, name: 1 })
    return NextResponse.json(services)
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json({ error: 'Error al obtener servicios' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const body = await req.json()
    const parsed = serviceSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }

    await dbConnect()
    const service = await Service.create(parsed.data)
    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json({ error: 'Error al crear servicio' }, { status: 500 })
  }
}
