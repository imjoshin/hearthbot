import * as constants from "./constants"

export const sync = async (language: typeof constants.LANGUAGES[number]) => {
  const cardsJsonUrl = `${constants.HEARTHSTONE_JSON_URL}/${language}/cards.json`
  console.log({cardsJsonUrl})
}