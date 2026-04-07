import mongoose, { Schema, type Document } from 'mongoose'

export interface ISettingsDocument extends Document {
  key: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
  updatedAt: Date
}

const SettingsSchema = new Schema<ISettingsDocument>(
  {
    key:   { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
)

export default mongoose.models.Settings ||
  mongoose.model<ISettingsDocument>('Settings', SettingsSchema)
