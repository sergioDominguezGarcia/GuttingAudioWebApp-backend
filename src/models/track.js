import mongoose from 'mongoose'

const trackSchema = new mongoose.Schema({
  title: { type: String },
  artist: { type: String },
  album: { type: String },
  s3Url: { type: String },
  duration: { type: Number }, // En segundos
  price: { type: Number }, // Si está en venta
  createdAt: { type: Date, default: Date.now },
})

const Track = mongoose.model('Track', trackSchema)

export default Track
