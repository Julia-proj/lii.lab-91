import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { auth } from '@/lib/auth'

export async function POST() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const priceId = process.env.STRIPE_GUIDE_PRICE_ID
    if (!priceId) {
      return NextResponse.json(
        { error: 'Stripe no configurado' },
        { status: 500 }
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/guide/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/guide/cancel`,
      customer_email: session.user.email || undefined,
      metadata: {
        userId: session.user.id,
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error)
    return NextResponse.json(
      { error: 'Error al crear sesión de pago' },
      { status: 500 }
    )
  }
}
