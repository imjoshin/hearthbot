import yargs from "yargs"
import * as constants from "./constants"

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
  // remove [[...]]
  const search = card.slice(2, -2).trim().replace(/\+/g, `-`)

  const args = await yargs(search)
    .option(`token`, {
      alias: `k`,
      type: `boolean`,
      default: false,
    })
    .option(`locale`, {
      alias: `l`,
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
    .option(`mechanics`, {
      alias: `m`,
      type: `array`,
    })
    .parse()


  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const name = args[`_`].join(` `)

  const filters: {[key: string]: any} = {
    collectible: !args.token,
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

  if (args.class) {
    filters.class = args.class
  }

  if (args.set) {
    filters.set = args.set
  }

  if (args.type) {
    filters.type = args.type
  }

  if (args.mechanics) {
    filters.mechanics = args.mechanics
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