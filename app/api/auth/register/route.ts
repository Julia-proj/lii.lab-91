import { NextRequest, NextResponse } from 'next/server'
import { registerSchema } from '@/lib/validators'
import { AuthService } from '@/backend/services/auth.service'

export async function POST(req: NextRequest) {
  const parsed = registerSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
  }

  try {
    const user = await AuthService.register(parsed.data)
    return NextResponse.json({ message: 'Cuenta creada correctamente', userId: user._id }, { status: 201 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error al crear la cuenta'
    const status = msg.includes('Ya existe') ? 409 : 500
    return NextResponse.json({ error: msg }, { status })
  }
}
