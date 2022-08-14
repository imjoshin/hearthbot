import * as constants from "./constants"

const toTitleCase = (str: string) => {
  return str.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase())
}

// TODO clean this up, it's nasty
export const createCardEmbed = (card: {[key: string]: any}) => {
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

  // TODO text and set formatting
  const stats = (attack != `` || health != ``) ? (attack + health + `\n\n`) : ``
  const text = card.strings.enUS.text != `` ? (`\n\n*` + card.strings.enUS.text + `*`) : ``
  const set = `Set: ` + card.setId

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
    }
  }
}