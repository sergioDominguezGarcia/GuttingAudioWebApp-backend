import axios from 'axios'
import querystring from 'querystring'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import User from '../models/user.js'

dotenv.config()
/**
 * @param {string} userId - ID del usuario en la base de datos.
 * @return {Promise<Object>} - Objeto con el nuevo accessToken y refreshToken.
 */
export const refreshAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId)
    if (!user || !user.refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: user.refreshToken,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

    const { access_token, refresh_token } = response.data

    // Actualizar el token en la base de datos
    user.accessToken = access_token
    if (refresh_token) {
      user.refreshToken = refresh_token
    }
    await user.save()

    return { accessToken: access_token, refreshToken: refresh_token }
  } catch (error) {
    throw new Error('Failed to refresh access token')
  }
}

export const refreshTokenHandler = async (req, res) => {
  const { userId } = req.body

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' })
  }

  try {
    const { accessToken, refreshToken } = await refreshAccessToken(userId)

    // Responder con el nuevo accessToken y refreshToken
    res.json({ accessToken, refreshToken })
  } catch (error) {
    console.error('Error refreshing token:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

// Redirige a la autenticación de Spotify
export const redirectToSpotify = (req, res) => {
  const scopes = 'user-read-private user-read-email'
  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?${querystring.stringify(
    {
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: scopes,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    }
  )}`
  res.redirect(spotifyAuthUrl)
}

// Maneja el callback de Spotify y procesa los tokens
export const handleSpotifyCallback = async (req, res) => {
  const code = req.query.code || null

  if (!code) {
    return res.status(400).json({ message: 'Authorization code is missing' })
  }

  try {
    // Intercambiar el código por tokens de acceso y refresh
    const tokenResponse = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

    const { access_token, refresh_token } = tokenResponse.data

    // Obtener el perfil del usuario de Spotify
    const userProfileResponse = await axios.get(
      'https://api.spotify.com/v1/me',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    )

    const spotifyUser = userProfileResponse.data

    // Verificar si el usuario ya existe en la base de datos
    let user = await User.findOne({ spotifyId: spotifyUser.id })

    if (!user) {
      // Crear un nuevo usuario si no existe
      user = new User({
        spotifyId: spotifyUser.id,
        email: spotifyUser.email,
        displayName: spotifyUser.display_name,
        accessToken: access_token,
        refreshToken: refresh_token,
        authProvider: 'spotify',
      })
    } else {
      // Actualizar los tokens si el usuario ya existe
      user.accessToken = access_token
      user.refreshToken = refresh_token
    }

    await user.save()

    // Crear un token JWT para la sesión del usuario
    const jwtToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.TOKEN_SECRET
    )

    // Redirigir al frontend con el token JWT
    res.redirect(`/success?token=${jwtToken}`)
  } catch (error) {
    console.error('Error during Spotify OAuth callback:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
