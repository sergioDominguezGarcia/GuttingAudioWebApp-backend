import jwt from 'jsonwebtoken'
import User from '../models/user.js'

const publicUrls = [
  '/auth/login',
  '/auth/signup',
  '/tracks',
  '/tracks/upload',
  '/tracks/delete/:id',
]
export const ensureAuthenticated = async (request, response, next) => {
  if (!publicUrls.includes(request.originalUrl)) {
    if (!request.headers.authorization) {
      return response.status(403).send({ message: 'You are not authenticated' })
    }

    const token = request.headers.authorization.split(' ')[1]
    if (!token) {
      return response.status(403).send({ message: 'You are not authenticated' })
    }

    const payload = jwt.decode(token, process.env.TOKEN_SECRET)

    if (!payload || !payload.id) {
      return response.status(403).send({ message: 'Wrong token' })
    }

    const user = await User.findOne({ _id: payload.id })

    if (!user) {
      return response.status(401).send({ message: 'Wrong token' })
    }

    request.user = user
  }

  next()
}
