import express from "express"
import cors from "cors"

const config = {
    name: `sample-express-app`,
    port: 3000,
    host: `0.0.0.0`,
}

const app = express()

app.use(cors())

app.get(`/`, (req, res) => {
    res.status(200).send(`hello world`)
})

app.listen(config.port, config.host)