import express from "express"
import { config } from "./config"
import morgan from "morgan";

const app = express()

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