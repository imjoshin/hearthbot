export const api = (query: string, variables?: {[key: string]: any}) => {
  const url: string = process.env.API_HOST
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