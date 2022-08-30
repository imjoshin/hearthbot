import yargs from "yargs"
import * as constants from "./constants"
import fs from "fs"
import path from "path"


type ReactionGroup = {
  messageId: string,
  authorId: string,
  reactionMap: {[key: number]: number}
  createdAt?: number,
}

export class ReactionService {
  private storePath

  constructor(storePath: string) {
    fs.mkdirSync(storePath, {recursive: true})
    this.storePath = storePath
  }

  set = (reactionGroup: ReactionGroup) => {
    const filepath = path.join(this.storePath, reactionGroup.messageId)
    fs.writeFileSync(filepath, JSON.stringify({
      ...reactionGroup,
      createdAt: Date.now(),
    }))
  }

  get = (messageId: string): ReactionGroup | null => {
    const filepath = path.join(this.storePath, messageId)
    if (!fs.existsSync(filepath)) {
      return null
    }

    const contents = fs.readFileSync(filepath).toString()
    return JSON.parse(contents) as ReactionGroup
  }

  delete = (messageId: string, reactionIndex: number) => {
    const filepath = path.join(this.storePath, messageId)
    if (!fs.existsSync(filepath)) {
      return
    }

    const contents = fs.readFileSync(filepath).toString()
    const reactionGroup = JSON.parse(contents) as ReactionGroup

    if (reactionIndex in reactionGroup.reactionMap) {
      delete reactionGroup.reactionMap[reactionIndex]
    }

    fs.writeFileSync(filepath, JSON.stringify(reactionGroup))
  }

  clearLegacyReactionGroups = () => {
    // TODO
  }
}

export const getDefaultComponents = () => {
  const components = []

  if (Math.floor(Math.random() * constants.DONATE_CHANCE) === 0) {
    components.push({
      "type": 1,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      components: [
        {
          type: 2,
          style: 5,
          "label": `Buy me a coffee!`,
          "url": constants.DONATE_LINK,
          "emoji": {
            "name": `☕`
          },
        }
      ]
    })
  }
  
  return components
}

export const parseRangeArg = (range: string) => {
  const rangeRe = /(\d+)?(([-\+])(\d+)?)?/
  const matches = rangeRe.exec(range)

  if (!matches) {
    return null
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_0, lowerBound, _2, divider, upperBound] = matches

  if (lowerBound !== undefined && divider === undefined && upperBound === undefined) {
    return {eq: parseInt(lowerBound)}
  }

  if (lowerBound !== undefined && divider !== undefined && upperBound === undefined) {
    return {gte: parseInt(lowerBound)}
  }

  if (lowerBound === undefined && divider !== undefined && upperBound !== undefined) {
    return {lte: parseInt(upperBound)}
  }

  if (lowerBound !== undefined && divider !== undefined && upperBound !== undefined) {
    return {gte: parseInt(lowerBound), lte: parseInt(upperBound)}
  }

  return null
}

export const toTitleCase = (str: string) => {
  return str.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase())
}

export const parseQuery = async (card: string) => {
  // remove [[...]], then replace + with --
  const search = card.slice(2, -2).trim()
    .replace(/^\+\+?/g, `--`)
    .replace(/(\s+)\+\+?/g, `$1--`)

  if (search.length < 3) {
    return null
  }

  const args = await yargs(search)
    .option(`token`, {
      alias: `k`,
      type: `boolean`,
      default: false,
    })
    .option(`locale`, {
      alias: `g`,
      type: `string`,
      default: `enUS`,
    })
    .option(`rarity`, {
      alias: `r`,
      type: `string`,
    })
    .option(`tribe`, {
      alias: `t`,
      type: `string`,
    })
    .option(`class`, {
      alias: `c`,
      type: `string`,
    })
    .option(`cost`, {
      alias: `o`,
      type: `string`,
    })
    .option(`health`, {
      alias: `h`,
      type: `string`,
    })
    .option(`durability`, {
      alias: `d`,
      type: `string`,
    })
    .option(`attack`, {
      alias: `a`,
      type: `string`,
    })
    .option(`set`, {
      alias: `s`,
      type: `string`,
    })
    .option(`type`, {
      alias: `y`,
      type: `string`,
    })
    .option(`mechanic`, {
      alias: `m`,
      type: `array`,
    })
    .option(`school`, {
      alias: `l`,
      type: `string`,
    })
    .option(`hero`, {
      alias: `e`,
      type: `boolean`,
    })
    .parse()

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const name = args[`_`].join(` `)

  const filters: {[key: string]: any} = {
    collectible: !args.token,
    hero: !!args.hero,
  }

  if (name) {
    filters.name = name
  }

  if (args.rarity) {
    filters.rarity = args.rarity
  }

  if (args.tribe) {
    filters.tribe = args.tribe
  }

  if (args.school) {
    filters.school = args.school
  }

  if (args.class) {
    filters.class = args.class

    if ([`dh`, `demonhunter`].indexOf(args.class.toLowerCase()) >= 0) {
      filters.class = `DEMON_HUNTER`
    }
  }

  if (args.set) {
    filters.set = args.set
  }

  if (args.type) {
    filters.type = args.type

    if (args.type.toLowerCase() === `hp`) {
      filters.type = `HERO_POWER`
    }
  }

  if (args.mechanic) {
    filters.mechanics = args.mechanic
  }

  if (args.cost) {
    const cost = parseRangeArg(args.cost)
    if (cost) {
      filters.cost = cost
    }
  }

  if (args.health) {
    const health = parseRangeArg(args.health)
    if (health) {
      filters.health = health
    }
  }

  if (args.durability) {
    const durability = parseRangeArg(args.durability)
    if (durability) {
      filters.durability = durability
    }
  }

  if (args.attack) {
    const attack = parseRangeArg(args.attack)
    if (attack) {
      filters.attack = attack
    }
  }

  const fields = {
    locale: args.locale,
  }

  return {filters, fields}
}