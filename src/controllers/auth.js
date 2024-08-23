import User from '../models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

/**
 * @param {string} email
 * @param {string} password
 * @return {Promise<string>}
 */
export const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error('Please provide both email and password')
  }

  const user = await User.findOne({ email })

  if (!user) {
    throw new Error('User not found')
  }

  if (user.authProvider === 'spotify') {
    // Redirigir al flujo de autenticación de Spotify si el usuario usa Spotify como proveedor de autenticación
    return `/api/spotify?userId=${user._id}`
  }

  const matchedPassword = await bcrypt.compare(password, user.password)

  if (!matchedPassword) {
    throw new Error('Invalid password')
  }

  // Generar un token JWT
  return jwt.sign({ email, id: user._id }, process.env.TOKEN_SECRET)
}

/**
 * @param {string} email
 * @param {string} password
 * @param {string} firstName
 * @param {string} lastName
 * @return {Promise<string>}
 */
export const signup = async ({ email, password, firstName, lastName }) => {
  if (!email || !password || !firstName || !lastName) {
    throw new Error('Some fields are missing')
  }

  const hasUser = await User.findOne({ email })

  if (hasUser) {
    throw new Error('Email already has been used')
  }

  if (firstName.length < 2) {
    throw new Error('First name must be 2 characters or longer')
  }

  if (lastName.length < 2) {
    throw new Error('Last name must be 2 characters or longer')
  }

  const saltRounds = 10
  const salt = await bcrypt.genSalt(saltRounds)
  const hashedPassword = await bcrypt.hash(password, salt)

  const user = new User({
    email,
    password: hashedPassword,
    salt,
    firstName,
    lastName,
    authProvider: 'local',
  })

  await user.save()

  // Redirigir al flujo de autenticación de Spotify después de registrarse
  return `/api/spotify?userId=${user._id}`
}
