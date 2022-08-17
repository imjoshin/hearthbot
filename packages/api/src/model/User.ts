export type UserConstructor = {
  username: string,
  password: string,
  admin: boolean,
  canRead: boolean,
  canWrite: boolean,
  lastLogin: string,
}

export class User {
  username: string
  password: string
  admin: boolean
  canRead: boolean
  canWrite: boolean
  lastLogin: string

  constructor(args: UserConstructor) {
    this.username = args.username
    this.password = args.password
    this.admin = args.admin
    this.canRead = args.canRead
    this.canWrite = args.canWrite
    this.lastLogin = args.lastLogin
  }
}