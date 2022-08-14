import * as constants from "./constants"
import TurndownService from "turndown"

const toTitleCase = (str: string) => {
  return str.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase())
}

// TODO this is gross
type Card = {[key: string]: any}

// TODO clean this up, it's nasty
export const createCardEmbed = (card: Card) => {
  // get details
  const type = `**Type:** ${toTitleCase(card.type)}\n`
  const classt = `**Class:** ${toTitleCase(card.classes.join(`, `))}\n`
  const rarity = `**Rarity:** ${toTitleCase(card.rarity)}\n`

  let attack = ``
  let health = ``

  if (card.type === `WEAPON`) {
    const attackEmoji = constants.EMBED.EMOJI.WEAPON_ATTACK
    const healthEmoji = constants.EMBED.EMOJI.WEAPON_HEALTH

    if (card.attack !== null) {
      attack = `${attackEmoji} **${card.attack}**  `
    }
    if (card.durability !== null) {
      health = `${healthEmoji} **${card.durability}**  `
    }
  } else {
    const attackEmoji = constants.EMBED.EMOJI.ATTACK
    const healthEmoji = constants.EMBED.EMOJI.HEALTH

    if (card.attack !== null) {
      attack = `${attackEmoji} **${card.attack}**  `
    }
    if (card.health !== null) {
      health = `${healthEmoji} **${card.health}**  `
    }
  }

  const stats = (attack != `` || health != ``) ? (attack + health + `\n\n`) : ``

  let text = ``
  if (card.strings.enUS.text !== ``) {
    const turndownService = new TurndownService()

    // convert to markdown but preserve newlines
    let markdownText = card.strings.enUS.text
      .split(`\n`)
      .map((line: string) => turndownService.turndown(line))
      .join(`\n`)

    // some oddities in raw text, filter it out
    markdownText = markdownText
      .replace(/\\\[x\\\]/g, ``)
      .replace(/\*\*\*\*([^*]+)\*\*([^*]*)\*\*/g, `**$1$2**`)

    text = `\n*${markdownText}*`
  }

  // TODO use set longname if available
  const set = `Set: ` + toTitleCase(card.setId.replace(/_+/g, ` `))

  return {
    "author": {
      "name": card.strings.enUS.name,
      "icon_url": `https://jjdev.io/hearthbot/img/mana-${card.cost}.png`
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    "color": constants.EMBED.RARITIES[card.rarity].color,
    "description": stats + type + classt + rarity + text,
    "footer": {
      "text": set
    },
    "thumbnail": {
      "url": card.image
    },
  }
}

const formatDeckCardRow = (card: Card) => {
  return card.count + `x ` + card.strings.enUS.name
}

export const createDeckEmbed = (deckCode: string, cards: Card[]) => {
  let dust = 0
  const classes = new Set<string>()
  const classCards: Card[] = []
  const neutralCards: Card[] = []

  cards.forEach(card => {
    if (card.classes.indexOf(`NEUTRAL`) >= 0) {
      neutralCards.push(card)
    } else {
      classCards.push(card)
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    dust += constants.EMBED.RARITIES[card.rarity].dust * card.count
    for (const cls of card.classes) {
      if (cls !== `NEUTRAL`) {
        classes.add(cls)
      }
    }
  })

  classCards.sort(function(a, b) {
    return a.cost - b.cost
  })
  neutralCards.sort(function(a, b) {
    return a.cost - b.cost
  })

  const classCardsText: string[] = []
  const neutralCardsText: string[] = []

  classCards.forEach(card => {
    classCardsText.push(formatDeckCardRow(card))
  })
  neutralCards.forEach(card => {
    neutralCardsText.push(formatDeckCardRow(card))
  })

  const fields = [
    {
      name: `Class Cards`,
      value: classCards.length ? classCardsText.join(`\n`) : `:no_entry:`,
      inline: true
    },
    {
      name: `Neutral Cards`,
      value: neutralCards.length ? neutralCardsText.join(`\n`) : `:no_entry:`,
      inline: true
    },
  ]

  const deckClass = Array.from(classes).join(`, `)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const authorIcon = (classes.size == 1 ? constants.EMBED.CLASSES[deckClass].icon : ``)
  
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const color = (classes.size == 1 ? constants.EMBED.CLASSES[deckClass].color : constants.EMBED.CLASSES.NEUTRAL.color)

  return {
    "author": {
      "name": toTitleCase(deckClass),
      "icon_url": authorIcon,
    },
    "title": `View Deckbuilder`,
    "url": `https://playhearthstone.com/en-us/deckbuilder?deckcode=` + deckCode,
    "color": color,
    "fields": fields,
    "footer": {
      "icon_url": `https://cdn.discordapp.com/emojis/230175397243781121.png`,
      "text": `` + dust
    }
  }
}