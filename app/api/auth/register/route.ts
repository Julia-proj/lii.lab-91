import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import User from '@/models/User'
import { registerSchema } from '@/lib/validators'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    await dbConnect()

    const normalizedEmail = parsed.data.email.toLowerCase().trim()

    const existing = await User.findOne({ email: normalizedEmail })
    if (existing) {
      return NextResponse.json(
        { error: 'Ya existe una cuenta con este email' },
        { status: 409 }
      )
    }

    const user = await User.create({
      name: parsed.data.name,
      email: normalizedEmail,
      phone: parsed.data.phone,
      password: parsed.data.password, // Will be hashed by pre-save hook
      role: 'user',
    })

    return NextResponse.json(
      { message: 'Cuenta creada correctamente', userId: user._id },
      { status: 201 }
    )
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Registration error:', message)
    return NextResponse.json(
      { error: 'Error al crear la cuenta' },
      { status: 500 }
    )
  }
}
