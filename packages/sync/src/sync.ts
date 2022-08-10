import * as constants from "./constants"
import { getCache, setCache, api } from "./util"

export const sync = async (version: string, language: typeof constants.LANGUAGES[number]) => {
  console.log(`Syncing ${language}: ${version}`)
  const cacheKey = `cards-${version}-${language}`
  let cardsJson = getCache(cacheKey)

  // fetch card json if we don't have it cached
  if (!cardsJson) {
    const cardsJsonUrl = `${constants.HEARTHSTONE_JSON_URL}/${version}/${language}/cards.json`
    try {
      const req = await fetch(cardsJsonUrl)
      cardsJson = await req.json()
      setCache(cacheKey, cardsJson)
    } catch (e) {
      console.log(`Encountered error fetching ${cardsJsonUrl}:\n${e}`)
      return
    }
  }

  // TODO chunk this up and use createCards
  for (const card of cardsJson.slice(10000, 11000)) {
    await syncCards(language, [card])
  }
}

const syncCards = async (language: string, cards: {[key: string]: any}[]) => {
  for (const card of cards) {
    const attributes = {
      attack: card.attack,
      artist: card.artist,
      // class: card.cardClass,
      collectible: !!card.collectible,
      cost: card.cost,
      dbfId: card.dbfId,
      flavor: card.flavor,
      id: card.id,
      health: card.health,
      durability: card.durability,
      mechanics: card.mechanics ? card.mechanics.join(`,`) : ``,
      name: card.name,
      rarity: card.rarity,
      tribe: card.race,
      setId: card.set,
      text: card.text,
      type: card.type,
    }
  
    const graphqlFields: string[] = []
    
    for (const key of Object.keys(attributes)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const value = attributes[key]
  
      if (value !== undefined && value !== null) {
        graphqlFields.push(`${key}: ${JSON.stringify(value)}`)
      }
    }
  
    try {
      console.log(`
      mutation {
        createCards(
          cards: {
            ${graphqlFields.join(`\n${` `.repeat(12)}`)}
          }
        ) { id }
      }
    `)
      const response = await api(`
        mutation {
          createCards(
            cards: {
              ${graphqlFields.join(`\n${` `.repeat(12)}`)}
            }
          ) { errors }
        }
      `)
  
      const json = await response.json()
      console.log(JSON.stringify(json, null, 2))
    } catch (e) {
      console.log(e)
    }
  }

}