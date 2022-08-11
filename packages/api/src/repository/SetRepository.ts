import { Set, SetConstructor } from "../model/Set"
import { Database } from "../db/Database"

export class SetRepository {
  constructor(private db: Database) {}

  public createSet = async (set: Set) => {
    await this.db.run<{[key: string]: any}>(
      `INSERT INTO cardSet (id, fullName, shortName, releaseDate) VALUES (?, ?, ?, ?)`,
      [set.id, set.fullName, set.shortName, set.releaseDate]
    )
  }

  public getSets = async (): Promise<Set[]> => {
    const dbResult = await this.db.run<SetConstructor>(`SELECT * FROM cardSet`)

    return dbResult.map(row => new Set(row))
  }

  public getSet = async (id: string): Promise<Set> => {
    const dbResult = await this.db.run<SetConstructor>(`SELECT * FROM cardSet WHERE id = ?`, [id])

    if (!dbResult) {
      return null
    }

    return new Set(dbResult[0])
  }
}