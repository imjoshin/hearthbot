import { getDefaultComponents, ReactionService } from "../util"
import { HearthbotClient } from "../api"
import { createCardEmbed } from "../embed"
import { Client, Message, PartialMessage } from "discord.js"

export const onCardSearchReaction = async (client: Client, message: Message | PartialMessage, authorId: string, number: number, hearthbotClient: HearthbotClient, reactionService: ReactionService) => {
  const reactionGroup = reactionService.get(message.id)
  if (reactionGroup.authorId !== authorId) {
    // only let the original author trigger this
    return
  }

  if (!(number in reactionGroup.reactionMap)) {
    // can't find it, so just return
    return
  }

  const dbfId = reactionGroup.reactionMap[number]

  reactionService.delete(message.id, number)

  // grab card data from API
  const response = await hearthbotClient.call(`
      query {
        cards(
          dbfIds: [${dbfId}]
        ) {
          id
          dbfId
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
          strings {
            enUS {
              name
              text
            }
          }
        }
      }
    `)

  // send embed if we have the card
  const json = await response.json()
  if (json?.data?.cards?.length) {
    const cardObject = json.data.cards[0]
    const embed = createCardEmbed(cardObject)

    await message.reply({
      content: `<@${authorId}>`,
      embeds: [embed], 
      components: getDefaultComponents(),
    })
  }
}