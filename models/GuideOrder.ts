import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IGuideOrderDocument extends Document {
  user: mongoose.Types.ObjectId
  stripeSessionId: string
  status: 'pendiente' | 'pagado' | 'fallido'
  downloadUrl?: string
  paidAt?: Date
  createdAt: Date
  updatedAt: Date
}

const GuideOrderSchema = new Schema<IGuideOrderDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    stripeSessionId: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ['pendiente', 'pagado', 'fallido'],
      default: 'pendiente',
    },
    downloadUrl: { type: String },
    paidAt: { type: Date },
  },
  { timestamps: true }
)

const GuideOrder: Model<IGuideOrderDocument> =
  mongoose.models.GuideOrder || mongoose.model<IGuideOrderDocument>('GuideOrder', GuideOrderSchema)

export default GuideOrder
