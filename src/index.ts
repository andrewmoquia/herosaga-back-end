import './utilities/database'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import express from 'express'
import cookieParser from 'cookie-parser'
import { config } from './utilities/config'
import registerRoute from './routes/registerRoutes'
import passport from 'passport'
import userRoutes from './routes/user'
import verifyEmail from './routes/verifyEmail'
import forgotPassword from './routes/forgotPassword'
import csfrRoute from './routes/csrf'
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

app.use(express.urlencoded({ extended: false }))
app.use(express.json()) // To parse the incoming requests with JSON payloads

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
app.use(registerRoute)
app.use(userRoutes)
app.use(verifyEmail)
app.use(forgotPassword)
app.use(csfrRoute)

//Live our server
app.listen(config.PORT, () => {
   console.log('Server is up!')
})
