import './database'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import express from 'express'
import cookieParser from 'cookie-parser'
import { config } from './config'
import signupRoute from './routes/registerRoutes'
import passport from 'passport'
import loginRoute from './routes/loginRoute'
import verifyEmail from './routes/verifyEmail'
import forgotPassword from './routes/forgotPassword'
import { limiter } from './limiter'
import { csrfAuthenticate } from './csrfToken'

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
app.use(signupRoute)
app.use(loginRoute)
app.use(verifyEmail)
app.use(forgotPassword)

app.get('/', csrfAuthenticate, (req, res) => {
   try {
      res.send(req.csrfToken())
   } catch (error) {
      if (error) throw error
   }
})

//Live our server
app.listen(config.PORT, () => {
   console.log('Server is up!')
})
