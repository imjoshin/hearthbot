import { CardSet, CardSetConstructor } from "../model/CardSet"
import { Database } from "../db/Database"

export class CardSetRepository {
  constructor(private db: Database) {}

  public createSet = async (set: CardSet) => {
    await this.db.run<{[key: string]: any}>(
      `INSERT INTO cardSet (id, fullName, shortName, releaseDate) VALUES (?, ?, ?, ?)`,
      [set.id, set.fullName, set.shortName, set.releaseDate]
    )
  }

  public getSets = async (): Promise<CardSet[]> => {
    const dbResult = await this.db.run<CardSetConstructor>(`SELECT * FROM cardSet`)

    return dbResult.map(row => new CardSet(row))
  }

  public getSet = async (id: string): Promise<CardSet> => {
    const dbResult = await this.db.run<CardSetConstructor>(`SELECT * FROM cardSet WHERE id = ?`, [id])

    if (!dbResult) {
      return null
    }

    return new CardSet(dbResult[0])
  }
}