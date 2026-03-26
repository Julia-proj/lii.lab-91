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
        From: `whatsapp:${from}`,
        To: `whatsapp:${to}`,
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
