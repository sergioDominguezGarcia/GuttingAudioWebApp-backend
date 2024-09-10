import { uploadFileToS3 } from '../services/s3.js'
import Track from '../models/track.js'

/**
 * @param {object} trackData - Datos de la pista
 * @param {object} file - Archivo de la pista
 * @returns {Promise<object>}
 */
export const uploadTrack = async (trackData, file) => {
  if (!file) {
    throw new Error('No file uploaded')
  }

  // Subir archivo a S3

  const cloudfrontURL = process.env.CLOUDFRONT_URL
  const result = await uploadFileToS3(file)
  const s3Url = result.Location // URL original de S3

  const newTrack = new Track({
    title: trackData.title,
    artist: trackData.artist,
    album: trackData.album,
    s3Url: s3Url.replace(
      `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`,
      `https://${cloudfrontURL}`
    ),
    duration: trackData.duration,
    price: trackData.price,
  })

  // Guardar pista en MongoDB
  await newTrack.save()

  return newTrack
}

/**
 * Obtener todas las pistas
 * @returns {Promise<object[]>}
 */
export const getAllTracks = async () => {
  return await Track.find()
}

/**
 * Obtener una pista por su ID
 * @param {string} id - ID de la pista
 * @returns {Promise<object>}
 */
export const getTrackById = async (id) => {
  const track = await Track.findById(id)

  if (!track) {
    throw new Error('Track not found')
  }

  return track
}

/**
 * Borrar una pista por su ID
 * @param {string} id - ID de la pista
 * @returns {Promise<boolean>}
 */
export const deleteTrackById = async (id) => {
  const result = await Track.deleteOne({ _id: id })

  if (result.deletedCount === 0) {
    throw new Error('Track not found or already deleted')
  }

  return true
}
