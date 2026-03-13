import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IBlockedDateDocument extends Document {
  date: string // YYYY-MM-DD
  reason?: string
  blockedBy: mongoose.Types.ObjectId
  createdAt: Date
}

const BlockedDateSchema = new Schema<IBlockedDateDocument>(
  {
    date: { type: String, required: true, unique: true },
    reason: { type: String },
    blockedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

const BlockedDate: Model<IBlockedDateDocument> =
  mongoose.models.BlockedDate || mongoose.model<IBlockedDateDocument>('BlockedDate', BlockedDateSchema)

export default BlockedDate
