import express from 'express'
import {
  getUserPlaylists,
  getClientCredentialsToken,
} from '../controllers/playlists.js'

const router = express.Router()

// Ruta para obtener las listas de reproducción del perfil específico sin autenticación
router.get('/playlists', getUserPlaylists)
router.get('/token', getClientCredentialsToken)

export default router
