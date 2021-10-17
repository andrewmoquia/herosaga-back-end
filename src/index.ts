import './database'
import cors from "cors"
import morgan from "morgan"
import helmet from 'helmet'
import express from "express"
import rateLimit from 'express-rate-limit'
import cookieParser from 'cookie-parser'
import { config } from "./config"
import csrfTestRoute from './csrfTokenTest'
import signupRoute from './routes/registerRoutes' 
import session from 'express-session'
import passport from 'passport'
import User from './user'
import loginRoute from './routes/loginRoute'
import createMemoryStore from 'memorystore'
import { IMongoUser } from './interfaces'

const app = express()

const MemoryStore = createMemoryStore(session)


//Add limit to all request base on this condition
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 200 // limit each IP to 200 requests per windowMs
})

// Allow test in localhost:3000
app.set('trust proxy', 1)

//Site that allow to make request in API
app.use(cors({
    origin: 'http:localhost:4000', 
    credentials: true
}))

// We need this because "cookie" is true in csrfProtection.
app.use(cookieParser('random'))

app.use(session({
    secret: 'random', 
    resave: true,
    saveUninitialized: false,
    store: new MemoryStore({
        checkPeriod: 86400000 //Prune expired entries every 24h
    }),
    cookie: {
        maxAge: 60* 100,
        sameSite: 'strict',
        secure: true,
    }
}))

//Add 11 layer of security
app.use(helmet())

//Apply the limiter
app.use(limiter)

//Console request action in HTTP
app.use(morgan('dev'))
app.use(express.json())

//Start passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Taking user data from authentication and store it in session cookie
passport.serializeUser((user: IMongoUser, done) => {
    return done(null, user._id)
})

//Take user data and attaching it to req.user
passport.deserializeUser((id, done) => {
    User.findById(id, (err: Error, user: IMongoUser) => {
        const userData = {
            id: user._id,
            username: user.username,
            email: user.email,
            isVerified: user.isVerified,
            googleId: user.googleId,
            provider: user.provider,
        }
        if(err) throw err
        return done(err, userData)
    })
})

//Handle routes.
app.use(csrfTestRoute)
app.use(signupRoute)
app.use(loginRoute)

app.get('/', (req, res) => {
    res.send("Welcome!")
})

//Live our server
app.listen(config.PORT, () => {
    console.log("Server is up!")
})