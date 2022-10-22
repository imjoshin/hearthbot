import { Message } from "discord.js"
import { createCardEmbed, createCardSearchEmbed } from "../embed"
import { HearthbotClient, objectToGraphqlArgs } from "../api"
import { getDefaultComponents, parseQuery, ReactionService, sortCardsByTerm } from "../util"


export const onCardSearch = async (message: Message, cards: string[], hearthbotClient: HearthbotClient, reactionService: ReactionService) => {
  // TODO make multiple card query endpoint
  const embeds = []

  for (const card of cards) {
    const query = await parseQuery(card)
    if (!query) {
      continue
    }
    
    const response = await hearthbotClient.call(`
      query {
        cards(
          ${objectToGraphqlArgs(query.filters)}
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
      if (json.data.cards.length === 1) {
        const cardObject = json.data.cards[0]
        const embed = createCardEmbed(cardObject)
        embeds.push(embed)
      } else {
        const cards = query.filters.name 
          ? sortCardsByTerm(json.data.cards, query.filters.name)
          : json.data.cards

        const cardsToDisplay = cards.slice(0, 9)
        const { embed, reactions } = createCardSearchEmbed(cardsToDisplay, cards.length)

        // just send reply right away since multiple searches need separate messages
        const reply = await message.reply({
          embeds: [embed],
          components: getDefaultComponents(),
        })

        // this isn't great, but delete old entries about one in 5 times we trigger this
        if (Math.floor(Math.random() * 5) === 0) {
          reactionService.clearLegacyReactionGroups()
        }
        
        // add search results to reactions, tied to the reply
        const reactionMap: {[key: number]: number} = {}
        cardsToDisplay.forEach((card: any, i: number) => {
          reactionMap[i] = card.dbfId
        })

        reactionService.set({
          messageId: reply.id,
          authorId: message.author.id,
          reactionMap
        })

        // add default reactions to the reply
        for (const reaction of reactions) {
          await reply.react(reaction)
        }
      }
    }
  }
  
  if (embeds.length) {
    await message.reply({
      embeds: embeds, 
      components: getDefaultComponents(),
    })
  }
}