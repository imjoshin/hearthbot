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
    if (set.releaseDate) {
      updateKeys.push(`scrapeUrl`)
      updateValues.push(set.scrapeUrl)
    }

    let query = `INSERT INTO cardSet (id, fullName, shortName, releaseDate) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE `

    if (updateKeys.length) {
      query += updateKeys.map(key => `${key} = ?`).join(`,`)
    } else {
      query += `fullName = fullName`
    }

    await this.db.run<{[key: string]: any}>(
      query,
      [set.id, set.fullName, set.shortName, set.releaseDate, ...updateValues]
    )
  }

  public getCardSets = async (): Promise<CardSet[]> => {
    const dbResult = await this.db.run<CardSetConstructor>(`SELECT * FROM cardSet`)

    return dbResult.map(row => new CardSet(row))
  }

  public getCardSet = async (id: string): Promise<CardSet> => {
    const dbResult = await this.db.run<CardSetConstructor>(`SELECT * FROM cardSet WHERE id = ?`, [id])

    if (!dbResult) {
      return null
    }

    return new CardSet(dbResult[0])
  }
}