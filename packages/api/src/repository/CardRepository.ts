import { Card } from "../model/Card"
import { Database } from "../db/Database"
import { getMissingObjectProperties } from "../util/validation"
import { ValidationError } from "../util/Errors"

export class CardRepository {
  constructor(private db: Database) {}

  public getCards = async (): Promise<Card[]> => {
    const dbResult = await this.db.run<{[key: string]: any}>(`SELECT * FROM card`)

    return dbResult.map(row => {
      const {
        id,
        artist,
        attack,
        collectible,
        cost,
        dbfId,
        health,
        rarity,
        setId,
        type,
        tribe,
        durability, 
        mechanics, 
      } = row

      return new Card({
        id,
        artist,
        attack,
        collectible,
        cost,
        dbfId,
        health,
        rarity,
        setId,
        type,
        tribe,
        durability, 
        mechanics,
      })
    })
  }

  public upsertCard = async (card: Card) => {
    const params = [card.artist, card.attack, card.collectible, card.cost, card.dbfId, card.health, card.rarity, card.setId, card.type, card.durability, card.mechanics]
    const query = `
    INSERT INTO card (
      id, 
      artist, 
      attack, 
      collectible, 
      cost, 
      dbfId, 
      health, 
      rarity, 
      setId, 
      type, 
      durability, 
      mechanics
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    artist = ?,
    attack = ?,
    collectible = ?,
    cost = ?,
    dbfId = ?,
    health = ?,
    rarity = ?,
    setId = ?,
    type = ?,
    durability = ?,
    mechanics = ?
    `
    await this.db.run(query, [
      card.id, ...params, ...params
    ])
  }
}