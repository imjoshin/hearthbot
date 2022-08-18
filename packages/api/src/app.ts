import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import { graphqlHTTP } from "express-graphql"
import { runUpdates } from "./db/schema/util"
import { createSchema } from "./graphql"
import { getDependencies } from "./dependencies"
import { Database } from "./db/Database"
import { authorization } from "./util/auth"
import { createLogger } from "./logger"

dotenv.config()

const app = async () => {
  const logger = createLogger(`api`)

  logger.info(`test`)

  const port = process.env.PORT || 8080

  const dependencies = getDependencies()

  const database = dependencies.get(Database)
  // TODO starting up with fresh db errors
  await runUpdates(database)

  const app = express()
  app.use(authorization(dependencies))
  app.use(cors({origin: `*`}))
  app.use(express.json())

  app.use(`/`, graphqlHTTP({
    schema: createSchema(dependencies),
    graphiql: true,
  }))
  
  app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })
}

app()