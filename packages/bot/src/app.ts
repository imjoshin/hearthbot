import dotenv from "dotenv"
import Discord from "discord.js"
import { onCards, onDeck } from "./events"

dotenv.config()

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
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on(`disconnect`, async (erMsg, code) => {
  console.log(`----- Bot disconnected from Discord with code ` + code + `for reason: ` + erMsg + ` -----`)
  await new Promise(res => setTimeout(res, 10000))
  client.login(process.env.DISCORD_CLIENT_TOKEN)
})

client.on(`messageCreate`, message => {
  const cards = message.content.match(/\[\[(.*?)\]\]/gm)
  if (cards) {
    onCards(message, cards)
  }

  const decks = message.content.match(/AAE((.*?)(=|$| ))+/gm)
  if (decks) {
    onDeck(message, decks[0])
  }
})

client.login(process.env.DISCORD_CLIENT_TOKEN)
