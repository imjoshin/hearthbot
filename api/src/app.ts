import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import mysql from "mysql"
import sqlite3 from "sqlite3"
import { graphqlHTTP } from "express-graphql"
import * as graphql from "graphql"
import fs from "fs"
import path from "path"

dotenv.config()


const db = new sqlite3.Database(`dev.db`)
db.serialize(async () => {
  const sqlDir = path.join(__dirname, `..`, `..`, `db`)
  const sqlFiles = fs.readdirSync(sqlDir)
    .filter(
      f => fs.lstatSync(path.join(sqlDir, f)).isFile() && f.endsWith(`.js`)
    )
    .map(
      f => parseInt(f.slice(0, -3))
    )
    .sort()
    .map(
      f => path.join(sqlDir, f.toString()) + `.js`
    )

  for (const sqlFile of sqlFiles) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const sql = require(sqlFile)
    sql.run(db)
  } 
})

// const pool = mysql.createPool({
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
//   socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
// })

const app = express()

app.use(cors())
app.use(express.json())

// app.get(`/`, (req, res) => {
//   res.status(200).send(`hello world`)
// })

// app.get(`/test/:id`, (req, res) => {
//   const query = `SELECT * FROM test WHERE id = ?`
//   pool.query(query, [ req.params.id ], (error, results) => {
//     console.log(error)
//     if (!results[0]) {
//       res.json({ status: `Not found!` })
//     } else {
//       res.json(results[0])
//     }
//   })
// })

const QueryRoot = new graphql.GraphQLObjectType({
  name: `Query`,
  fields: () => ({
    hello: {
      type: graphql.GraphQLString,
      resolve: () => `Hello world!`
    }
  })
})
    
const schema = new graphql.GraphQLSchema({ query: QueryRoot })

app.use(`/`, graphqlHTTP({
  schema: schema,
  graphiql: true,
}))

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})