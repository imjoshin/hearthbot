import { JSDOM } from "jsdom"
import * as constants from "./constants"

export const scrape = async (id: string, scrapeUrl: string) => {
  console.log(`scraping ${id} from ${scrapeUrl}`)

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
      const cardName = nameLink?.text
      console.log({cardName})
    }
    
    page += 1
    await new Promise(res => setTimeout(res, constants.REQUEST_SLEEP_TIME))
  }
}