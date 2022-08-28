import { Database } from "../db/Database"
import { User, UserConstructor } from "../model/User"

export class UserRepository {
  public static Name = `UserRepository`

  constructor(private db: Database) {}

  public hasAdmins = async (): Promise<boolean> => {
    const dbResult = await this.db.run<{count: number}>(`SELECT COUNT(username) as count FROM user WHERE admin = TRUE`)
    return dbResult && dbResult[0].count > 0
  }

  public getUser = async (username: string): Promise<User> => {
    const dbResult = await this.db.run<UserConstructor>(
      `SELECT * FROM user WHERE username = ?`, 
      [username]
    )

    if (!dbResult?.length) {
      throw new Error(`Invalid user`)
    }

    return new User(dbResult[0])
  }

  public getUsers = async (): Promise<User[]> => {
    const dbResult = await this.db.run<UserConstructor>(`SELECT * FROM user`)

    return dbResult.map(row => new User(row))
  }

  public updateUserLogin = async (username: string): Promise<void> => {
    await this.db.run<UserConstructor>(`UPDATE user SET lastLogin=NOW() WHERE username = ?`, [username])
  } 

  public upsertUser = async (user: User) => {
    const params = [
      user.username, 
      user.password, 
      user.admin || false, 
      user.canRead !== false ? true : false, 
      user.canWrite || false, 
      user.lastLogin,
    ]
    const query = `
    INSERT INTO user 
    (username, password, admin, canRead, canWrite, lastLogin) 
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    username = ?,
    password = ?,
    admin = ?,
    canRead = ?,
    canWrite = ?,
    lastLogin = ?
    `
    await this.db.run(query, [...params, ...params])
  }
}