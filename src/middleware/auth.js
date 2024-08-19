import jwt from 'jsonwebtoken'
import User from '../models/user.js'

const publicUrls = [
  '/auth/login',
  '/auth/signup',
  '/auth/spotify/callback',
  '/auth/spotify/redirect',
]

export const ensureAuthenticated = async (req, res, next) => {
  // Excluye las URLs públicas de la autenticación
  if (publicUrls.includes(req.originalUrl)) {
    return next()
  }

  // Verifica la presencia del encabezado de autorización
  if (!req.headers.authorization) {
    return res.status(403).send({ message: 'You are not authenticated' })
  }

  // Obtén el token del encabezado
  const token = req.headers.authorization.split(' ')[1]
  if (!token) {
    return res.status(403).send({ message: 'You are not authenticated' })
  }

  // Verifica el token JWT
  try {
    const payload = jwt.verify(token, process.env.TOKEN_SECRET)
    if (!payload || !payload.id) {
      return res.status(403).send({ message: 'Invalid token' })
    }

    const user = await User.findById(payload.id)
    if (!user) {
      return res.status(401).send({ message: 'User not found' })
    }

    req.user = user
    next()
  } catch (err) {
    return res.status(403).send({ message: 'Invalid token' })
  }
}
