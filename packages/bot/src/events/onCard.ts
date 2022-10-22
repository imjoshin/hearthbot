import { Message } from "discord.js"
import { createCardEmbed } from "../embed"
import { HearthbotClient, objectToGraphqlArgs } from "../api"
import { getDefaultComponents, parseQuery, sortCardsByTerm } from "../util"

const getEmbedForQuery = async (hearthbotClient: HearthbotClient, query: Awaited<ReturnType<typeof parseQuery>>) => {
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
          collectible
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

    return createCardEmbed(cardObject, query.settings)
  }
}

export const onCard = async (
  message: Message, 
  cards: string[], 
  hearthbotClient: HearthbotClient
) => {
  // TODO make multiple card query endpoint
  const embeds = []
  let retried = 0

  for (const card of cards) {
    const query = await parseQuery(card)
    if (!query) {
      continue
    }

    const embed = await getEmbedForQuery(hearthbotClient, query)
    if (embed) {
      embeds.push(embed)
    } else if (query.filters.collectible) {
      // try again without collectible
      query.filters.collectible = false

      const embed = await getEmbedForQuery(hearthbotClient, query)
      if (embed) {
        retried += 1
        embeds.push(embed)
      }
    }
  }

  let content = null
  if (retried) {
    if (embeds.length == 1) {
      content = `I couldn't find the card you requested, but I found a non-collectible one.`
    } else if (embeds.length !== retried) {
      content = `I couldn't find some of the cards you requested, but I found some non-collectible ones.`
    } else {
      content = `I coulnd't find any cards you requested, but I found non-collectible ones.`
    }
  }
  
  if (embeds.length) {
    await message.reply({
      content,
      embeds: embeds, 
      components: getDefaultComponents(),
    })
  }
}