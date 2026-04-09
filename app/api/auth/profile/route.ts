import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { profileSchema } from '@/lib/validators'
import { AuthService } from '@/backend/services/auth.service'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 })

  try {
    const user = await AuthService.getProfile(session.user.id)
    return NextResponse.json({ success: true, data: user })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error al obtener perfil'
    return NextResponse.json({ success: false, error: msg }, { status: 404 })
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 })

  const parsed = profileSchema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ success: false, error: parsed.error.errors[0].message }, { status: 400 })

  try {
    const user = await AuthService.updateProfile(session.user.id, parsed.data)
    return NextResponse.json({ success: true, data: user })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error al actualizar perfil'
    return NextResponse.json({ success: false, error: msg }, { status: 404 })
  }
}
