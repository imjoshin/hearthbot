import * as constants from "../constants"
import { toTitleCase } from "../util"

// TODO this is gross
type Card = {[key: string]: any}

const formatDeckCardRow = (card: Card) => {
  return card.count + `x ` + card.strings.enUS.name
}

export const createDeckEmbed = (deckCode: string, cards: Card[]) => {
  let dust = 0
  const classes = new Set<string>()
  const classCards: Card[] = []
  const neutralCards: Card[] = []

  // sort cards into class/neutral
  cards.forEach(card => {
    if (card.classes.indexOf(`NEUTRAL`) >= 0) {
      neutralCards.push(card)
    } else {
      classCards.push(card)
    }

    // count dust cost
    // @ts-ignore
    dust += constants.EMBED.RARITIES[card.rarity].dust * card.count

    // aggregate all classes seen
    for (const cls of card.classes) {
      if (cls !== `NEUTRAL`) {
        classes.add(cls)
      }
    }
  })

  // sort cards by cost
  classCards.sort(function(a, b) {
    return a.cost - b.cost
  })
  neutralCards.sort(function(a, b) {
    return a.cost - b.cost
  })

  const classCardsText: string[] = []
  const neutralCardsText: string[] = []

  // get display for each card
  classCards.forEach(card => {
    classCardsText.push(formatDeckCardRow(card))
  })
  neutralCards.forEach(card => {
    neutralCardsText.push(formatDeckCardRow(card))
  })

  // get entire embed display
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
    .replace(/DEMONHUNTER/g, `DEMON_HUNTER`)
    .replace(/DEATHKNIGHT/g, `DEATH_KNIGHT`)

  // @ts-ignore
  const deckClassObject = classes.size == 1 ? constants.EMBED.CLASSES[deckClass] : constants.EMBED.CLASSES.NEUTRAL

  return {
    author: {
      name: toTitleCase(deckClass.replace(/_/g, ` `)),
      icon_url: deckClassObject.icon,
    },
    title: `View Deckbuilder`,
    url: `https://playhearthstone.com/en-us/deckbuilder?deckcode=` + deckCode,
    color: deckClassObject.color,
    fields: fields,
    footer: {
      icon_url: `https://cdn.discordapp.com/emojis/230175397243781121.png`,
      text: `` + dust
    }
  }
}