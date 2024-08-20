import jwt from 'jsonwebtoken'
import User from '../models/user.js'

const publicUrls = [
  '/auth/login',
  '/auth/signup',
  '/api/spotify',
  '/api/spotify/callback',
  '/api/refresh-token',
  'api/auth/playlists',
]

export const ensureAuthenticated = (req, res, next) => {
  // Permitir acceso a las rutas que no requieren autenticación
  const publicRoutes = ['/api/spotify', '/api/spotify/callback']
  if (publicRoutes.includes(req.path)) {
    return next()
  }

  const token = req.headers['authorization']
  if (!token) {
    return res.status(401).json({ message: 'You are not authenticated' })
  }

  // Verifica el token
  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' })
    }
    req.user = user
    next()
  })
}
