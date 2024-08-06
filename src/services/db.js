import mongoose from 'mongoose';

export const connectToDb = async () => {
  try {
    console.log('Starting DB connection...')
    await mongoose.connect('mongodb://localhost:27017/Gutting_Audio')
    console.log('Connected to Gutting_Audio DataBase')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    throw error
  }
}

export default connectToDb