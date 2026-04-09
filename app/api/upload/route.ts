import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { put } from '@vercel/blob'

const ALLOWED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5 MB

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 403 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ success: false, error: 'No se recibió archivo' }, { status: 400 })
    if (!ALLOWED.includes(file.type)) return NextResponse.json({ success: false, error: 'Formato no válido (jpg, png, webp)' }, { status: 400 })
    if (file.size > MAX_SIZE) return NextResponse.json({ success: false, error: 'Archivo demasiado grande (máx 5 MB)' }, { status: 400 })

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filename = `services/${Date.now()}.${ext}`

    const blob = await put(filename, file, { access: 'public', contentType: file.type })
    return NextResponse.json({ success: true, data: { path: blob.url } })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error al subir archivo'
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}
