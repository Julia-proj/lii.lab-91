import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { dbConnect } from '@/lib/db'
import GuideOrder from '@/models/GuideOrder'

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const sig = req.headers.get('stripe-signature')

    if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    let event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      )
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object

      await dbConnect()

      // Idempotency check
      const existing = await GuideOrder.findOne({
        stripeSessionId: session.id,
      })
      if (existing) {
        return NextResponse.json({ received: true })
      }

      // Validate userId exists in metadata
      const userId = session.metadata?.userId
      if (!userId) {
        console.error('Webhook: Missing userId in session metadata', session.id)
        return NextResponse.json({ received: true })
      }

      await GuideOrder.create({
        user: userId,
        stripeSessionId: session.id,
        status: 'pagado',
        downloadUrl: '/downloads/guia-metodologica-liilab.pdf', // Update with actual URL
        paidAt: new Date(),
      })

      // TODO: Send confirmation email (Phase 10)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}
