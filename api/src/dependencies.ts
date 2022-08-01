import path from "path"
import { LocalDatabase } from "./db/LocalDatabase"
import { RemoteDatabase } from "./db/RemoteDatabase"
import { Database } from "./db/IDatabase"
import { CardRepository } from "./repository/CardRepository"
import { SetRepository } from "./repository/SetRepository"
import { DependencyTree } from "./util/DependencyTree"

export const getDependencies = () => {
  const dependencies = new DependencyTree()

  const database = process.env.NODE_ENV === `development`
    ? new LocalDatabase(path.join(__dirname, `..`, `..`, `local.db`))
    : new RemoteDatabase(
      process.env.DB_USER,
      process.env.DB_PASS,
      process.env.DB_NAME,
      `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
    )
    
  dependencies.register(Database, database)

  dependencies.register(CardRepository, new CardRepository(
    dependencies.get(Database)
  ))

  dependencies.register(SetRepository, new SetRepository(
    dependencies.get(Database)
  ))

  return dependencies
}