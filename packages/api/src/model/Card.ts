// import { Class } from "../enum/Class"

export class Card {
  constructor(
    public id: string,
    public artist: string,
    public attack: number,
    public collectible: boolean,
    public cost: number,
    public dbfId: number,
    public flavor: string,
    public health: number,
    public name: string,
    public rarity: number,
    public setId: string,
    public text: string,
    public type: number,
    public tribes: string,
  ) {}
}