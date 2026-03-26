import { NextRequest, NextResponse } from 'next/server'
import { StripeService } from '@/backend/services/stripe.service'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 })

  try {
    await StripeService.handleWebhook(body, sig)
    return NextResponse.json({ received: true })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Webhook error'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
