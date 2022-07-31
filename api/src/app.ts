import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import { graphqlHTTP } from "express-graphql"
import path from "path"
import { LocalDatabase } from "./db/LocalDatabase"
import { RemoteDatabase } from "./db/RemoteDatabase"
import { runUpdates } from "./db/schema/util"
import { createSchema } from "./graphql"

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


  
  app.use(`/`, graphqlHTTP({
    schema: createSchema(db),
    graphiql: true,
  }))
  
  const port = process.env.PORT || 8080
  app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })
}

app()