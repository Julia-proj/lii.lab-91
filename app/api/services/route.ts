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
    return NextResponse.json({ success: true, data: services })
  } catch {
    return NextResponse.json({ success: false, error: 'Error al obtener servicios' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 403 })
  }

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ success: false, error: 'Formato de solicitud inválido' }, { status: 400 })
  }
  const parsed = serviceSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ success: false, error: parsed.error.errors[0].message }, { status: 400 })

  try {
    const service = await NailServiceService.create(parsed.data)
    return NextResponse.json({ success: true, data: service }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, error: 'Error al crear servicio' }, { status: 500 })
  }
}
