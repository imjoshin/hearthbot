import * as constants from "./constants"
import { getCache, setCache } from "./util"

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

  for (const card of cardsJson) {
    const attributes = {
      attack: card.attack,
      artist: card.artist,
      class: card.cardClass,
      collectible: !!card.collectible,
      cost: card.cost,
      bdfId: card.bdfId,
      flavor: card.flavor,
      id: card.id,
      health: card.health,
      name: card.name,
      rarity: card.rarity,
      set: card.set,
      text: card.text,
      type: card.type,
      image: `https://art.hearthstonejson.com/v1/render/latest/${language}/512x/${card.id}.png`,
      tile: `https://art.hearthstonejson.com/v1/tiles/${card.id}.jpg`
    }

    // TODO ship attributes off to API to process
  }
}