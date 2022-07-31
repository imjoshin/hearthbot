import { IDatabase } from "./IDatabase"
import sqlite3 from "sqlite3"

export class LocalDatabase implements IDatabase {
  private db

  constructor(path: string) {
    this.db = new sqlite3.Database(path)
  }

  run<T>(sql: string, params?: (string | number | null)[]): Promise<T[]> {
    return new Promise((res, rej) => {
      // TODO errors from here can't be caught for some reason... Fix that!
      const statement = this.db.prepare(sql)
      statement.all(params, (error: Error | null, result: sqlite3.RunResult) => {
        if (error || result && `errno` in result) {
          rej(error || result)
        } else {
          res(result as unknown as T[])
        }
      })
    })
  }
}