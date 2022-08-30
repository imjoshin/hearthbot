import { Message } from "discord.js"
import { createCardEmbed } from "../embed"
import { HearthbotClient, objectToGraphqlArgs } from "../api"
import { getDefaultComponents, parseQuery } from "../util"
import levenshtein from "js-levenshtein"


export const onCard = async (message: Message, cards: string[], hearthbotClient: HearthbotClient) => {
  // TODO make multiple card query endpoint
  const embeds = []

  for (const card of cards) {
    const query = await parseQuery(card)
    if (!query) {
      continue
    }

    const strings = [`
      ${query.fields.locale} {
        name
        text
      }
    `]

    if (query.fields.locale !== `enUS`) {
      strings.push(`
        enUS {
          name
          text
        }
      `)
    }

    const response = await hearthbotClient.call(`
      query {
        cards(
          ${objectToGraphqlArgs(query.filters)}
        ) {
          id
          attack
          classes
          cost
          durability
          image
          health,
          mechanics
          rarity
          set {
            id
            fullName
            shortName
          }
          type
          tribe
          school
          strings {
            ${strings.join(`\n`)}
          }
        }
      }
    `)

    const json = await response.json()
    if (json?.data?.cards?.length) {
      let cardObject = json.data.cards[0]
      if (query.filters.name) {
        const searchName = query.filters.name.replace(/[^\w]/g, ``).toLowerCase()

        let lowestDistance = 99999
        for (const card of json.data.cards) {
          // grab enUS name and find levenshtein distance
          const cardName = card.strings.enUS.name.replace(/[^\w]/g, ``).toLowerCase()
          const distance = levenshtein(searchName, cardName)

          // if it's lower than what we've seen, set this as the active card
          if (distance < lowestDistance) {
            lowestDistance = distance
            cardObject = card
          }
        }
      }

      const embed = createCardEmbed(cardObject)
      embeds.push(embed)
    }
  }
  
  if (embeds.length) {
    await message.reply({
      embeds: embeds, 
      components: getDefaultComponents(),
    })
  }
}