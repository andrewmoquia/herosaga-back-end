import cors from "cors"
import morgan from "morgan"
import express from "express"
import { config } from "./config"


const app = express()

// Allow test in localhost:3000
app.set('trust proxy', 1)

//Site that allow to make request in API
app.use(cors({
    origin: 'http:localhost:4000', 
    credentials: true
}))

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