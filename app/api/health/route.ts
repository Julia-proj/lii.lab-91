import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import mongoose from 'mongoose'

export async function GET() {
  const checks: Record<string, string> = {}

  // MongoDB
  try {
    await dbConnect()
    checks.mongodb = mongoose.connection.readyState === 1 ? 'ok' : 'not connected'
  } catch (e) {
    checks.mongodb = `error: ${e instanceof Error ? e.message : 'unknown'}`
  }

  // Env vars
  const required = [
    'MONGO_URI', 'AUTH_SECRET', 'NEXTAUTH_URL',
    'EMAIL_FROM', 'EMAIL_PASSWORD',
    'ADMIN_EMAIL', 'NEXT_PUBLIC_BASE_URL',
  ]
  const optional = [
    'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET',
    'STRIPE_SECRET_KEY', 'STRIPE_GUIDE_PRICE_ID',
    'CRON_SECRET', 'CALLMEBOT_API_KEY',
  ]

  const missing = required.filter(k => !process.env[k])
  const missingOptional = optional.filter(k => !process.env[k] || process.env[k]?.startsWith('your-'))

  checks.env_required = missing.length === 0 ? 'ok' : `missing: ${missing.join(', ')}`
  checks.env_optional = missingOptional.length === 0 ? 'ok' : `not configured: ${missingOptional.join(', ')}`

  const allOk = checks.mongodb === 'ok' && checks.env_required === 'ok'

  return NextResponse.json({ success: allOk, data: { checks } }, { status: allOk ? 200 : 503 })
}
