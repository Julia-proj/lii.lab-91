import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import Service from '@/models/Service'
import { auth } from '@/lib/auth'
import { serviceSchema } from '@/lib/validators'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await dbConnect()
    const service = await Service.findById(id)
    if (!service) {
      return NextResponse.json({ error: 'Servicio no encontrado' }, { status: 404 })
    }
    return NextResponse.json(service)
  } catch (error) {
    console.error('Error fetching service:', error)
    return NextResponse.json({ error: 'Error al obtener servicio' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { id } = await params
    const body = await req.json()
    const parsed = serviceSchema.partial().safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }

    await dbConnect()
    const service = await Service.findByIdAndUpdate(id, parsed.data, { new: true })
    if (!service) {
      return NextResponse.json({ error: 'Servicio no encontrado' }, { status: 404 })
    }
    return NextResponse.json(service)
  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json({ error: 'Error al actualizar servicio' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { id } = await params
    await dbConnect()
    const service = await Service.findByIdAndUpdate(id, { active: false }, { new: true })
    if (!service) {
      return NextResponse.json({ error: 'Servicio no encontrado' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Servicio desactivado' })
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json({ error: 'Error al eliminar servicio' }, { status: 500 })
  }
}
