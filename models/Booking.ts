import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IBookingDocument extends Document {
  user: mongoose.Types.ObjectId
  services: mongoose.Types.ObjectId[]
  quantities?: Map<string, number> // serviceId -> quantity (for Decoraciones etc)
  date: string // YYYY-MM-DD
  startTime: string // HH:mm
  endTime: string   // HH:mm
  status: 'pendiente' | 'confirmada' | 'cancelada' | 'completada'
  notes?: string
  paidAmount?: number // Сумма, реально оплаченная клиентом (может редактировать только админ)
  adminNotes?: string // Заметки админа (только для внутреннего использования)
  createdAt: Date
  updatedAt: Date
}

const BookingSchema = new Schema<IBookingDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    services: [{ type: Schema.Types.ObjectId, ref: 'Service', required: true }],
    quantities: { type: Map, of: Number, default: {} },
    date: { type: String, required: true }, // YYYY-MM-DD
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    status: {
      type: String,
      enum: ['pendiente', 'confirmada', 'cancelada', 'completada'],
      default: 'confirmada',
    },
    notes: { type: String },
    paidAmount: { type: Number },
    adminNotes: { type: String },
  },
  { timestamps: true }
)

BookingSchema.index({ date: 1, startTime: 1 })
BookingSchema.index({ user: 1, status: 1 })

const Booking: Model<IBookingDocument> =
  mongoose.models.Booking || mongoose.model<IBookingDocument>('Booking', BookingSchema)

export default Booking
