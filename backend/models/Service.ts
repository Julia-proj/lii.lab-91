import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IServiceDocument extends Document {
  name: string
  category: 'Manicura' | 'Pedicura' | 'Reconstruccion' | 'Retirado' | 'Combo'
  price: number
  duration: number // minutes
  description?: string
  active: boolean
  popular: boolean
  image?: string    // filename in /public/images/services/
  includes?: string
  createdAt: Date
  updatedAt: Date
}

const ServiceSchema = new Schema<IServiceDocument>(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ['Manicura', 'Pedicura', 'Reconstruccion', 'Retirado', 'Combo'],
      required: true,
    },
    price: { type: Number, required: true },
    duration: { type: Number, required: true }, // minutes
    description: { type: String },
    active: { type: Boolean, default: true },
    popular: { type: Boolean, default: false },
    image: { type: String },
    includes: { type: String },
  },
  { timestamps: true }
)

ServiceSchema.index({ category: 1, active: 1 })

const Service: Model<IServiceDocument> =
  mongoose.models.Service || mongoose.model<IServiceDocument>('Service', ServiceSchema)

export default Service
