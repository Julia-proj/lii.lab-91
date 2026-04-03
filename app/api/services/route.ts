import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { serviceSchema } from '@/lib/validators'
import { NailServiceService } from '@/backend/services/nail-service.service'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category') ?? undefined
  const popular = searchParams.get('popular') === 'true'
  let all = false

  if (searchParams.get('all') === 'true') {
    const session = await auth()
    all = session?.user.role === 'admin'
  }

  try {
    const services = await NailServiceService.getAll({ category, popular, all })
    return NextResponse.json(services)
  } catch {
    return NextResponse.json({ error: 'Error al obtener servicios' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const parsed = serviceSchema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })

  try {
    const service = await NailServiceService.create(parsed.data)
    return NextResponse.json(service, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Error al crear servicio' }, { status: 500 })
  }
}
