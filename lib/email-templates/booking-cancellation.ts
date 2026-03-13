interface BookingCancellationData {
  clientName: string
  serviceName: string
  date: string
  startTime: string
}

export function bookingCancellationTemplate(data: BookingCancellationData): string {
  const dateFormatted = new Date(data.date + 'T00:00:00').toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

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
      <h2 style="font-size: 20px; color: #171717; margin-top: 0;">Cita cancelada</h2>
      <p style="color: #525252; font-size: 14px; line-height: 1.6;">
        Hola ${data.clientName}, tu cita ha sido cancelada:
      </p>
      <div style="background: #fef2f2; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <p style="margin: 8px 0; font-size: 14px;"><strong>Servicio:</strong> ${data.serviceName}</p>
        <p style="margin: 8px 0; font-size: 14px; text-transform: capitalize;"><strong>Fecha:</strong> ${dateFormatted}</p>
        <p style="margin: 8px 0; font-size: 14px;"><strong>Hora:</strong> ${data.startTime}</p>
      </div>
      <p style="color: #525252; font-size: 14px;">
        Si quieres reservar una nueva cita, puedes hacerlo desde nuestra web.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}
