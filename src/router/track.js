import express from 'express'
import multer from 'multer' // Asegúrate de importar multer
import {
  uploadTrack,
  getAllTracks,
  getTrackById,
  deleteTrackById,
} from '../controllers/track.js'

const router = express.Router()

// Configurar multer para manejar la subida de archivos
const upload = multer({ storage: multer.memoryStorage() })

// Ruta para subir una nueva pista
router.post('/upload', upload.single('track'), async (req, res) => {
  try {
    console.log(req.body) // Verifica el body
    console.log(req.file) // Verifica el archivo

    const newTrack = await uploadTrack(req.body, req.file)
    res
      .status(201)
      .json({ message: 'Track uploaded successfully', track: newTrack })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
})

// Ruta para obtener todas las pistas
router.get('/', async (req, res) => {
  try {
    const tracks = await getAllTracks()
    res.json({ tracks })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Ruta para obtener una pista por ID
router.get('/:id', async (req, res) => {
  try {
    const track = await getTrackById(req.params.id)
    res.json({ track })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Ruta para borrar una pista por ID
router.delete('/delete/:id', async (req, res) => {
  try {
    await deleteTrackById(req.params.id)
    res.json({ removed: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
