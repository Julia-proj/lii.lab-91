import { NextRequest, NextResponse } from 'next/server'
import { sendWhatsAppTemplate } from '@/lib/whatsapp'
import { z } from 'zod'

const testSchema = z.object({
  phone: z.string().regex(/^\+\d{9,15}$/, 'Formato E.164 requerido (ej: +34612345678)'),
  name: z.string().min(1, 'Nombre requerido'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:mm requerido'),
})

/**
 * POST /api/cron/test-whatsapp-template
 * Admin-only test for WhatsApp template sending.
 */
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const templateSid = process.env.TWILIO_TEMPLATE_SID
    if (!templateSid) {
      return NextResponse.json(
        { success: false, error: 'TWILIO_TEMPLATE_SID not configured' },
        { status: 500 },
      )
    }

    const body = await req.json()
    const parsed = testSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 },
      )
    }

    const { phone, name, time } = parsed.data

    const result = await sendWhatsAppTemplate(phone, templateSid, {
      '1': name,
      '2': time,
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      data: { phone, name, time, templateSid },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
