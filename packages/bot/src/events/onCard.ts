import { Message } from "discord.js"
import { createCardEmbed } from "../embed"
import { HearthbotClient, objectToGraphqlArgs } from "../api"
import { getDefaultComponents, parseQuery, sortCardsByTerm } from "../util"
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
        const sortedCards = sortCardsByTerm(json.data.cards, query.filters.name)
        cardObject = sortedCards[0]
      }

      const embed = createCardEmbed(cardObject, query.settings)
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