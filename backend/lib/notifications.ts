import { sendEmail } from './email'
import { sendWhatsAppToAdmin, sendWhatsApp } from './whatsapp'
import { bookingConfirmationTemplate } from './email-templates/booking-confirmation'
import { bookingCancellationTemplate } from './email-templates/booking-cancellation'
import { bookingReminderTemplate } from './email-templates/booking-reminder'
import { guidePurchaseTemplate } from './email-templates/guide-purchase'
import { bookingConfirmedByAdminTemplate } from './email-templates/booking-confirmed-by-admin'

// Estructura de datos que necesitamos para enviar cualquier notificación
interface BookingInfo {
  clientName: string
  clientEmail: string
  clientPhone?: string
  serviceName: string
  date: string
  startTime: string
  endTime: string
  price: number
}

/**
 * Notifica sobre una NUEVA reserva.
 * - Si el cliente dejó teléfono: le enviamos WhatsApp de confirmación
 * - Si no tiene teléfono: le enviamos email como plan B
 * - Al administrador siempre le llega email + WhatsApp
 *
 * Usamos Promise.allSettled para que si un canal falla, el resto no se bloquea.
 */
export async function notifyNewBooking(info: BookingInfo) {
  // Generamos el HTML del email (lo usamos para el admin y como plan B del cliente)
  const html = bookingConfirmationTemplate({
    clientName: info.clientName,
    serviceName: info.serviceName,
    date: info.date,
    startTime: info.startTime,
    endTime: info.endTime,
    price: info.price,
  })

  // Correo del administrador (configurable en .env)
  const adminEmail = process.env.ADMIN_EMAIL || 'lii.lab.space@gmail.com'

  // Formateamos fecha al estilo español DD/MM
  const dateFormatted = new Date(info.date + 'T00:00:00').toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
  })

  // Mensaje WhatsApp para el administrador
  const adminWhatsappMsg =
    `Nueva reserva en Lii.lab:\n` +
    `${info.clientName}\n` +
    `${info.serviceName}\n` +
    `${dateFormatted} a las ${info.startTime}\n` +
    `${info.price}\u20AC`

  // Mensaje WhatsApp para el cliente (bonito y claro)
  const clientWhatsappMsg =
    `Hola ${info.clientName}! Tu reserva en Lii.lab esta confirmada:\n\n` +
    `Servicio: ${info.serviceName}\n` +
    `Fecha: ${dateFormatted}\n` +
    `Hora: ${info.startTime}\n\n` +
    `Te esperamos!`

  // Siempre avisamos al administrador por email y WhatsApp
  const promises: Promise<unknown>[] = [
    sendEmail(adminEmail, `Nueva reserva: ${info.clientName} - ${info.serviceName}`, html),
    sendWhatsAppToAdmin(adminWhatsappMsg),
  ]

  // Al cliente: WhatsApp si tiene teléfono, email si no
  if (info.clientPhone) {
    promises.push(sendWhatsApp(info.clientPhone, clientWhatsappMsg))
  } else {
    promises.push(sendEmail(info.clientEmail, 'Reserva confirmada - Lii.lab', html))
  }

  const results = await Promise.allSettled(promises)

  // Registramos en consola cualquier fallo sin interrumpir la ejecución
  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      console.error(`Error al enviar notificacion (canal ${i}):`, r.reason)
    }
  })
}

/**
 * Notifica al cliente que el ADMIN ha CONFIRMADO su reserva.
 * Solo va al cliente (el admin ya sabe que confirmó).
 */
export async function notifyAdminConfirmation(info: BookingInfo) {
  const html = bookingConfirmedByAdminTemplate({
    clientName: info.clientName,
    serviceName: info.serviceName,
    date: info.date,
    startTime: info.startTime,
    endTime: info.endTime,
    price: info.price,
  })

  const dateFormatted = new Date(info.date + 'T00:00:00').toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
  })

  const clientWhatsappMsg =
    `✅ Lii.lab: Tu cita ha sido confirmada!\n\n` +
    `${info.serviceName}\n` +
    `${dateFormatted} a las ${info.startTime}\n\n` +
    `Te esperamos en Calle Narváez, 1, Valdemoro.`

  const promises: Promise<unknown>[] = []

  if (info.clientPhone) {
    promises.push(sendWhatsApp(info.clientPhone, clientWhatsappMsg))
  } else {
    promises.push(sendEmail(info.clientEmail, '✅ Cita confirmada - Lii.lab', html))
  }

  const results = await Promise.allSettled(promises)
  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      console.error(`Error notifyAdminConfirmation (canal ${i}):`, r.reason)
    }
  })
}

