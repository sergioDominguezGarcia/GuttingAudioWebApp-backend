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

  const matchedPassword = await bcrypt.compare(password, user.password)

  if (!matchedPassword) {
    throw new Error('Invalid password')
  }

  return jwt.sign({ email, id: user._id }, process.env.TOKEN_SECRET)
}

/**
 * @param {string} firstName
 * @param {string} lastName
 * @param {number} age
 * @param {number} phone
 * @param {'admin' | 'client'} rol
 * @param {string} password
 * @param {string} document
 * @return {Promise<string>}
 */
export const signup = async ({
  email,
  password,
  age,
  firstName,
  lastName,
  phone,
  document,
}) => {
  if (
    !email ||
    !password ||
    !firstName ||
    !lastName ||
    !age ||
    !document ||
    !phone
  ) {
    throw new Error('Some fields are missing')
  }

  const hasUser = await User.findOne({ email })

  if (hasUser) {
    throw new Error('Email already has been used')
  }

  if (age && typeof age !== 'number') {
    throw new Error('Please provide a valid age')
  }

  if (firstName && firstName.length < 2) {
    throw new Error('First name must be 2 characters or longer')
  }

  if (lastName && lastName.length < 2) {
    throw new Error('Last name must be 2 characters or longer')
  }

  const saltRounds = 10
  const salt = await bcrypt.genSalt(saltRounds)

  const hashedPassword = await bcrypt.hash(password, salt)
  const user = new User({
    password: hashedPassword,
    email,
    age,
    firstName,
    lastName,
    phone,
    document,
  })

  await user.save()

  return jwt.sign({ email, id: user._id }, process.env.TOKEN_SECRET)
}
