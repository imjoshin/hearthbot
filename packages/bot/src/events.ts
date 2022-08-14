import * as constants from "./constants"
import { Message, ButtonComponent, ButtonStyle } from "discord.js"
import { createCardEmbed } from "./embed"
import { api } from "./util"

export const onCards = async (message: Message, cards: string[]) => {
  // TODO make multiple card query endpoint
  const embeds = []
  const components = []

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
      embeds.push(embed)
    }
  }

  if (embeds.length && Math.floor(Math.random() * constants.DONATE_CHANCE) === 0) {
    components.push({
      "type": 1,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      components: [
        {
          type: 2,
          style: 5,
          "label": `Buy me a coffee!`,
          "url": constants.DONATE_LINK,
        }
      ]
    })
  }
  
  message.reply({
    embeds: embeds, 
    components,
  })
}

