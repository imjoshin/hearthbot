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