import * as constants from "./constants"
import { getCache, setCache, api, objectToGraphqlArgs } from "./util"

export const sync = async (version: string, locale: typeof constants.LANGUAGES[number]) => {
  console.log(`Syncing ${locale}: ${version}`)
  const cacheKey = `cards-${version}-${locale}`
  let cardsJson = getCache(cacheKey)

  // fetch card json if we don't have it cached
  if (!cardsJson) {
    const cardsJsonUrl = `${constants.HEARTHSTONE_JSON_URL}/${version}/${locale}/cards.json`
    try {
      const req = await fetch(cardsJsonUrl)
      cardsJson = await req.json()
      setCache(cacheKey, cardsJson)
    } catch (e) {
      console.log(`Encountered error fetching ${cardsJsonUrl}:\n${e}`)
      return
    }
  }

  // chunk cards for batch updating
  let remainingCards = cardsJson
  while (remainingCards.length) {
    const chunk = remainingCards.slice(0, 100)
    await syncCards(locale, chunk)
    remainingCards = remainingCards.slice(100)
  }
}

const syncCards = async (locale: string, cards: {[key: string]: any}[]) => {
  const shouldCreateCards = locale === `enUS`
  const cardAttributes = []
  const cardTranslations = []

  for (const card of cards) {
    const translations = {
      cardId: card.id,
      name: card.name,
      text: card.text,
      flavor: card.flavor,
      locale: locale,
    }

    cardTranslations.push(objectToGraphqlArgs(translations))

    if (shouldCreateCards) {
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

      cardAttributes.push(objectToGraphqlArgs(attributes))
    }
  }
  
  try {
    const createCards = `
      createCards(
        cards: [
          ${cardAttributes.join(`,\n`)}
        ]
      ) { success }
    `

    const createCardTranslations = `
      createCardTranslations(
        translations: [
          ${cardTranslations.join(`,\n`)}
        ]
      ) { success }
    `

    const response = await api(`
      mutation {
        ${shouldCreateCards ? createCards : ``}
        ${createCardTranslations}
      }
    `)

    // const json = await response.json()
    // console.log(JSON.stringify(json, null, 2))
  } catch (e) {
    console.log(e)
  }

}