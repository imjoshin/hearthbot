import { Card } from "../model/Card"
import { Database } from "../db/Database"

export class CardRepository {
  constructor(private db: Database) {}

  public getCards = async (): Promise<Card[]> => {
    const dbResult = await this.db.run<{[key: string]: any}>(`SELECT * FROM card`)

    return dbResult.map(row => new Card(
      row.id,
      row.artist,
      row.attack,
      row.collectible,
      row.cost,
      row.dbfId,
      row.flavor,
      row.health,
      row.name,
      row.rarity,
      row.setId,
      row.text,
      row.type,
      row.tribes,
    ))
  }
}