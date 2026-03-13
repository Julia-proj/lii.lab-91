import mongoose from 'mongoose'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local from project root
config({ path: resolve(process.cwd(), '.env.local') })

const MONGO_URI = process.env.MONGO_URI!

// Define Service schema inline to avoid module resolution issues in standalone script
const ServiceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
    description: { type: String },
    active: { type: Boolean, default: true },
    popular: { type: Boolean, default: false },
    image: { type: String },
    includes: { type: String },
  },
  { timestamps: true }
)

const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema)

const services = [
  // MANICURA (7)
  {
    name: 'Manicura combinada',
    category: 'Manicura',
    price: 30,
    duration: 60,
    popular: false,
    image: 'ser1.jpg',
    description: 'Manicura combinada incluye: retirado (excepto de otro centro), manicura combinada (rusa), esmaltado permanente encima de uña natural (sin refuerzo).',
  },
  {
    name: 'Manicura combinada con refuerzo',
    category: 'Manicura',
    price: 35,
    duration: 75,
    popular: true,
    image: 'ser4.jpg',
    description: 'Manicura combinada con refuerzo incluye: retirada (excepto de otro centro), manicura combinada (rusa), refuerzo con base rubber o gel (encima de uña natural), esmaltado permanente. No te olvides añadir "retirado de otro centro" en caso de que lo necesites o "decoración" si la quieres.',
  },
  {
    name: 'Refuerzo con restauración del cuadrado',
    category: 'Manicura',
    price: 45,
    duration: 90,
    popular: false,
    image: 'ser6.jpg',
    description: 'Manicura combinada con refuerzo y restauración del cuadrado. Ayuda a hacer un cuadrado perfecto con las esquinas reforzadas.',
  },
  {
    name: 'Manicura permanente con refuerzo y francesa',
    category: 'Manicura',
    price: 40,
    duration: 90,
    popular: false,
    image: 'ser6.jpg',
    description: 'Manicura combinada con refuerzo incluye: retirada (excepto de otro centro), manicura combinada (rusa), refuerzo con base rubber o gel (encima de uña natural), esmaltado permanente con francesa.',
  },
  {
    name: 'Manicura francesa',
    category: 'Manicura',
    price: 5,
    duration: 15,
    popular: true,
    image: 'ser3.jpg',
    description: 'Suplemento por manicura francesa.',
  },
  {
    name: 'Decoraciones',
    category: 'Manicura',
    price: 1,
    duration: 10,
    popular: true,
    image: 'ser2.jpg',
    description: 'El precio de decoración varía según la dificultad y el tiempo que se tarda.',
  },
  {
    name: 'Arreglar uña rota',
    category: 'Manicura',
    price: 5,
    duration: 20,
    popular: false,
    image: 'una-rota.jpg',
    description: 'Reparación de una uña rota.',
  },

  // PEDICURA (5)
  {
    name: 'Pedicura básica',
    category: 'Pedicura',
    price: 35,
    duration: 45,
    popular: false,
    image: 'ser8.jpg',
    description: 'Pedicura básica incluye: retirado (excepto de otro centro), pedicura combinada (solo dedos), esmaltado.',
  },
  {
    name: 'Pedicura con esmalte permanente y francesa',
    category: 'Pedicura',
    price: 40,
    duration: 60,
    popular: false,
    image: 'ser7.jpg',
    description: 'Pedicura básica incluye: retirado (excepto de otro centro), pedicura combinada (solo dedos), esmaltado con francesa.',
  },
  {
    name: 'Pedicura básica con podología',
    category: 'Pedicura',
    price: 45,
    duration: 60,
    popular: false,
    image: 'pedi-podologia.jpg',
    description: 'Pedicura básica con podología incluye: pedicura combinada (solo dedos), limpieza de pliegues para aliviar la presión y molestias y esmaltado si lo quieres.',
  },
  {
    name: 'Pedicura completa sin esmaltado',
    category: 'Pedicura',
    price: 45,
    duration: 60,
    popular: false,
    image: 'pedi-completa.jpg',
    description: 'Pedicura completa incluye: pedicura combinada de los dedos y el talón.',
  },
  {
    name: 'Pedicura completa con esmalte permanente',
    category: 'Pedicura',
    price: 55,
    duration: 75,
    popular: false,
    image: 'pedi-completa-esmalte.jpg',
    description: 'Pedicura completa incluye: pedicura combinada de los dedos y el talón, esmaltado permanente.',
  },

  // RECONSTRUCCION (3)
  {
    name: 'Uñas de gel',
    category: 'Reconstruccion',
    price: 55,
    duration: 120,
    popular: false,
    image: 'gel.jpg',
    description: 'Uñas de gel incluye: manicura combinada, reconstrucción de las uñas con el largo deseado, esmaltado permanente.',
  },
  {
    name: 'Uñas nuevas (mordidas)',
    category: 'Reconstruccion',
    price: 60,
    duration: 135,
    popular: false,
    image: 'gel-mordidas.jpg',
    description: 'Reconstrucción completa para uñas mordidas.',
  },
  {
    name: 'Relleno de gel',
    category: 'Reconstruccion',
    price: 45,
    duration: 75,
    popular: false,
    image: 'gel-relleno.jpg',
    description: 'Relleno de gel incluye: retirado (excepto de otro centro), manicura combinada (rusa), relleno de gel, esmaltado permanente.',
  },

  // RETIRADO (5)
  {
    name: 'Retirado básico',
    category: 'Retirado',
    price: 10,
    duration: 15,
    popular: false,
    image: 'retirado-basico.jpg',
    description: 'Retirada básica de material.',
  },
  {
    name: 'Retirado con manicura',
    category: 'Retirado',
    price: 25,
    duration: 45,
    popular: false,
    image: 'retirado-mani.jpg',
    description: 'Retirada con manicura completa.',
  },
  {
    name: 'Retirado con pedicura',
    category: 'Retirado',
    price: 20,
    duration: 45,
    popular: false,
    image: 'retirado-pedi.jpg',
    description: 'Retirada con pedicura.',
  },
  {
    name: 'Retirado del otro centro (esmaltado)',
    category: 'Retirado',
    price: 10,
    duration: 15,
    popular: false,
    image: 'retirado-centro-esmalte.jpg',
    description: 'Retirada de esmaltado realizado en otro centro.',
  },
  {
    name: 'Retirado del otro centro (gel, acrílico)',
    category: 'Retirado',
    price: 15,
    duration: 30,
    popular: false,
    image: 'retirado-centro-gel.jpg',
    description: 'Retirada de gel o acrílico realizado en otro centro.',
  },

  // COMBO (2)
  {
    name: 'Mani + pedi',
    category: 'Combo',
    price: 70,
    duration: 120,
    popular: false,
    image: 'combo-mani-pedi.jpg',
    description: 'Manicura combinada con refuerzo + pedicura básica.',
    includes: 'Manicura Combinada Con Refuerzo, Pedicura Básica',
  },
  {
    name: 'Mani refu + pedi completa',
    category: 'Combo',
    price: 90,
    duration: 150,
    popular: false,
    image: 'combo-mani-refuerzo-pedi.jpg',
    description: 'Manicura combinada con refuerzo + pedicura completa con esmalte permanente.',
    includes: 'Manicura Combinada Con Refuerzo, Pedicura Completa Con Esmalte Permanente',
  },
]

async function seed() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('Connected to MongoDB')

    await Service.deleteMany({})
    console.log('Cleared existing services')

    const result = await Service.insertMany(services)
    console.log(`Seeded ${result.length} services`)

    await mongoose.disconnect()
    console.log('Done!')
    process.exit(0)
  } catch (error) {
    console.error('Seed error:', error)
    process.exit(1)
  }
}

seed()
