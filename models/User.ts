import mongoose, { Schema, Document, Model } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUserDocument extends Document {
  name: string
  email: string
  phone?: string
  password?: string
  role: 'user' | 'admin'
  googleId?: string
  image?: string
  createdAt: Date
  updatedAt: Date
  comparePassword(candidate: string): Promise<boolean>
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },
    password: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    googleId: { type: String, sparse: true },
    image: { type: String },
  },
  { timestamps: true }
)

UserSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return
  const salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  if (!this.password) return false
  return bcrypt.compare(candidate, this.password)
}

UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password
    return ret
  },
})

const User: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema)

export default User
