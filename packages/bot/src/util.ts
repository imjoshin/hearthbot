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