import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxLength: 32 },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minLength: 6 },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  },
)

const User = mongoose.models.User || mongoose.model('User', userSchema)

export default User
