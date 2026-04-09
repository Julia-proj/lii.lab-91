import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import User from '@/models/User'

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ success: false, error: 'Token inválido' }, { status: 400 })
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json({ success: false, error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 })
    }

    await dbConnect()
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    })

    if (!user) {
      return NextResponse.json({ success: false, error: 'El enlace ha expirado o no es válido' }, { status: 400 })
    }

    // The pre-save hook will hash the new password
    user.password = password
    user.resetToken = undefined
    user.resetTokenExpiry = undefined
    await user.save()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error reset-password:', error)
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
  }
}
