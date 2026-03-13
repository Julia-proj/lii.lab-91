import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import User from '@/models/User'
import { auth } from '@/lib/auth'
import { profileSchema } from '@/lib/validators'

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    await dbConnect()
    const user = await User.findById(session.user.id).select('name email phone image').lean()
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Error al obtener perfil' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = profileSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    await dbConnect()
    const user = await User.findByIdAndUpdate(
      session.user.id,
      { name: parsed.data.name, phone: parsed.data.phone },
      { new: true }
    ).select('name email phone')

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Error al actualizar perfil' }, { status: 500 })
  }
}
