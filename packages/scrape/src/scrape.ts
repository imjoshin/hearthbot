import { JSDOM } from "jsdom"

export const scrape = async (id: string, scrapeUrl: string) => {
  console.log(`scraping ${id} from ${scrapeUrl}`)
  
  const tableUrl = `${scrapeUrl}/?st=&manaCost=&format=wild&rarity=&type=&class=&set=&mechanic=&race=&orderby=DESC-date&view=table`
  const pageRequest = await fetch(tableUrl)
  const html = await pageRequest.text()
  const dom = new JSDOM(html)
  const root = dom.window.document

  const cardRows = root.querySelectorAll(`tr`)
  for (const row of cardRows) {
    const nameLink = row.querySelector(`a`)
    const cardName = nameLink?.text
    console.log({cardName})
  }
}