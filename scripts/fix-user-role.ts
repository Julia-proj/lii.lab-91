import mongoose from 'mongoose'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const MONGO_URI = process.env.MONGO_URI!

const UserSchema = new mongoose.Schema({ email: String, role: String }, { strict: false })
const User = mongoose.models.User || mongoose.model('User', UserSchema)

async function fixRole() {
  await mongoose.connect(MONGO_URI)
  console.log('Conectado')

  const result = await User.updateOne(
    { email: 'juleea0@gmail.com' },
    { $set: { role: 'user' } }
  )

  if (result.modifiedCount > 0) {
    console.log('✓ juleea0@gmail.com ahora tiene rol: user')
  } else {
    const user = await User.findOne({ email: 'juleea0@gmail.com' })
    if (user) {
      console.log('Ya tenía rol:', user.role, '— sin cambios')
    } else {
      console.log('⚠ Usuario no encontrado')
    }
  }

  await mongoose.disconnect()
}

fixRole().catch(console.error)
