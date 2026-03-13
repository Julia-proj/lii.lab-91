import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD,
  },
})

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    await transporter.sendMail({
      from: `"Lii.lab" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    })
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}
