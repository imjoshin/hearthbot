type CardConstructor = {
  id: string,
  artist: string,
  attack: number,
  collectible: boolean,
  cost: number,
  dbfId: number,
  flavor: string,
  health: number,
  name: string,
  rarity: number,
  setId: string,
  text: string,
  type: number,
  tribes: string,
}

export class Card {
  public id: string
  public artist: string
  public attack: number
  public collectible: boolean
  public cost: number
  public dbfId: number
  public flavor: string
  public health: number
  public name: string
  public rarity: number
  public setId: string
  public text: string
  public type: number
  public tribes: string

  constructor({
    id,
    artist,
    attack,
    collectible,
    cost,
    dbfId,
    flavor,
    health,
    name,
    rarity,
    setId,
    text,
    type,
    tribes,
  }: CardConstructor) {
    this.id = id
    this.artist = artist
    this.attack = attack
    this.collectible = collectible
    this.cost = cost
    this.dbfId = dbfId
    this.flavor = flavor
    this.health = health
    this.name = name
    this.rarity = rarity
    this.setId = setId
    this.text = text
    this.type = type
    this.tribes = tribes
  }
}