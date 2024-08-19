import express from 'express'
import axios from 'axios'
const router = express.Router()

router.get('/playlists', async (req, res) => {
  const accessToken = req.headers.authorization.split(' ')[1]
  try {
    const response = await axios.get(
      'https://api.spotify.com/v1/me/playlists',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/artists', async (req, res) => {
  const accessToken = req.headers.authorization.split(' ')[1]
  try {
    const response = await axios.get(
      'https://api.spotify.com/v1/me/following?type=artist',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    res.json(response.data.artists)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
