import './database'
import cors from "cors"
import morgan from "morgan"
import helmet from 'helmet'
import express from "express"
import rateLimit from 'express-rate-limit'

import { config } from "./config"

const app = express()

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

//Add 11 layer of security
app.use(helmet())

//Apply the limiter
app.use(limiter)

//Console request action in HTTP
app.use(morgan('dev'))
app.use(express.json())

app.get('/', (req, res) => {
    res.send("Welcome to incu monsters back-end.")
})

//Live our server
app.listen(config.PORT, () => {
    console.log("Server is up!")
})