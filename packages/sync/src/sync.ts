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
  for (const card of cardsJson) {
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
      name: card.name,
      rarity: card.rarity,
      // set: card.set,
      text: card.text,
      // type: card.type,
      // image: `https://art.hearthstonejson.com/v1/render/latest/${language}/512x/${card.id}.png`,
      // tile: `https://art.hearthstonejson.com/v1/tiles/${card.id}.jpg`
    }

    const graphqlFields: string[] = []
    
    for (const key of Object.keys(attributes)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const value = attributes[key]

      if (value !== undefined && value !== null) {
        const stringifyValue = key === `dbfId` ? value.toString() : value
        graphqlFields.push(`${key}: ${JSON.stringify(stringifyValue)}`)
      }
    }

    try {
      const response = await api(`
      mutation {
        createCard(
          card: {
            ${graphqlFields.join(`\n${` `.repeat(12)}`)}
          }
        ) { id }
      }
    `)

      const json = await response.json()
    } catch (e) {
      console.log(e)
    }
  }
}