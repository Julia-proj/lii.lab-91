import mongoose from 'mongoose'
import { config } from 'dotenv'
import { resolve } from 'path'

// Carga las variables de entorno desde .env.local
config({ path: resolve(process.cwd(), '.env.local') })

const MONGO_URI = process.env.MONGO_URI!

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
}, { timestamps: true, strict: false })

const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema)

// Mapa: nombre del servicio → nombre de la imagen
const imageMap: Record<string, string> = {
  'Manicura combinada': 'ser1.jpg',
  'Manicura combinada con refuerzo': 'ser4.jpg',
  'Manicura francesa': 'ser3.jpg',
  'Decoraciones': 'ser2.jpg',
  'Manicura permanente con refuerzo y francesa': 'ser6.jpg',
  'Refuerzo con restauración del cuadrado': 'ser6.jpg',
  'Pedicura básica': 'ser8.jpg',
  'Pedicura con esmalte permanente y francesa': 'ser7.jpg',
}

async function updateImages() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('Conectado a MongoDB')

    for (const [name, image] of Object.entries(imageMap)) {
      const result = await Service.updateOne({ name }, { $set: { image } })
      if (result.modifiedCount > 0) {
        console.log(`✓ ${name} → ${image}`)
      } else {
        console.log(`⚠ No se encontró: ${name}`)
      }
    }

    console.log('\nImagenes actualizadas.')
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await mongoose.disconnect()
  }
}

updateImages()
