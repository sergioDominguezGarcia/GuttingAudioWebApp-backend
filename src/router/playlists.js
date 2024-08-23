import express from 'express'
import { getUserPlaylists } from '../controllers/playlists.js'

const router = express.Router()

// Ruta para obtener las listas de reproducción del perfil específico sin autenticación
router.get('/playlists', getUserPlaylists)

export default router
