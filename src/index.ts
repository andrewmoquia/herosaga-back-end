import express from "express";

const app = express();

app.get('/', (req, res) => {
    res.send("Welcome to incu monsters back-end.");
})

app.listen(3000, () => {
    console.log("Server is up!");
})