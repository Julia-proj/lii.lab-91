import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { StripeService } from '@/backend/services/stripe.service'

export async function POST() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const url = await StripeService.createCheckoutSession(session.user.id, session.user.email ?? null)
    return NextResponse.json({ url })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error al crear sesión de pago'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