/**
 * Notifica sobre la CANCELACION de una reserva.
 * - Si el cliente tiene teléfono: WhatsApp
 * - Si no: email como plan B
 * - Al administrador siempre le llega email + WhatsApp
 */
export async function notifyCancellation(info: BookingInfo) {
  const html = bookingCancellationTemplate({
    clientName: info.clientName,
    serviceName: info.serviceName,
    date: info.date,
    startTime: info.startTime,
  })

  const adminEmail = process.env.ADMIN_EMAIL || 'lii.lab.space@gmail.com'

  // Mensaje para el administrador
  const adminWhatsappMsg =
    `Cita cancelada:\n` +
    `${info.clientName}\n` +
    `${info.serviceName}\n` +
    `${info.date} ${info.startTime}`

  // Mensaje para el cliente
  const clientWhatsappMsg =
    `Hola ${info.clientName}. Tu cita para ${info.serviceName} ` +
    `el ${info.date} a las ${info.startTime} ha sido cancelada.\n` +
    `Esperamos verte pronto en Lii.lab.`

  const promises: Promise<unknown>[] = [
    sendEmail(adminEmail, `Cita cancelada: ${info.clientName}`, html),
    sendWhatsAppToAdmin(adminWhatsappMsg),
  ]

  if (info.clientPhone) {
    promises.push(sendWhatsApp(info.clientPhone, clientWhatsappMsg))
  } else {
    promises.push(sendEmail(info.clientEmail, 'Cita cancelada - Lii.lab', html))
  }

  await Promise.allSettled(promises)
}

/**
 * Envía un RECORDATORIO 24 horas antes de la cita.
 * Prioridad: WhatsApp al cliente; si no tiene teléfono, email.
 */
export async function sendBookingReminder(info: BookingInfo) {
  const html = bookingReminderTemplate({
    clientName: info.clientName,
    serviceName: info.serviceName,
    date: info.date,
    startTime: info.startTime,
    endTime: info.endTime,
  })

  const dateFormatted = new Date(info.date + 'T00:00:00').toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
  })

  // Mensaje de recordatorio por WhatsApp
  const whatsappMsg =
    `Recordatorio Lii.lab:\n` +
    `Hola ${info.clientName}, manana tienes cita:\n` +
    `${info.serviceName}\n` +
    `${dateFormatted} a las ${info.startTime}\n` +
    `Direccion: Calle Narvez, 1, Valdemoro`

  // Declaramos el array de promesas antes de usarlo
  const promises: Promise<unknown>[] = []

  if (info.clientPhone) {
    promises.push(sendWhatsApp(info.clientPhone, whatsappMsg))
  } else {
    promises.push(
      sendEmail(info.clientEmail, 'Recordatorio: tu cita es manana - Lii.lab', html)
    )
  }

  await Promise.allSettled(promises)
}

/**
 * Notifica al cliente que el ADMIN ha MOVIDO su cita a otra fecha/hora.
 */
export async function notifyReschedule(info: BookingInfo) {
  const dateFormatted = new Date(info.date + 'T00:00:00').toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
  })

  const clientWhatsappMsg =
    `📅 Lii.lab: Tu cita ha sido reagendada.\n\n` +
    `${info.serviceName}\n` +
    `Nueva fecha: ${dateFormatted} a las ${info.startTime}\n\n` +
    `Si tienes alguna duda, contáctanos.`

  const html = bookingConfirmedByAdminTemplate({
    clientName: info.clientName,
    serviceName: info.serviceName,
    date: info.date,
    startTime: info.startTime,
    endTime: info.endTime,
    price: info.price,
  })

  const promises: Promise<unknown>[] = []
  if (info.clientPhone) {
    promises.push(sendWhatsApp(info.clientPhone, clientWhatsappMsg))
  } else {
    promises.push(sendEmail(info.clientEmail, '📅 Tu cita ha sido reagendada - Lii.lab', html))
  }

  const results = await Promise.allSettled(promises)
  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      console.error(`Error notifyReschedule (canal ${i}):`, r.reason)
    }
  })
}

/**
 * Notifica cuando alguien compra una GUIA metodologica.
 * Siempre por email porque el enlace de descarga va en el cuerpo del correo.
 */
export async function notifyGuidePurchase(
  clientName: string,
  clientEmail: string,
  downloadUrl: string
) {
  const html = guidePurchaseTemplate({ clientName, downloadUrl })

  await Promise.allSettled([
    sendEmail(clientEmail, 'Tu Guia Metodologica - Lii.lab', html),
  ])
}
