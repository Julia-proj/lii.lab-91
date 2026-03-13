/**
 * Promote a user to admin role.
 * Usage: pnpm promote-admin            (uses ADMIN_EMAIL from .env.local)
 *        pnpm promote-admin user@mail  (explicit email)
 */
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import mongoose from 'mongoose'

const MONGO_URI = process.env.MONGO_URI
if (!MONGO_URI) {
  console.error('MONGO_URI not found in .env.local')
  process.exit(1)
}

const email = process.argv[2] || process.env.ADMIN_EMAIL
if (!email) {
  console.error('Usage: tsx scripts/promote-admin.ts <email>')
  console.error('Or set ADMIN_EMAIL in .env.local')
  process.exit(1)
}

async function main() {
  await mongoose.connect(MONGO_URI!)
  console.log('Connected to MongoDB')

  const result = await mongoose.connection.db!.collection('users').findOneAndUpdate(
    { email: email!.toLowerCase() },
    { $set: { role: 'admin' } },
    { returnDocument: 'after' }
  )

  if (!result) {
    console.error(`User with email "${email}" not found in database.`)
    console.log('Registered users:')
    const users = await mongoose.connection.db!.collection('users').find({}, { projection: { email: 1, name: 1, role: 1 } }).toArray()
    users.forEach((u) => console.log(`  - ${u.email} (${u.name}) [${u.role}]`))
    await mongoose.disconnect()
    process.exit(1)
  }

  console.log(`User "${result.name}" (${result.email}) promoted to admin.`)
  console.log('IMPORTANT: Log out and log back in for the role change to take effect (JWT must be refreshed).')
  await mongoose.disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
