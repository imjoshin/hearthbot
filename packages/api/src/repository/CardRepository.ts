import { Card } from "../model/Card"
import { Database } from "../db/Database"
import { RangeInput, rangeQuery } from "../util/query"
import { PRE_RELEASE_SET_PREFIX } from "../constants"

type CardFilter = {
  limit?: number,
  name?: string,
  locale?: string
  collectible?: boolean,
  dbfIds?: number[],
  cost?: RangeInput,
  health?: RangeInput,
  attack?: RangeInput,
  durability?: RangeInput,
  rarity?: string,
  mechanics?: string[],
  set?: string,
  tribe?: string,
  type?: string,
  class?: string,
  school?: string,
}

const cardFilterDefault: CardFilter = {
  limit: 100,
  locale: `enUS`,
}

export class CardRepository {
  public static Name = `CardRepository`
  
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

      // create one-letter typo attempts to grab more cards
      const oneLetterTypoAttempts: string[] = []
      search.split(``).forEach((letter, i) => {
        if (i === 0) {
          return
        }

        const firstPart = search.slice(0, i - 1)
        const lastPart = search.slice(i + 1)
        const typo = firstPart + search[i] + search[i - 1] + lastPart
        oneLetterTypoAttempts.push(typo)
      })

      const searches = [search, ...oneLetterTypoAttempts]
      const searchCondition = searches.map(_ => `search LIKE CONCAT('%', ?, '%')`).join(` OR `)

      // issue query
      const nameDbResult = await this.db.run<{[key: string]: any}>(
        `SELECT * from cardTranslation WHERE locale = ? AND (${searchCondition})`,
        [filter.locale, ...searches]
      )

      // if we found no cards with this name, short circuit and return nothing
      if (!nameDbResult.length) {
        return []
      }

      // create where clause for each card returned here
      const ids = nameDbResult.map(row => row.cardId)
      wheres.push(`id IN (${ids.map(_ => `?`).join(`, `)})`)
      ids.forEach(id => params.push(id))
    }

    // Set filter
    if (filter.set) {
      const set = filter.set.toUpperCase()
      const setDbResult = await this.db.run<{[key: string]: any}>(
        `
        SELECT * from cardSet 
        WHERE UPPER(id) LIKE CONCAT('%', ?, '%')
        OR UPPER(fullName) LIKE CONCAT('%', ?, '%')
        OR UPPER(shortName) LIKE CONCAT('%', ?, '%')
        `,
        [set, set, set]
      )

      if (!setDbResult.length) {
        return []
      }

      const setRow = setDbResult[0]

      wheres.push(`setId = ?`)
      params.push(setRow.id)
    }

    // DBFID filter
    if (filter.dbfIds) {
      wheres.push(`dbfId IN (${filter.dbfIds.map(_ => `?`).join(`, `)})`)
      filter.dbfIds.forEach(dbfId => params.push(dbfId))
    }

    // Collectible filter
    if (filter.collectible === true || filter.collectible === false) {
      wheres.push(`collectible = ?`)
      params.push(filter.collectible)
    }

    // Tribe filter
    if (filter.tribe) {
      wheres.push(`tribe = ?`)
      params.push(filter.tribe.toUpperCase())
    }

    // School filter
    if (filter.school) {
      wheres.push(`school = ?`)
      params.push(filter.school.toUpperCase())
    }

    // Type filter
    if (filter.type) {
      wheres.push(`type = ?`)
      params.push(filter.type.toUpperCase())
    }

    // Rarity filter
    if (filter.rarity) {
      const map: {[key: string]: string} = {
        'c': `common`,
        'r': `rare`,
        'e': `epic`,
        'l': `legendary`,
      }
      wheres.push(`rarity = ?`)
      params.push((map[filter.rarity.toLowerCase()] || filter.rarity).toUpperCase())
    }

    // Class filter
    if (filter.class) {
      wheres.push(`classes LIKE CONCAT('%', ?, '%')`)
      params.push(filter.class.toUpperCase())
    }

    // Mechanics filter
    if (filter.mechanics) {
      for (const mechanic of filter.mechanics) {
        wheres.push(`mechanics LIKE CONCAT('%', ?, '%')`)
        params.push(mechanic.toUpperCase())
      }
    }

    // Cost filter
    if (filter.cost) {
      const range = rangeQuery(`cost`, filter.cost)
      wheres.push(...range.wheres)
      params.push(...range.params)
    }

    // Health filter
    if (filter.health) {
      const range = rangeQuery(`health`, filter.health)
      wheres.push(...range.wheres)
      params.push(...range.params)
    }

    // Attack filter
    if (filter.attack) {
      const range = rangeQuery(`attack`, filter.attack)
      wheres.push(...range.wheres)
      params.push(...range.params)
    }

    // Durability filter
    if (filter.durability) {
      const range = rangeQuery(`durability`, filter.durability)
      wheres.push(...range.wheres)
      params.push(...range.params)
    }

    // Filter out any pre-release sets that have released
    const preSetDbResult = await this.db.run<{[key: string]: any}>(
      `
      SELECT * from cardSet 
      WHERE id LIKE "${PRE_RELEASE_SET_PREFIX}-%"
      AND releaseDate < CURDATE()
      `,
    )

    for (const preSetRow of preSetDbResult) {
      wheres.push(`setId != ?`)
      params.push(preSetRow.id)
    }

    // Run query 
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
        classes,
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
        image,
        school,
      } = row

      return new Card({
        id,
        artist,
        attack,
        classes: classes ? classes.split(`,`) : null,
        collectible,
        cost,
        dbfId,
        health,
        rarity,
        setId,
        type,
        tribe,
        durability, 
        mechanics: mechanics ? mechanics.split(`,`) : null,
        image,
        school,
      })
    })
  }

  public upsertCard = async (card: Card) => {
    const params = [
      card.artist, 
      card.attack, 
      card.classes ? card.classes.join(`,`) : null, 
      card.collectible, 
      card.cost, 
      card.dbfId, 
      card.health, 
      card.rarity, 
      card.setId, 
      card.type, 
      card.tribe, 
      card.durability, 
      card.mechanics ? card.mechanics.join(`,`) : null, 
      card.image,
      card.school,
    ]
    const query = `
    INSERT INTO card (
      id, 
      artist, 
      attack, 
      classes,
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
      image,
      school
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    artist = ?,
    attack = ?,
    classes = ?,
    collectible = ?,
    cost = ?,
    dbfId = ?,
    health = ?,
    rarity = ?,
    setId = ?,
    type = ?,
    tribe = ?,
    durability = ?,
    mechanics = ?,
    image = ?,
    school = ?
    `
    await this.db.run(query, [
      card.id, ...params, ...params
    ])
  }
}