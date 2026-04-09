import { NextRequest, NextResponse } from 'next/server'
import { sendWhatsAppToAdmin } from '@/lib/whatsapp'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const provider = process.env.TWILIO_ACCOUNT_SID ? 'Twilio' : 'CallMeBot'
  try {
    await sendWhatsAppToAdmin(`[Lii.lab test] WhatsApp configurado via ${provider}.`)
    return NextResponse.json({ success: true, data: { provider } })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
