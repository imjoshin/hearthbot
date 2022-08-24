import dotenv from "dotenv"
import Discord from "discord.js"
import {Database} from "sqlite3"
import { onCards, onDeck } from "./events"
import { HearthbotClient } from "./api"
import { createLogger } from "./logger"

dotenv.config()

const hearthbotClient = new HearthbotClient()
const db = new Database(`bot.db`)

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS searchResults (authorId TEXT, messageId TEXT, number INT, dbfId INT)`)
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

client.on(`messageCreate`, message => {
  const cards = message.content.match(/\[\[(.*?)\]\]/gm)
  if (cards) {
    onCards(message, cards, hearthbotClient, false, db)
  }

  const cardSearch = message.content.match(/\{\{(.*?)\}\}/gm)
  if (cardSearch) {
    onCards(message, cardSearch, hearthbotClient, true, db)
  }

  const decks = message.content.match(/AAE((.*?)(=|$| ))+/gm)
  if (decks) {
    onDeck(message, decks[0], hearthbotClient)
  }
})

client.on(`messageReactionAdd`, (reaction, user) => {
  const emojiRe = /(\d+)/
  const numberEmojiMatch = emojiRe.exec(reaction.emoji.name)
  if (numberEmojiMatch) {
    const selection = parseInt(numberEmojiMatch[1])
    const messageId = reaction.message.id
    const userId = user.id
    console.log({selection, messageId, userId})
  }
})

client.login(process.env.DISCORD_CLIENT_TOKEN)
