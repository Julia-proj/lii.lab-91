import { getStripe } from '@/lib/stripe'
import { dbConnect } from '@/lib/db'
import GuideOrder from '@/models/GuideOrder'

export const StripeService = {
  async createCheckoutSession(userId: string, userEmail: string | null) {
    const priceId = process.env.STRIPE_GUIDE_PRICE_ID
    if (!priceId) throw new Error('Stripe no configurado')

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const stripe = getStripe()

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/guide/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/guide/cancel`,
      customer_email: userEmail || undefined,
      metadata: { userId },
    })

    return session.url
  },

  async handleWebhook(rawBody: string, signature: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) throw new Error('Missing webhook secret')

    const stripe = getStripe()
    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      await dbConnect()

      const existing = await GuideOrder.findOne({ stripeSessionId: session.id })
      if (existing) return

      const userId = session.metadata?.userId
      if (!userId) return

      await GuideOrder.create({
        user: userId,
        stripeSessionId: session.id,
        status: 'pagado',
        downloadUrl: '/downloads/guia-metodologica-liilab.pdf',
        paidAt: new Date(),
      })
    }
  },
}
