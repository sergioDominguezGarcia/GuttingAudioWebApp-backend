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
      type: String, // Ahora opcional, solo para usuarios locales
    },
    salt: {
      type: String, // Ahora opcional, solo para usuarios locales
    },
    document: {
      type: String,
    },
    spotifyId: {
      type: String, // Opcional y único, solo para usuarios de Spotify
      unique: true,
      sparse: true,
    },
    displayName: {
      type: String, // Nombre en Spotify, opcional
    },
    accessToken: {
      type: String, // Token de acceso de Spotify, opcional
    },
    refreshToken: {
      type: String, // Token de refresco de Spotify, opcional
    },
    authProvider: {
      type: String,
      enum: ['local', 'spotify'], // Distinción entre usuarios locales y de Spotify
      default: 'local',
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
