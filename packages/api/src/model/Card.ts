import { PRE_RELEASE_SET_PREFIX } from "../constants"

type CardConstructor = {
  id: string,
  artist: string,
  attack: number,
  collectible: boolean,
  classes: string[],
  cost: number,
  dbfId: number,
  durability: number,
  health: number,
  mechanics: string[],
  rarity: number,
  setId: string,
  type: number,
  tribe: string,
  image: string,
}

export class Card {
  public id: string
  public artist: string
  public attack: number
  public collectible: boolean
  public classes: string[]
  public cost: number
  public dbfId: number
  public durability: number
  public health: number
  public mechanics: string[]
  public rarity: number
  public setId: string
  public tribe: string
  public type: number
  public image: string

  constructor(card: CardConstructor) {
    this.id = card.id
    this.artist = card.artist
    this.attack = card.attack
    this.classes = card.classes
    this.collectible = card.collectible
    this.cost = card.cost
    this.dbfId = card.dbfId
    this.durability = card.durability
    this.health = card.health
    this.mechanics = card.mechanics
    this.rarity = card.rarity
    this.setId = card.setId
    this.type = card.type
    this.tribe = card.tribe
    this.image = card.image 

    if (!card.image && !this.setId.startsWith(PRE_RELEASE_SET_PREFIX)) {
      this.image = `https://art.hearthstonejson.com/v1/render/latest/enUS/256x/${card.id}.png`
    }
  }
}