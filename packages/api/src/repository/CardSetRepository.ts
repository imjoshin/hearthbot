import { CardSet, CardSetConstructor } from "../model/CardSet"
import { Database } from "../db/Database"

export class CardSetRepository {
  constructor(private db: Database) {}

  public upsertCardSet = async (set: CardSet) => {
    const updateKeys = []
    const updateValues = []
    if (set.fullName) {
      updateKeys.push(`fullName`)
      updateValues.push(set.fullName)
    }
    if (set.shortName) {
      updateKeys.push(`shortName`)
      updateValues.push(set.shortName)
    }
    if (set.releaseDate) {
      updateKeys.push(`releaseDate`)
      updateValues.push(set.releaseDate)
    }

    let query = `INSERT INTO cardSet (id, fullName, shortName, releaseDate) VALUES (?, ?, ?, ?)`

    if (updateKeys.length) {
      query += ` ON DUPLICATE KEY UPDATE `
      query += updateKeys.map(key => `${key} = ?`).join(`,`)
    }

    await this.db.run<{[key: string]: any}>(
      query,
      [set.id, set.fullName, set.shortName, set.releaseDate, ...updateValues]
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