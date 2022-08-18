import dotenv from "dotenv"
import { HearthbotClient } from "./api"
import * as constants from "./constants"
import { createLogger } from "./logger"
import { scrape } from "./scrape"

dotenv.config()

const run = async() => {
  const hearthbotClient = new HearthbotClient()
  const logger = createLogger(`scrape`)

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const response = await hearthbotClient.call(`
      query {
        cardSets(hasScrapeUrl: true, released: false, prerelease: true) {
          id,
          scrapeUrl,
        }
      }
    `)

    const json = await response.json()
    if (json.data?.cardSets?.length) {
      for (const cardSet of json.data.cardSets) {
        await scrape(cardSet.id, cardSet.scrapeUrl, hearthbotClient, logger)
        await new Promise(res => setTimeout(res, constants.REQUEST_SLEEP_TIME))
      }
    }

    // sleep until we're ready to try again
    await new Promise(res => setTimeout(res, constants.ITERATION_SLEEP_TIME))
  }
}

run()
