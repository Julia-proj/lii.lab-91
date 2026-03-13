import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IBookingDocument extends Document {
  user: mongoose.Types.ObjectId
  service: mongoose.Types.ObjectId
  date: string // YYYY-MM-DD
  startTime: string // HH:mm
  endTime: string   // HH:mm
  status: 'pendiente' | 'confirmada' | 'cancelada' | 'completada'
  quantity?: number  // Para servicios como Decoraciones (default 1)
  notes?: string
  paidAmount?: number // Сумма, реально оплаченная клиентом (может редактировать только админ)
  createdAt: Date
  updatedAt: Date
}

const BookingSchema = new Schema<IBookingDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    service: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    status: {
      type: String,
      enum: ['pendiente', 'confirmada', 'cancelada', 'completada'],
      default: 'confirmada',
    },
    quantity: { type: Number, default: 1, min: 1, max: 10 },
    notes: { type: String },
    paidAmount: { type: Number },
  },
  { timestamps: true }
)

BookingSchema.index({ date: 1, startTime: 1 })
BookingSchema.index({ user: 1, status: 1 })

const Booking: Model<IBookingDocument> =
  mongoose.models.Booking || mongoose.model<IBookingDocument>('Booking', BookingSchema)

export default Booking
