import { Message } from "discord.js"
import { createDeckEmbed } from "../embed"
import { HearthbotClient } from "../api"
import { getDefaultComponents } from "../util"

export const onDeck = async (message: Message, deckCode: string, hearthbotClient: HearthbotClient) => {
  const embeds = []

  const response = await hearthbotClient.call(`
    query {
      deck(code:"${deckCode}") {
        cards {
          classes
          cost
          count
          rarity
          strings {
            enUS{
              name
              text
            }
          }
        }
      }
    }
  `)

  const json = await response.json()
  if (json?.data?.deck?.cards?.length) {
    const cardObjects = json.data.deck?.cards
    const embed = createDeckEmbed(deckCode, cardObjects)
    embeds.push(embed)
  }
  
  if (embeds.length) {
    const deckName = /### ((.*?)+)/.exec(message.content)
    const content = `<@${message.author.id}>'s ${deckName ? `**${deckName[1]}** ` : ``}deck:`
    message.reply({
      content: content,
      embeds: embeds, 
      components: getDefaultComponents(),
    })
  }
}