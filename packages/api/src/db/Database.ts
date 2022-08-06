import mysql from "mysql2"

export class Database {
  private db

  constructor(
    user: string,
    password: string,
    database: string,
    host: string,
  ) {
    this.db = mysql.createConnection({
      user,
      password,
      database,
      host,
    })
  }

  run<T>(sql: string, params?: (string | number | boolean | null)[]): Promise<T[]> {
    return new Promise((res, rej) => {
      this.db.query(sql, params, (error, result) => {
        if (error) {
          rej(error)
        } else {
          // TODO hacky types gross
          res(result as unknown as T[])
        }
      })
    })
  }
}