import './database'
import cors from "cors"
import morgan from "morgan"
import helmet from 'helmet'
import express from "express"
import cookieParser from 'cookie-parser'
import { config } from "./config"
import signupRoute from './routes/registerRoutes' 
import passport from 'passport'
import loginRoute from './routes/loginRoute'
import { limiter } from './limiter'
import {authenticateJWT} from './passportSetup'
import {csrfAuthenticate, parseForm} from './csrfToken'

const app = express()


// Allow test in localhost:3000
app.set('trust proxy', 1)

//Site that allow to make request in API
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true
}))

// We need this because "cookie" is true in csrfProtection.
app.use(cookieParser())

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

app.get('/', csrfAuthenticate, (req, res) => {
    try {
         res.send(req.csrfToken())
    } catch (error) {
        if(error) throw error
    }
})

app.get('/protected', authenticateJWT, (req, res) => {
    try {
        res.status(200).send({message: 'Successfully get into protected route.'})
    } catch (error) {
        if(error) throw error
    }
   
})

//Live our server
app.listen(config.PORT, () => {
    console.log("Server is up!")
})