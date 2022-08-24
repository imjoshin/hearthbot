import * as constants from "../constants"
import { Database } from "sqlite3"

// TODO this is gross
type Card = {[key: string]: any}

const indexToEmoji = [
  `1️⃣`,`2️⃣`,`3️⃣`,`4️⃣`,`5️⃣`,`6️⃣`,`7️⃣`,`8️⃣`,`9️⃣`
]

const formatCardRow = (index: number, card: Card, isDuplicate: boolean) => {
  return `${indexToEmoji[index]} ${card.strings.enUS.name} ${isDuplicate ? `*(${card.id})*` : ``}`
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

export const createCardSearchEmbed = (cards: Card[], db: Database) => {
  const cardsToShow = cards.slice(0, 9)
  const duplicateNames = findDuplicates(cardsToShow.map(c => c.strings.enUS.name))
  const rows: string[] = []
  
  cardsToShow.forEach(
    (card, i) => {
      const isDuplicate = duplicateNames.indexOf(card.strings.enUS.name) >= 0
      rows.push(formatCardRow(i, card, isDuplicate))
  
      // TODO insert into db
    } 
  )

  let footer = null
  if (cardsToShow.length < cards.length) {
    const difference = cards.length - cardsToShow.length
    footer = {
      text: `${difference > 10 ? `A lot` : difference} more cards were found...`
    }
  }
  
  // construct embed
  const embed = {
    color: constants.EMBED.RARITIES.FREE.color,
    description: rows.join(`\n`),
    footer,
  }

  return {
    embed,
    reactions: indexToEmoji.slice(0, cardsToShow.length),
  }

}