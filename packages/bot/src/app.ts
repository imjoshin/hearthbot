import dotenv from "dotenv"
import Discord from "discord.js"
import {Database} from "sqlite3"
import { onCard, onCardSearch, onDeck, onCardSearchReaction } from "./events"
import { HearthbotClient } from "./api"
import { createLogger } from "./logger"

dotenv.config()

const hearthbotClient = new HearthbotClient()
const db = new Database(`bot.db`)

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS searchResults (authorId TEXT, messageId TEXT, number INT, dbfId INT, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)`)
})

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

client.on(`ready`, () => {
  logger.info(`Logged in as ${client.user.tag}!`)
})

client.on(`disconnect`, async (erMsg, code) => {
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
      await onCardSearch(message, cardSearch, hearthbotClient, db)
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
    const number = parseInt(numberEmojiMatch[1])
    const authorId = user.id
    try {
      await onCardSearchReaction(client, reaction.message, authorId, number, hearthbotClient, db)
    } catch (e) {
      logger.error(`Errored during onCardSearchReaction: ${e.stack}`)
    }
  }
})

client.login(process.env.DISCORD_CLIENT_TOKEN)
