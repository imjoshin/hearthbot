import fs from "fs"
import path from "path"
import * as constants from "./constants"

export const setCache = (key: string, value: any) => {
  if (!fs.existsSync(constants.CACHE_DIR)) {
    fs.mkdirSync(constants.CACHE_DIR)
  }

  fs.writeFileSync(path.join(constants.CACHE_DIR, key), JSON.stringify(value, null, 2))
}

export const getCache = (key: string) => {
  const filePath = path.join(constants.CACHE_DIR, key)
  if (!fs.existsSync(filePath)) {
    return null
  }

  return JSON.parse(fs.readFileSync(filePath).toString())
}

let authorizationToken = ``

export const api = async (query: string, variables?: {[key: string]: any}) => {
  const url: string = process.env.API_HOST

  const request = () => {
    return fetch(url, {
      method: `POST`, 
      headers: {
        'Content-Type': `application/json`,
        Authorization: `Bearer ${authorizationToken}`,
      },
      body: JSON.stringify({query, variables})
    })
  }

  let returnRes = await request()

  const jsonRes = returnRes.clone()
  const json = await jsonRes.json()

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
        authorizationToken,
      },
      body: JSON.stringify({query: authQuery})
    })

    const authJson = await authReq.json()
    
    if (authJson.data.login.jwt) {
      authorizationToken = authJson.data.login.jwt
      returnRes = await request()
    }
  }

  return returnRes
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