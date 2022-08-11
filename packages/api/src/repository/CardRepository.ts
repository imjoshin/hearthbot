import { Card } from "../model/Card"
import { Database } from "../db/Database"

type RangeInput = {
  eq?: number,
  lt?: number,
  gt?: number,
}

type CardFilter = {
  limit?: number,
  name?: string,
  locale?: string
  collectible?: boolean,
  dbfIds?: number[],
  cost?: RangeInput
}

const cardFilterDefault: CardFilter = {
  limit: 100,
  locale: `enUS`,
}

export class CardRepository {
  constructor(private db: Database) {}

  public getCards = async (cardFilter?: CardFilter): Promise<Card[]> => {
    const filter: CardFilter = Object.assign({}, cardFilterDefault)

    if (cardFilter) {
      for (const [key, value] of Object.entries(cardFilter)) {
        if (value !== undefined && value !== null) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          filter[key] = value
        }
      }
    }

    const params: (string | boolean | number)[] = []
    const wheres: string[] = []

    // Name filter
    if (filter.name) {
      // Short circuit for name to avoid a join
      const search = filter.name.replace(/[^\w]/g, ``).toLowerCase()

      // TODO use a levenshtein-type search
      const nameDbResult = await this.db.run<{[key: string]: any}>(
        `SELECT * from cardTranslation WHERE locale = ? AND search LIKE CONCAT('%', ?, '%')`,
        [filter.locale, search]
      )

      if (!nameDbResult.length) {
        return []
      }

      const ids = nameDbResult.map(row => row.cardId)
      wheres.push(`id IN (${ids.map(_ => `?`).join(`, `)})`)
      ids.forEach(id => params.push(id))
    }

    if (filter.dbfIds) {
      wheres.push(`dbfId IN (${filter.dbfIds.map(_ => `?`).join(`, `)})`)
      filter.dbfIds.forEach(dbfId => params.push(dbfId))
    }

    // Collectible filter
    if (filter.collectible === true || filter.collectible === false) {
      wheres.push(`collectible = ?`)
      params.push(filter.collectible)
    }

    // Cost filter
    if (filter.cost) {
      if (filter.cost.eq) {
        wheres.push(`cost = ?`)
        params.push(filter.cost.eq)
      }

      if (filter.cost.gt) {
        wheres.push(`cost > ?`)
        params.push(filter.cost.gt)
      }

      if (filter.cost.lt) {
        wheres.push(`cost < ?`)
        params.push(filter.cost.lt)
      }
    }

    const query = `
    SELECT * FROM card 
    ${wheres.length ? ` WHERE ` : ``}${wheres.join(` AND `)} 
    LIMIT ${filter.limit}
    `

    const dbResult = await this.db.run<{[key: string]: any}>(query, params)

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