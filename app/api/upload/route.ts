import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

const ALLOWED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5 MB

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No se recibió archivo' }, { status: 400 })
  if (!ALLOWED.includes(file.type)) return NextResponse.json({ error: 'Formato no válido (jpg, png, webp)' }, { status: 400 })
  if (file.size > MAX_SIZE) return NextResponse.json({ error: 'Archivo demasiado grande (máx 5 MB)' }, { status: 400 })

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const filename = `${Date.now()}.${ext}`
  const dir = join(process.cwd(), 'public', 'images', 'services')

  await mkdir(dir, { recursive: true })
  await writeFile(join(dir, filename), new Uint8Array(await file.arrayBuffer()))

  return NextResponse.json({ path: `/images/services/${filename}` })
}
