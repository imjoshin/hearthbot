import * as constants from "./constants"
import { getCache, setCache } from "./util"
import { HearthbotClient, objectToGraphqlArgs } from "./api"
import { Logger } from "winston"

export const sync = async (version: string, locale: typeof constants.LOCALES[number], hearthbotClient: HearthbotClient, logger: Logger) => {
  logger.info(`${locale}: ${version} - Fetch`)
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
      logger.warn(`Encountered error fetching ${cardsJsonUrl}:\n${e}`)
      return
    }
  }

  // chunk cards for batch updating
  let remainingCards = cardsJson
  while (remainingCards.length) {
    logger.info(`${locale}: ${version} - ${cardsJson.length - remainingCards.length}/${cardsJson.length}`)
    const chunk = remainingCards.slice(0, 100)
    await syncCards(locale, chunk, hearthbotClient)
    remainingCards = remainingCards.slice(100)
  }
}

const syncCards = async (locale: string, cards: {[key: string]: any}[], hearthbotClient: HearthbotClient) => {
  const shouldCreateCards = locale === `enUS`
  const seenSets = []
  const cardAttributes = []
  const setAttributes = []
  const cardTranslations = []

  for (const card of cards) {
    const translations = {
      cardId: card.id,
      name: card.name,
      text: card.text,
      flavor: card.flavor,
      locale: locale,
    }

    cardTranslations.push(`{ ${objectToGraphqlArgs(translations)} }`)

    let classes: string[] | null = null
    if (card.classes) {
      classes = card.classes
    } else if (card.cardClass) {
      classes = [card.cardClass]
    }

    if (shouldCreateCards) {
      const attributes = {
        attack: card.attack,
        artist: card.artist,
        classes,
        collectible: !!card.collectible,
        cost: card.cost,
        dbfId: card.dbfId,
        flavor: card.flavor,
        id: card.id,
        health: card.health,
        durability: card.durability,
        mechanics: card.mechanics,
        name: card.name,
        rarity: card.rarity,
        tribe: card.race,
        setId: card.set,
        text: card.text,
        type: card.type,
      }

      const set = {
        id: card.set,
      }

      cardAttributes.push(`{ ${objectToGraphqlArgs(attributes)} }`)

      if (seenSets.indexOf(set.id) < 0) {
        setAttributes.push(`{ ${objectToGraphqlArgs(set)} }`)
        seenSets.push(set.id)
      }
    }
  }
  
  try {
    const createCards = `
      cards(
        cards: [
          ${cardAttributes.join(`,\n`)}
        ]
      ) { errors }
    `

    const createSets = `
      cardSets(
        sets: [
          ${setAttributes.join(`,\n`)}
        ]
      ) { errors }
    `

    const createCardTranslations = `
      cardTranslations(
        translations: [
          ${cardTranslations.join(`,\n`)}
        ]
      ) { errors }
    `

    const response = await hearthbotClient.call(`
      mutation {
        ${shouldCreateCards ? createSets : ``}
        ${shouldCreateCards ? createCards : ``}
        ${createCardTranslations}
      }
    `)

    const json = await response.json()
    if (json.errors?.length) {
      console.log(JSON.stringify(json.errors, null, 2))
    }
  } catch (e) {
    console.log(e)
  }

}