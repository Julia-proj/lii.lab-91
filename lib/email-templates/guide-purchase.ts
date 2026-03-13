interface GuidePurchaseData {
  clientName: string
  downloadUrl: string
}

export function guidePurchaseTemplate(data: GuidePurchaseData): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://liilab.vercel.app'

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #fafafa; padding: 40px 20px;">
  <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; border: 1px solid #e5e5e5;">
    <div style="background-color: #CDB4DB; padding: 24px; text-align: center;">
      <h1 style="color: white; font-size: 24px; margin: 0; font-family: Georgia, serif;">Lii.lab</h1>
    </div>
    <div style="padding: 32px;">
      <h2 style="font-size: 20px; color: #171717; margin-top: 0;">¡Gracias por tu compra!</h2>
      <p style="color: #525252; font-size: 14px; line-height: 1.6;">
        Hola ${data.clientName}, gracias por adquirir la Guía Metodológica de Lii.lab.
      </p>
      <div style="background: #f0fdf4; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
        <p style="margin: 0 0 16px; font-size: 14px; font-weight: 600;">Guía Metodológica Lii.lab</p>
        <a href="${baseUrl}${data.downloadUrl}" style="display: inline-block; background: #CDB4DB; color: white; text-decoration: none; padding: 12px 32px; border-radius: 9999px; font-size: 14px; font-weight: 500;">
          Descargar Guía
        </a>
      </div>
      <p style="color: #a3a3a3; font-size: 12px; margin-top: 24px;">
        Si tienes algún problema con la descarga, contacta con nosotros en lii.lab.space@gmail.com
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}
