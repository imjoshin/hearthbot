// import { Class } from "../enum/Class"

export type CardTranslationConstructor = {
  id: number,
  cardId: string,
  locale: string,
  name: string,
  flavor?: string,
  text?: string,
}

export class CardTranslation {
  id: number
  cardId: string
  locale: string
  name: string
  flavor?: string
  text?: string

  constructor(args: CardTranslationConstructor) {
    this.id = args.id
    this.cardId = args.cardId
    this.locale = args.locale
    this.name = args.name
    this.flavor = args.flavor
    this.text = args.text
  }
}