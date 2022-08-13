// import { Class } from "../enum/Class"

export type CardSetConstructor = {
  id: string,
  fullName?: string,
  shortName?: string,
  releaseDate?: string,
  scrapeUrl?: string,
}

export class CardSet {
  id: string
  fullName?: string
  shortName?: string
  releaseDate?: string
  scrapeUrl?: string

  constructor(args: CardSetConstructor ) {
    this.id = args.id
    this.fullName = args.fullName
    this.shortName = args.shortName
    this.releaseDate = args.releaseDate
    this.scrapeUrl = args.scrapeUrl
  }
}