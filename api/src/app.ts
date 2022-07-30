import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import mysql from "mysql"

dotenv.config()

const pool = mysql.createPool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
})

const app = express()

app.use(cors())
app.use(express.json())

app.get(`/`, (req, res) => {
  res.status(200).send(`hello world`)
})

app.get(`/test/:id`, (req, res) => {
  const query = `SELECT * FROM test WHERE id = ?`
  pool.query(query, [ req.params.id ], (error, results) => {
    console.log(error)
    if (!results[0]) {
      res.json({ status: `Not found!` })
    } else {
      res.json(results[0])
    }
  })
})

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})