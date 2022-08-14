import { JSDOM } from "jsdom"
import * as constants from "./constants"
import { api, cleanText, generateCardIds, objectToGraphqlArgs } from "./util"

export const scrape = async (setId: string, scrapeUrl: string) => {
  console.log(`scraping ${setId} from ${scrapeUrl}`)

  let page = 1

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const tableUrl = `${scrapeUrl}/page/${page}/?st=&manaCost=&format=wild&rarity=&type=&class=&set=&mechanic=&race=&orderby=DESC-date&view=table`
    const pageRequest = await fetch(tableUrl)
    const html = await pageRequest.text()

    if (html.indexOf(`No cards found`) >= 0) {
      break
    }

    const dom = new JSDOM(html)
    const root = dom.window.document
  
    const cardAttributes: string[] = []
    const cardTranslations: string[] = []

    const cardRows = root.querySelectorAll(`tr`)

    if (cardRows.length === 0) {
      break
    }

    for (const row of cardRows) {
      const nameLink = row.querySelector(`a`)
      const cardName = nameLink?.text?.trim()

      if (!cardName) {
        continue
      }

      const [
        nameCol,
        classCol,
        rarityCol,
        typeCol,
        costCol,
        attackCol,
        healthCol,
        durabilityCol,
      ] = Array.from(row.querySelectorAll(`td`))

      const text = cleanText(nameCol.querySelector(`small`)?.innerHTML)      
      const rarity = cleanText(rarityCol?.textContent, {enumize: true})
      const type = cleanText(typeCol?.textContent, {enumize: true})
      const cost = cleanText(costCol?.textContent, {number: true})
      const attack = cleanText(attackCol?.textContent, {number: true})
      const health = cleanText(healthCol?.textContent, {number: true})
      const durability = cleanText(durabilityCol?.textContent, {number: true})

      const imageAttribute = nameLink?.attributes?.getNamedItem(`data-tooltip-img`)
      const image = imageAttribute ? imageAttribute.value : null

      let classes: string[] = []
      const classesText = cleanText(classCol?.textContent)
      if (classesText && typeof classesText === `string`) {
        classes = classesText?.split(/\s*,\s*/).map((c: string) => cleanText(c, {enumize: true}) as string) || []
      }

      const { id, dbfId } = generateCardIds(cardName, setId)

      const attributes = {
        classes,
        rarity,
        type,
        cost,
        attack,
        health,
        durability,
        setId,
        collectible: true,
        id,
        dbfId,
        image,
      }
      
      cardAttributes.push(objectToGraphqlArgs(attributes))

      const translations = {
        cardId: id,
        name: cardName,
        text,
        locale: `enUS`,
      }

      cardTranslations.push(objectToGraphqlArgs(translations))
    }

    const createCards = `
      cards(
        cards: [
          ${cardAttributes.join(`,\n`)}
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

    await api(`
      mutation {
        ${createCards}
        ${createCardTranslations}
      }
    `)
    
    page += 1
    await new Promise(res => setTimeout(res, constants.REQUEST_SLEEP_TIME))
  }
}