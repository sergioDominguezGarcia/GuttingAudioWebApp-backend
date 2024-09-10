import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import cors from 'cors'
import { ensureAuthenticated } from './src/middleware/auth.js'
import authRouter from './src/router/auth.js'
import trackRouter from './src/router/track.js'
import usersRouter from './src/router/user.js'

import connectToDb from './src/services/db.js'

dotenv.config();

const startApp = async () => {
  const app = express()
  const port = process.env.PORT
  app.use(cors())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

 
  // app.use(ensureAuthenticated)

  app.use('/tracks', trackRouter)
  app.use('/auth', authRouter)
  app.use('/users', usersRouter)

  try {
    await connectToDb()
    app.listen(port, () => {
      console.log(`Server start in ${port}`)
    })
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
}

startApp()
