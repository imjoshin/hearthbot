import * as constants from "./constants"
import { Message, ButtonComponent, ButtonStyle } from "discord.js"
import { createCardEmbed, createDeckEmbed } from "./embed"
import { api } from "./util"

const getDefaultComponents = () => {
  const components = []

  if (Math.floor(Math.random() * constants.DONATE_CHANCE) === 0) {
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
          "emoji": {
            "name": `☕`
          },
        }
      ]
    })
  }
  
  return components
}

export const onCards = async (message: Message, cards: string[]) => {
  // TODO make multiple card query endpoint
  const embeds = []

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
  
  if (embeds.length) {
    message.reply({
      embeds: embeds, 
      components: getDefaultComponents(),
    })
  }
}

export const onDeck = async (message: Message, deckCode: string) => {
  const embeds = []

  const response = await api(`
    query {
      deck(code:"${deckCode}") {
        cards {
          classes,
          count,
          rarity,
          strings {
            enUS{
              name,
              text,
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
    message.reply({
      embeds: embeds, 
      components: getDefaultComponents(),
    })
  }
}