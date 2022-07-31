export interface IDatabase {
  run<T>(sql: string, params?: (string | number | null)[]): Promise<T[]>
}

export class Database implements IDatabase {
  run<T>(sql: string, params?: (string | number | null)[]): Promise<T[]> {
    return new Promise((res, rej) => {
      rej(`Not yet implemented.`)
    })
  }
}