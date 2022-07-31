import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import { graphqlHTTP } from "express-graphql"
import * as graphql from "graphql"
import path from "path"
import { LocalDatabase } from "./db/LocalDatabase"
import { RemoteDatabase } from "./db/RemoteDatabase"
import { runUpdates } from "./db/schema/util"

dotenv.config()

const app = async () => {
  const db = process.env.NODE_ENV === `development`
    ? new LocalDatabase(path.join(__dirname, `..`, `..`, `local.db`))
    : new RemoteDatabase(
      process.env.DB_USER,
      process.env.DB_PASS,
      process.env.DB_NAME,
      `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
    )

  // TODO starting up with fresh db errors
  await runUpdates(db)

  
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
        resolve: () => db.run(``)
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
}

app()