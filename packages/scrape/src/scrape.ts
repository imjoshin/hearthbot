import { JSDOM } from "jsdom"
import * as constants from "./constants"
import { cleanText, generateCardIds } from "./util"

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
  
    const cardRows = root.querySelectorAll(`tr`)
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

      const text = cleanText(nameCol.querySelector(`small`)?.textContent)
      const rarity = cleanText(rarityCol?.textContent, {enumize: true})
      const type = cleanText(typeCol?.textContent, {enumize: true})
      const cost = cleanText(costCol?.textContent, {number: true})
      const attack = cleanText(attackCol?.textContent, {number: true})
      const health = cleanText(healthCol?.textContent, {number: true})
      const durability = cleanText(durabilityCol?.textContent, {number: true})

      let classes: string[] = []
      const classesText = cleanText(classCol?.textContent)
      if (classesText && typeof classesText === `string`) {
        classes = classesText?.split(/\s*,\s*/).map((c: string) => cleanText(c, {enumize: true}) as string) || []
      }

      const attributes = {
        name: cardName,
        text,
        classes,
        rarity,
        type,
        cost,
        attack,
        health,
        durability,
        setId,
        collectible: true,
        ...generateCardIds(cardName, setId)
      }
      
      console.log(attributes)
    }

    
    page += 1
    await new Promise(res => setTimeout(res, constants.REQUEST_SLEEP_TIME))
  }
}