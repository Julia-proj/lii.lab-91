/**
 * Send WhatsApp message via CallMeBot API (free tier).
 * Requires the admin to activate their phone at https://www.callmebot.com/blog/free-api-whatsapp-messages/
 *
 * If Twilio credentials are provided, uses Twilio WhatsApp instead.
 */
export async function sendWhatsApp(to: string, message: string) {
  try {
    // Try Twilio first if configured
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_FROM) {
      const accountSid = process.env.TWILIO_ACCOUNT_SID
      const authToken = process.env.TWILIO_AUTH_TOKEN
      const from = process.env.TWILIO_WHATSAPP_FROM

      const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`
      const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64')

      const body = new URLSearchParams({
        From: from.startsWith('whatsapp:') ? from : `whatsapp:${from}`,
        To: to.startsWith('whatsapp:') ? to : `whatsapp:${to}`,
        Body: message,
      })

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      })

      if (!res.ok) {
        const errData = await res.text()
        console.error('Twilio WhatsApp error:', errData)
        throw new Error('Twilio WhatsApp failed')
      }

      return
    }

    // Fallback to CallMeBot
    if (process.env.CALLMEBOT_API_KEY) {
      const phone = to.replace('+', '')
      const apiKey = process.env.CALLMEBOT_API_KEY
      const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(message)}&apikey=${apiKey}`

      const res = await fetch(url)
      if (!res.ok) {
        console.error('CallMeBot error:', await res.text())
        throw new Error('CallMeBot WhatsApp failed')
      }

      return
    }

    console.warn('WhatsApp not configured: no Twilio or CallMeBot credentials')
  } catch (error) {
    console.error('Error sending WhatsApp:', error)
    throw error
  }
}

/**
 * Send WhatsApp to admin phone.
 */
export async function sendWhatsAppToAdmin(message: string) {
  const adminPhone = process.env.ADMIN_WHATSAPP
  if (!adminPhone) {
    console.warn('ADMIN_WHATSAPP not configured')
    return
  }
  await sendWhatsApp(adminPhone, message)
}

// ─── WhatsApp Template API (Twilio Content Templates) ─────────────────────────

interface TemplateResult {
  success: boolean
  error?: string
}

/**
 * Send a pre-approved WhatsApp template via Twilio Content Templates API.
 * Used for 24h reminders (utility templates work outside the 24h session window).
 *
 * @param to - Phone number in E.164 format (e.g. +34692569848)
 * @param contentSid - Twilio Content Template SID (e.g. HXxxxxx)
 * @param contentVariables - Template variables as Record<string, string>
 */
export async function sendWhatsAppTemplate(
  to: string,
  contentSid: string,
  contentVariables: Record<string, string>,
): Promise<TemplateResult> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_WHATSAPP_FROM

  if (!accountSid || !authToken || !from) {
    console.warn('WhatsApp template: Twilio credentials not configured, skipping')
    return { success: false, error: 'Twilio not configured' }
  }

  try {
    const Twilio = (await import('twilio')).default
    const client = Twilio(accountSid, authToken)

    await client.messages.create({
      from,
      to: to.startsWith('whatsapp:') ? to : `whatsapp:${to}`,
      contentSid,
      contentVariables: JSON.stringify(contentVariables),
    })

    console.log(`WhatsApp template sent to ${to}`)
    return { success: true }
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    console.error(`WhatsApp template failed for ${to}:`, msg)
    return { success: false, error: msg }
  }
}
