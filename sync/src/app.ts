import dotenv from "dotenv"
import * as constants from "./constants"
import { sync } from "./sync"

dotenv.config()

const run = async() => {
  // keep this in memory - if we restart might as well run a sync
  const lastVersionSynced: {[K in typeof constants.LANGUAGES[number]]?: string} = {}

  for (const language of constants.LANGUAGES) {
    // first make a request to see what version we get redirected to
    const directory = `${constants.HEARTHSTONE_JSON_URL}/${language}`
    const initialRequest = await fetch(directory)
    const redirectedUrl = initialRequest.url
    const versionRe = /v1\/(\d+)\//
    const versionMatch = redirectedUrl.match(versionRe)

    if (!versionMatch) {
      console.error(`No version redirect found for url ${directory}`)
      continue
    }

    // if we don't see a new version, no need to sync again
    const version = versionMatch[1]
    if (version !== lastVersionSynced[language]) {
      sync(language)
      lastVersionSynced[language] = version
    }
  }
}

run()
