import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import User from '@/models/User'
import { sendEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ success: false, error: 'Email requerido' }, { status: 400 })
    }

    await dbConnect()
    const user = await User.findOne({ email: email.toLowerCase().trim() })

    // Always return 200 to prevent user enumeration
    if (!user || !user.password) {
      return NextResponse.json({ success: true })
    }

    const token = crypto.randomBytes(32).toString('hex')
    const expiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    user.resetToken = token
    user.resetTokenExpiry = expiry
    await user.save()

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const resetUrl = `${baseUrl}/reset-password?token=${token}`

    const html = `
      <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; color: #1a1a1a;">
        <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #999; margin-bottom: 32px;">Lii.lab</p>
        <h1 style="font-size: 24px; font-weight: normal; margin-bottom: 16px;">Restablecer contraseña</h1>
        <p style="font-size: 14px; color: #666; line-height: 1.7; margin-bottom: 32px;">
          Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.
          Este enlace es válido durante <strong>1 hora</strong>.
        </p>
        <a href="${resetUrl}" style="display: inline-block; background: #4a3158; color: white; text-decoration: none; padding: 12px 28px; border-radius: 100px; font-size: 14px; font-family: sans-serif;">
          Restablecer contraseña
        </a>
        <p style="font-size: 12px; color: #999; margin-top: 32px; line-height: 1.6;">
          Si no solicitaste esto, puedes ignorar este correo. Tu contraseña no cambiará.
        </p>
        <hr style="border: none; border-top: 1px solid #f0ede8; margin: 32px 0;" />
        <p style="font-size: 11px; color: #bbb;">Lii.lab · Madrid</p>
      </div>
    `

    await sendEmail(user.email, 'Restablecer contraseña – Lii.lab', html)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error forgot-password:', error)
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
