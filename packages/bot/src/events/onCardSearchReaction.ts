import { Database, Statement } from "sqlite3"

type dbfIdQueryResult = {dbfId: number}
export const onCardSearchReaction = async (authorId: string, messageId: string, number: number, db: Database) => {
  const query = `SELECT dbfId FROM searchResults WHERE authorId = ? AND messageId = ? AND number = ?`
  const params = [authorId, messageId, number]
  console.log({query, params})

  const queryResult: dbfIdQueryResult[] = await new Promise((res, rej) => {
    db.all(
      query, 
      params, 
      (err: Error | null, rows: dbfIdQueryResult[]) => {
        err ? rej(err) : res(rows)
      }
    )
  })

  if (queryResult && queryResult.length) {
    const { dbfId } = queryResult[0]

    // delete to not trigger twice
    // db.run(`DELETE FROM searchResults WHERE authorId = ? AND messageId = ? AND number = ?`, [authorId, messageId, number])
  
    console.log({dbfId})
  }
}