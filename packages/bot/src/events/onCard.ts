import { Message } from "discord.js"
import { createCardEmbed } from "../embed"
import { HearthbotClient, objectToGraphqlArgs } from "../api"
import { getDefaultComponents, parseQuery } from "../util"


export const onCard = async (message: Message, cards: string[], hearthbotClient: HearthbotClient) => {
  // TODO make multiple card query endpoint
  const embeds = []

  for (const card of cards) {
    const query = await parseQuery(card)
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
            ${query.fields.locale} {
              name
              text
            }
          }
        }
      }
    `)

    const json = await response.json()
    if (json?.data?.cards?.length) {
      const cardObject = json.data.cards[0]
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