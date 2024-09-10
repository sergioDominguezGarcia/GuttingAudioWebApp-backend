import mongoose from 'mongoose'

const trackSchema = new mongoose.Schema({
  title: { type: String  },
  // track: { type: File},
  artist: { type: String},
  genre: { type: String },
  s3Url: { type: String },
  duration: { type: Number }, // En segundos
  price: { type: Number }, // Si está en venta
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['publicado', 'borrador'],
    default: 'borrador',
  },
})

const Track = mongoose.model('Track', trackSchema)

export default Track
