export interface IDatabase {
  run<T>(sql: string, params?: (string | number | null)[]): Promise<T[]>
}