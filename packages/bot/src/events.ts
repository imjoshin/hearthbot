import { Message } from "discord.js"
import { createCardEmbed } from "./embed"
import { api } from "./util"

export const onCards = async (message: Message, cards: string[]) => {
  // TODO make multiple card query endpoint

  for (const card of cards) {
    // TODO regex match filter/search params
    const name = card.slice(2, -2)
    const response = await api(`
      query {
        cards(
          name:"${name}",
          collectible: true,
        ) {
          attack,
          classes,
          cost,
          durability,
          image,
          health,
          mechanics,
          rarity,
          setId,
          type,
          tribe, 
          strings {
            enUS{
              name,
              text,
            }
          }
        }
      }
    `)

    const json = await response.json()
    if (json?.data?.cards?.length) {
      const cardObject = json.data.cards[0]
      const embed = createCardEmbed(cardObject)
      message.reply({embeds: [embed]})
    }
  }
}