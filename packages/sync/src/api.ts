// TODO make this common for all packages

export class HearthbotClient {
  private authorizationToken: string

  call = async (query: string, variables?: {[key: string]: any}) => {
    const url: string = process.env.API_HOST
  
    // method to call to make actual request
    const request = () => {
      return fetch(url, {
        method: `POST`, 
        headers: {
          'Content-Type': `application/json`,
          Authorization: `Bearer ${this.authorizationToken}`,
        },
        body: JSON.stringify({query, variables})
      })
    }
  
    // attempt to make request first
    let returnRes = await request()
  
    // clone the response since we can't call json on one twice
    const jsonRes = returnRes.clone()
    const json = await jsonRes.json()
  
    // if we saw a permissions error, request a jwt
    if (JSON.stringify(json).indexOf(`Invalid permissions`) >= 0) {
      const authQuery = `
        query {
          login (
            username: "${process.env.API_USER}",
            password: "${process.env.API_PASS}",
          ) { jwt }
        }
      `
      const authReq = await fetch(url, {
        method: `POST`, 
        headers: {
          'Content-Type': `application/json`,
        },
        body: JSON.stringify({query: authQuery})
      })
  
      const authJson = await authReq.json()
      
      // if we got a valid jwt, make the request again
      if (authJson.data.login.jwt) {
        this.authorizationToken = authJson.data.login.jwt
        returnRes = await request()
      }
    }
  
    return returnRes
  }
}

// Note: this is very fragile, handle with care
export const objectToGraphqlArgs = (object: {[key: string]: any}, nested = false): string => {
  const graphqlFields: string[] = []
    
  for (const key of Object.keys(object)) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const value = object[key]

    if (value !== undefined && value !== null) {
      if (typeof value === `object` && !Array.isArray(value)) {
        graphqlFields.push(`${key}: ${objectToGraphqlArgs(value, true)}`)
      } else {
        graphqlFields.push(`${key}: ${JSON.stringify(value)}`)
      }
    }
  }

  let string = graphqlFields.join(`, `)
  if (nested) {
    string = `{ ${string} }`
  }
  
  return string
}