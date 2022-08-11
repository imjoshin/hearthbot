

export type RangeInput = {
  eq?: number,
  lt?: number,
  lte?: number,
  gt?: number,
  gte?: number,
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

  if (range.gte) {
    wheres.push(`${field} >= ?`)
    params.push(range.gte)
  }

  if (range.lt) {
    wheres.push(`${field} < ?`)
    params.push(range.lt)
  }

  if (range.lte) {
    wheres.push(`${field} <= ?`)
    params.push(range.lte)
  }

  return {wheres, params}
}