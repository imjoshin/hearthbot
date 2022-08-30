

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

  if (Number.isInteger(range.eq)) {
    wheres.push(`${field} = ?`)
    params.push(range.eq)
  }

  if (Number.isInteger(range.gt)) {
    wheres.push(`${field} > ?`)
    params.push(range.gt)
  }

  if (Number.isInteger(range.gte)) {
    wheres.push(`${field} >= ?`)
    params.push(range.gte)
  }

  if (Number.isInteger(range.lt)) {
    wheres.push(`${field} < ?`)
    params.push(range.lt)
  }

  if (Number.isInteger(range.lte)) {
    wheres.push(`${field} <= ?`)
    params.push(range.lte)
  }

  return {wheres, params}
}