import { Database } from "./IDatabase"
import mysql from "mysql"

export class RemoteDatabase extends Database {
  private db

  constructor(
    user: string,
    password: string,
    database: string,
    socketPath: string,
  ) {
    super()
    this.db = mysql.createPool({
      user,
      password,
      database,
      socketPath,
    })
  }

  run<T>(sql: string, params?: (string | number | null)[]): Promise<T[]> {
    return new Promise((res, rej) => {
      this.db.query(sql, params, (error, result) => {
        if (error) {
          rej(error)
        } else {
          res(result)
        }
      })
    })
  }
}