// import { Class } from "../enum/Class"

export type SetConstructor = {
  id: string,
  fullName?: string,
  shortName?: string,
  releaseDate?: string,
}

export class Set {
  id: string
  fullName?: string
  shortName?: string
  releaseDate?: string

  constructor(args: SetConstructor ) {
    this.id = args.id
    this.fullName = args.fullName
    this.shortName = args.shortName
    this.releaseDate = args.releaseDate
  }
}