import mongoose from 'mongoose'

export const connectToDb = async () => {
  console.log('Starting DB connection...')
  await mongoose.connect('mongodb://localhost:27017/GuttingAudio', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log('Connected to DB GuttingAudio')
}

export default connectToDb
