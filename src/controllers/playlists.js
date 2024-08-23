import axios from 'axios'
import querystring from 'querystring'
import dotenv from 'dotenv'

dotenv.config()

// Función para obtener el token de acceso utilizando Client Credentials Flow
const getClientCredentialsToken = async () => {
  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        grant_type: 'client_credentials',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString('base64')}`,
        },
      }
    )

    return response.data.access_token
  } catch (error) {
    console.error('Error fetching Spotify token:', error)
    throw new Error('Failed to obtain Spotify access token')
  }
}

// Controlador para obtener las playlists de un perfil específico
export const getUserPlaylists = async (req, res) => {
  try {
    // Obtén un token de acceso usando el Client Credentials Flow
    const accessToken = await getClientCredentialsToken()

    // Realiza la solicitud a la API de Spotify para obtener las playlists públicas del perfil específico
    const response = await axios.get(
      'https://api.spotify.com/v1/users/31f4v7jjcbm7zbuyzj3ntniapqmq/playlists',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    res.json(response.data) // Devolver las listas de reproducción al frontend
  } catch (error) {
    console.error('Error fetching playlists:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
