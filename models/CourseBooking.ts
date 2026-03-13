import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ICourseBookingDocument extends Document {
  user: mongoose.Types.ObjectId
  startDate: string // YYYY-MM-DD
  days: string[]    // array of 3 YYYY-MM-DD strings
  status: 'pendiente' | 'confirmada' | 'cancelada'
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const CourseBookingSchema = new Schema<ICourseBookingDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    startDate: { type: String, required: true },
    days: [{ type: String, required: true }],
    status: {
      type: String,
      enum: ['pendiente', 'confirmada', 'cancelada'],
      default: 'confirmada',
    },
    notes: { type: String },
  },
  { timestamps: true }
)

CourseBookingSchema.index({ startDate: 1 })

const CourseBooking: Model<ICourseBookingDocument> =
  mongoose.models.CourseBooking || mongoose.model<ICourseBookingDocument>('CourseBooking', CourseBookingSchema)

export default CourseBooking
