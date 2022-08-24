import { Message } from "discord.js"
import { createCardEmbed, createCardSearchEmbed } from "../embed"
import { HearthbotClient, objectToGraphqlArgs } from "../api"
import { Database } from "sqlite3"
import { getDefaultComponents, parseQuery } from "../util"


export const onCardSearch = async (message: Message, cards: string[], hearthbotClient: HearthbotClient, db: Database) => {
  // TODO make multiple card query endpoint
  const embeds = []
  let replyReactions: string[] = []

  for (const card of cards) {
    const query = await parseQuery(card)
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
        const cardsToDisplay = json.data.cards.slice(0, 9)

        const stmt = db.prepare(`INSERT INTO searchResults (authorId, messageId, number, dbfId) VALUES (?, ?, ?, ?)`)
        cardsToDisplay.forEach((card: any, i: number) => {
          stmt.run(message.author.id, message.id, i + 1, card.dbfId)
        })
        stmt.finalize()

        const {embed, reactions} = createCardSearchEmbed(cardsToDisplay, json.data.cards.length)
        embeds.push(embed)
        replyReactions = reactions.concat(reactions)
      }
    }
  }
  
  if (embeds.length) {
    const reply = await message.reply({
      embeds: embeds, 
      components: getDefaultComponents(),
    })

    for (const reaction of replyReactions) {
      await reply.react(reaction)
    }
  }
}