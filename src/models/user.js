import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    age: {
      type: Number,
    },
    rol: {
      type: String,
      enum: ['admin', 'client'],
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String, 
    },
    salt: {
      type: String, 
    },
    document: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { collection: 'users' }
)

const User = mongoose.model('Users', UserSchema)
export default User
