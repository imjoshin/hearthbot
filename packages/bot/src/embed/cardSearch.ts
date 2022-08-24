import * as constants from "../constants"

// TODO this is gross
type Card = {[key: string]: any}

export const createCardSearchEmbed = (cards: Card[]) => {
  // construct embed
  return {
    author: {
      name: `test, ${cards.length}`,
      // TODO move these to hearthbot.app
      icon_url: `https://jjdev.io/hearthbot/img/mana-5.png`
    },
    color: constants.EMBED.RARITIES.FREE.color,
    description: `description`,
    footer: {
      text: `footer`
    },
  }

}