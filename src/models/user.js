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
      require: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    salt: {
      type: String,
      require: true,
    },
    document: {
      type: String,
    },
    createdAt: {
      type: Date,
      require: true,
      default: Date.now,
    },
  },
  { collection: 'users' }
)

const User = mongoose.model('User', UserSchema)
export default User
