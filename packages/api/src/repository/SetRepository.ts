import { Set } from "../model/Set"
import { IDatabase } from "../db/IDatabase"

export class SetRepository {
  constructor(private db: IDatabase) {}

  public getSets = async (): Promise<Set[]> => {
    const dbResult = await this.db.run<{[key: string]: any}>(`SELECT * FROM 'set'`)

    return dbResult.map(row => new Set(
      row.id,
      row.fullName,
      row.shortName,
      row.releaseDate,
    ))
  }

  public getSet = async (id: string): Promise<Set> => {
    const dbResult = await this.db.run<{[key: string]: any}>(`SELECT * FROM 'set' WHERE id = ?`, [id])

    if (!dbResult) {
      return null
    }

    return new Set(
      dbResult[0].id,
      dbResult[0].fullName,
      dbResult[0].shortName,
      dbResult[0].releaseDate,
    )
  }
}