import path from "path"

export const HEARTHSTONE_JSON_URL = `https://api.hearthstonejson.com/v1`
export const LANGUAGES = [
  `enUS`
] as const
export const CACHE_DIR = path.join(__dirname, `..`, `.cache`)
export const SLEEP_TIME = 1000 * 60 * 60