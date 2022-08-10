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
  let remainingCards = cardsJson.slice(10000, 10950)
  while (remainingCards.length) {
    const chunk = remainingCards.slice(0, 100)
    console.log(`Syncing ${chunk.length}`)
    await syncCards(chunk)
    remainingCards = remainingCards.slice(100)
  }
}

const syncCards = async (cards: {[key: string]: any}[]) => {
  const cardAttributes = []
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

    cardAttributes.push(`{${graphqlFields.join(`, `)}}`)
  }
  
  try {
    const response = await api(`
      mutation {
        createCards(
          cards: [
            ${cardAttributes.join(`\n`)}
          ]
        ) { errors }
      }
    `)

    const json = await response.json()
    const {errors} = json.data.createCards
    if (errors) {
      console.log(errors)
    }
  } catch (e) {
    console.log(e)
  }

}