export const getMissingObjectProperties = (obj: {[key: string]: any}, keys: string[]) => {
  const missing = []
  for (const key of keys) {
    if (obj[key] === undefined || obj[key] === null) {
      missing.push(key)
    }
  }

  return missing
}