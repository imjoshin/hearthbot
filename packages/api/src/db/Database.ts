import mysql from "mysql2"

export class Database {
  public static Name = `Database`

  private pool

  constructor(
    user: string,
    password: string,
    database: string,
    host: string,
  ) {
    this.pool = mysql.createPool({
      user,
      password,
      database,
      host,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0
    })
  }

  run<T>(sql: string, params?: (string | number | boolean | null)[]): Promise<T[]> {
    return new Promise((res, rej) => {
      this.pool.query(sql, params, (error, result) => {
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