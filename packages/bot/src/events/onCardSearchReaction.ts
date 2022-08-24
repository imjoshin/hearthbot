import { Database } from "sqlite3"
import { getDefaultComponents } from "../util"
import { HearthbotClient } from "../api"
import { createCardEmbed } from "../embed"
import { Client, Message, PartialMessage } from "discord.js"

type dbfIdQueryResult = {dbfId: number}

export const onCardSearchReaction = async (client: Client, message: Message | PartialMessage, authorId: string, number: number, hearthbotClient: HearthbotClient, db: Database) => {
  const query = `SELECT dbfId FROM searchResults WHERE authorId = ? AND messageId = ? AND number = ?`
  const params = [authorId, message.id, number]

  // grab the dbfId from the db
  const queryResult: dbfIdQueryResult[] = await new Promise((res, rej) => {
    db.all(
      query, 
      params, 
      (err: Error | null, rows: dbfIdQueryResult[]) => {
        err ? rej(err) : res(rows)
      }
    )
  })

  if (queryResult && queryResult.length) {
    const { dbfId } = queryResult[0]

    // delete to not trigger twice
    db.run(`DELETE FROM searchResults WHERE authorId = ? AND messageId = ? AND number = ?`, [authorId, message.id, number])
  
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
}