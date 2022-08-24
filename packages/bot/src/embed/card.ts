import * as constants from "../constants"
import TurndownService from "turndown"
import { toTitleCase } from "../util"

// TODO this is gross
type Card = {[key: string]: any}

// TODO clean this up, it's nasty
export const createCardEmbed = (card: Card) => {
  // get stats
  const stats = []

  if (card.type === `WEAPON`) {
    if (card.attack !== null) {
      stats.push(`${constants.EMBED.EMOJI.WEAPON_ATTACK} **${card.attack}**`)
    }
    if (card.durability !== null) {
      stats.push(`${constants.EMBED.EMOJI.WEAPON_HEALTH} **${card.durability}**`)
    }
  } else {
    if (card.attack !== null) {
      stats.push(`${constants.EMBED.EMOJI.ATTACK} **${card.attack}**`)
    }
    if (card.health !== null) {
      stats.push(`${constants.EMBED.EMOJI.HEALTH} **${card.health}**`)
    }
  }

  const statsDisplay = stats.length ? stats.join(`  `) + `\n\n` : ``

  // get metadata
  const metadataAttributes = {
    type: card.type,
    class: card.classes && card.classes.join(`, `),
    rarity: card.rarity,
    tribe: card.tribe,
  }

  const metadata = []
  for (const [name, value] of Object.entries(metadataAttributes)) {
    if (value) {
      metadata.push(`**${toTitleCase(name)}** ${toTitleCase(value)}`)
    }
  }

  const metadataDisplay = metadata.length ? metadata.join(`\n`) + `\n` : ``

  // get text
  let text = ``
  let locale = `enUS`
  if (card.strings && Object.keys(card.strings).length) {
    locale = Object.keys(card.strings)[0]

    if (card.strings[locale].text && card.strings[locale].text !== ``) {
      const turndownService = new TurndownService()
  
      // convert to markdown but preserve newlines
      let markdownText = card.strings[locale].text
        .split(`\n`)
        .map((line: string) => turndownService.turndown(line))
        .join(`\n`)
  
      // some oddities in raw text, filter it out
      markdownText = markdownText
        .replace(/\\\[x\\\]/g, ``)
        .replace(/\*\*\*\*([^*]+)\*\*([^*]*)\*\*/g, `**$1$2**`)
        .replace(/\$(\d+)/g, `$1`)
        .replace(/\((\d+)\)/g, `$1`)
  
      text = `\n*${markdownText}*`
    }
  }

  // get set
  const setText = card.set.fullName || card.set.shortName || toTitleCase(card.set.id.replace(/_+/g, ` `)) 
  const set = `Set: ` + setText

  // get rarity
  const rarityObject = card.rarity in constants.EMBED.RARITIES 
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ? constants.EMBED.RARITIES[card.rarity || ``] 
    : constants.EMBED.RARITIES.FREE

  // construct embed
  return {
    author: {
      name: card.strings[locale].name,
      // TODO move these to hearthbot.app
      icon_url: `https://jjdev.io/hearthbot/img/mana-${card.cost}.png`
    },
    color: rarityObject.color,
    description: statsDisplay + metadataDisplay + text,
    footer: {
      text: set
    },
    thumbnail: {
      url: card.image
    },
  }
}