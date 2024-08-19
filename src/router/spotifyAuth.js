import express from 'express'
import {
  redirectToSpotify,
  handleSpotifyCallback,
  refreshTokenHandler,
} from '../controllers/spotifyAuth.js'

const router = express.Router()

// Redirige a la autenticación de Spotify
router.get('/spotify', redirectToSpotify)

// Maneja el callback de Spotify
router.get('/spotify/callback', handleSpotifyCallback)

// Ruta para refrescar el token de acceso
router.post('/refresh-token', refreshTokenHandler)


export default router
