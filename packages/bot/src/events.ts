import { Message } from "discord.js"
import { createCardEmbed, createCardSearchEmbed, createDeckEmbed } from "./embed"
import { HearthbotClient, objectToGraphqlArgs } from "./api"
import yargs from "yargs"
import { parseRangeArg, getDefaultComponents } from "./util"

const parseQuery = async (card: string) => {
  // remove [[...]]
  const search = card.slice(2, -2).trim().replace(/\+/g, `-`)

  const args = await yargs(search)
    .option(`token`, {
      alias: `k`,
      type: `boolean`,
      default: false,
    })
    .option(`locale`, {
      alias: `l`,
      type: `string`,
      default: `enUS`,
    })
    .option(`rarity`, {
      alias: `r`,
      type: `string`,
    })
    .option(`tribe`, {
      alias: `t`,
      type: `string`,
    })
    .option(`class`, {
      alias: `c`,
      type: `string`,
    })
    .option(`cost`, {
      alias: `o`,
      type: `string`,
    })
    .option(`health`, {
      alias: `h`,
      type: `string`,
    })
    .option(`durability`, {
      alias: `d`,
      type: `string`,
    })
    .option(`attack`, {
      alias: `a`,
      type: `string`,
    })
    .option(`set`, {
      alias: `s`,
      type: `string`,
    })
    .option(`type`, {
      alias: `y`,
      type: `string`,
    })
    .option(`mechanics`, {
      alias: `m`,
      type: `array`,
    })
    .parse()


  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const name = args[`_`].join(` `)

  const filters: {[key: string]: any} = {
    collectible: !args.token,
  }

  if (name) {
    filters.name = name
  }

  if (args.rarity) {
    filters.rarity = args.rarity
  }

  if (args.tribe) {
    filters.tribe = args.tribe
  }

  if (args.class) {
    filters.class = args.class
  }

  if (args.set) {
    filters.set = args.set
  }

  if (args.type) {
    filters.type = args.type
  }

  if (args.mechanics) {
    filters.mechanics = args.mechanics
  }

  if (args.cost) {
    const cost = parseRangeArg(args.cost)
    if (cost) {
      filters.cost = cost
    }
  }

  if (args.health) {
    const health = parseRangeArg(args.health)
    if (health) {
      filters.health = health
    }
  }

  if (args.durability) {
    const durability = parseRangeArg(args.durability)
    if (durability) {
      filters.durability = durability
    }
  }

  if (args.attack) {
    const attack = parseRangeArg(args.attack)
    if (attack) {
      filters.attack = attack
    }
  }

  const fields = {
    locale: args.locale,
  }

  return {filters, fields}
}

export const onCards = async (message: Message, cards: string[], hearthbotClient: HearthbotClient, search = false) => {
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
      if (!search || json.data.cards.length === 1) {
        const cardObject = json.data.cards[0]
        const embed = createCardEmbed(cardObject)
        embeds.push(embed)
      } else {
        const {embed, reactions} = createCardSearchEmbed(json.data.cards)
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

export const onDeck = async (message: Message, deckCode: string, hearthbotClient: HearthbotClient) => {
  const embeds = []

  const response = await hearthbotClient.call(`
    query {
      deck(code:"${deckCode}") {
        cards {
          classes
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