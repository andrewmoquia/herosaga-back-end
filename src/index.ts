import './utilities/database'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import express from 'express'
import cookieParser from 'cookie-parser'
import { config } from './utilities/config'
import passport from 'passport'
import userRoutes from './routes/user'
import csfrRoute from './routes/csrf'
import nftRoutes from './routes/nft'
import { limiter } from './utilities/limiter'

const app = express()

// Allow test in localhost:3000
app.set('trust proxy', 1)

//Site that allow to make request in API
app.use(
   cors({
      origin: 'http://localhost:3000',
      credentials: true,
   })
)

// To parse the incoming requests with JSON payloads
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// We need this because "cookie" is true in csrfProtection.
app.use(cookieParser('secret'))

//Add 11 layer of security
app.use(helmet())

//Apply the limiter
app.use(limiter)

//Console request action in HTTP
app.use(morgan('dev'))
app.use(express.json())

//Start passport middleware
app.use(passport.initialize())

//Handle routes.
app.use(userRoutes)
app.use(csfrRoute)
app.use(nftRoutes)

//Live our server
app.listen(config.PORT, () => {
   console.log('Server is up!')
})
