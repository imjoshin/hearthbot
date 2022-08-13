
export const api = (query: string, variables?: {[key: string]: any}) => {
  const url: string = process.env.API_HOST || ``
  return fetch(url, {
    method: `POST`, 
    headers: {
      'Content-Type': `application/json`
    },
    body: JSON.stringify({query, variables})
  })
}

export const objectToGraphqlArgs = (object: {[key: string]: any}): string => {
  const graphqlFields: string[] = []
    
  for (const key of Object.keys(object)) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const value = object[key]

    if (value !== undefined && value !== null) {
      graphqlFields.push(`${key}: ${JSON.stringify(value)}`)
    }
  }

  return `{ ${graphqlFields.join(`, `)} }`
}

export const cleanText = (str: string | null | undefined, {enumize, number}: {enumize?: boolean, number?: boolean} = {}) => {
  if (str?.length) {
    let text = str.split(/\s+/).join(` `)
    if (enumize) {
      text = text.toUpperCase().replace(/\s+/g, `_`)
    }

    return number ? parseInt(text) : text
  } else {
    return null
  }
}

export const generateCardIds = (name: string, setId: string) => {
  const id = `${setId}_${name.toUpperCase().replace(/[^A-Za-z0-9]+/g, `_`)}`
  const dbfId = Math.abs(id.split(``).reduce(
    (prevHash, currVal) => (
      ((prevHash << 5) - prevHash) + currVal.charCodeAt(0)
    )| 0, 
    0
  )) % 1000000 + 1000000

  return { id, dbfId }
}