import { Database } from "./db/Database"
import { CardRepository } from "./repository/CardRepository"
import { CardTranslationRepository } from "./repository/CardTranslationRepository"
import { SetRepository } from "./repository/SetRepository"
import { DependencyTree } from "./util/DependencyTree"

export const getDependencies = () => {
  const dependencies = new DependencyTree()

  const database = new Database(
    process.env.DB_USER,
    process.env.DB_PASS,
    process.env.DB_NAME,
    process.env.DB_HOST,
  )
    
  dependencies.register(Database, database)

  dependencies.register(CardRepository, new CardRepository(
    dependencies.get(Database)
  ))

  dependencies.register(CardTranslationRepository, new CardTranslationRepository(
    dependencies.get(Database)
  ))

  dependencies.register(SetRepository, new SetRepository(
    dependencies.get(Database)
  ))

  return dependencies
}