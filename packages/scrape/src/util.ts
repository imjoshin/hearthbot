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