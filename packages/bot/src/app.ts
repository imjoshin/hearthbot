import dotenv from "dotenv"
import Discord, { Client } from "discord.js"
import { onCard, onCardSearch, onDeck, onCardSearchReaction } from "./events"
import { HearthbotClient } from "./api"
import { createLogger } from "./logger"
import { ReactionService } from "./util"
import path from "path"
import * as constants from "./constants"
import { onAcitivityRotate } from "./events/onActivityRotate"

dotenv.config()

const run = async () => {
  const hearthbotClient = new HearthbotClient()
  const reactionService = new ReactionService(path.join(__dirname, `.cache`, `reactions`))
  const logger = createLogger(`bot`)
  
  const client = new Discord.Client({
    partials: [Discord.Partials.Message, Discord.Partials.Channel, Discord.Partials.Reaction],
    intents: [
      `Guilds`,
      `GuildMessages`,
      `GuildMessageReactions`,
      `MessageContent`,
    ]}
  )
  
  let statusRotationTimeout: ReturnType<typeof setTimeout> = null
  const rotateTimeoutLoop = (client: Client) => {
    onAcitivityRotate(client)
    statusRotationTimeout = setTimeout(() => {
      rotateTimeoutLoop(client)
    }, constants.BOT.ACTIVITY_ROTATION_TIMEOUT)
  }

  client.on(`ready`, () => {
    logger.info(`Logged in as ${client.user.tag}!`)
    client.user.setUsername(constants.BOT.USERNAME)

    if (process.env.NODE_ENV !== `development`) {
      // discord has API limits for this, so don't do it in dev
      client.user.setAvatar(constants.BOT.AVATAR)
    }

    rotateTimeoutLoop(client)
  })
  
  client.on(`disconnect`, async (erMsg, code) => {
    if (statusRotationTimeout) {
      clearTimeout(statusRotationTimeout)
    }
    
    logger.warn(`----- Bot disconnected from Discord with code ` + code + `for reason: ` + erMsg + ` -----`)
    await new Promise(res => setTimeout(res, 10000))
    client.login(process.env.DISCORD_CLIENT_TOKEN)
  })
  
  client.on(`messageCreate`, async message => {
    const cards = message.content.match(/\[\[(.*?)\]\]/gm)
    if (cards) {
      try {
        await onCard(message, cards, hearthbotClient)
      } catch (e) {
        logger.error(`Errored during onCard: ${e.stack}`)
      }
    }
  
    const cardSearch = message.content.match(/\{\{(.*?)\}\}/gm)
    if (cardSearch) {
      try {
        await onCardSearch(message, cardSearch, hearthbotClient, reactionService)
      } catch (e) {
        logger.error(`Errored during onCardSearch: ${e.stack}`)
      }
    }
  
    const decks = message.content.match(/AAE((.*?)(=|$| ))+/gm)
    if (decks) {
      try {
        await onDeck(message, decks[0], hearthbotClient)
      } catch (e) {
        logger.error(`Errored during onDeck: ${e.stack}`)
      }
    }
  })
  
  client.on(`messageReactionAdd`, async (reaction, user) => {
    if (user.bot) {
      return
    }
    
    const emojiRe = /(\d+)/
    const numberEmojiMatch = emojiRe.exec(reaction.emoji.name)
    if (numberEmojiMatch) {
      const number = parseInt(numberEmojiMatch[1]) - 1
      const authorId = user.id
      try {
        await onCardSearchReaction(client, reaction.message, authorId, number, hearthbotClient, reactionService)
      } catch (e) {
        logger.error(`Errored during onCardSearchReaction: ${e.stack}`)
      }
    }
  })
  
  client.login(process.env.DISCORD_CLIENT_TOKEN)
}

run()