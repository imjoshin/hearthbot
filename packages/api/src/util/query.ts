

export type RangeInput = {
  eq?: number,
  lt?: number,
  gt?: number,
}

export const rangeQuery = (field: string, range: RangeInput) => {
  const wheres = []
  const params = []

  if (range.eq) {
    wheres.push(`${field} = ?`)
    params.push(range.eq)
  }

  if (range.gt) {
    wheres.push(`${field} > ?`)
    params.push(range.gt)
  }

  if (range.lt) {
    wheres.push(`${field} < ?`)
    params.push(range.lt)
  }

  return {wheres, params}
}