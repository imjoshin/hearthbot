import * as constants from "../constants"

// TODO this is gross
type Card = {[key: string]: any}

const indexToEmoji = [
  `one`,
  `two`,
  `three`,
  `four`,
  `five`,
  `six`,
  `seven`,
  `eight`,
  `nine`,
  `zero`,
]

const formatCardRow = (index: number, card: Card, isDuplicate: boolean) => {
  return `:${indexToEmoji[index]}: ${card.strings.enUS.name} ${isDuplicate ? `*(${card.id})*` : ``}`
}

const findDuplicates = (arr: string[]) => {
  const sortedArr = arr.slice().sort()
  const results = []

  for (let i = 0; i < sortedArr.length - 1; i++) {
    if (sortedArr[i + 1] == sortedArr[i]) {
      results.push(sortedArr[i])
    }
  }

  return results
}

export const createCardSearchEmbed = (cards: Card[]) => {
  const cardsToShow = cards.slice(0, 9)
  const duplicateNames = findDuplicates(cardsToShow.map(c => c.strings.enUS.name))
  const rows = cardsToShow.map(
    (card, i) => formatCardRow(i, card, duplicateNames.indexOf(card.strings.enUS.name) >= 0)
  )

  let footer = null
  if (cardsToShow.length < cards.length) {
    const difference = cards.length - cardsToShow.length
    footer = {
      text: `${difference > 10 ? `A lot` : difference} more cards were found...`
    }
  }
  
  // construct embed
  return {
    color: constants.EMBED.RARITIES.FREE.color,
    description: rows.join(`\n`),
    footer,
  }

}