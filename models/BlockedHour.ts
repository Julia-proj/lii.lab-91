import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IBlockedHourDocument extends Document {
  date: string // YYYY-MM-DD
  startTime: string // HH:mm
  endTime: string // HH:mm
  reason?: string
  blockedBy: mongoose.Types.ObjectId
  createdAt: Date
}

const BlockedHourSchema = new Schema<IBlockedHourDocument>(
  {
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    reason: { type: String },
    blockedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

BlockedHourSchema.index({ date: 1 })

const BlockedHour: Model<IBlockedHourDocument> =
  mongoose.models.BlockedHour || mongoose.model<IBlockedHourDocument>('BlockedHour', BlockedHourSchema)

export default BlockedHour
