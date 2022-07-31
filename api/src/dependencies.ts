import path from "path"
import { LocalDatabase } from "./db/LocalDatabase"
import { RemoteDatabase } from "./db/RemoteDatabase"
import { Database } from "./db/IDatabase"

class DependencyTree {
  private dependencyMap: {[key: string]: object}
  constructor() {
    this.dependencyMap = {}
  }

  private getClassName<T extends new(...args: any) => InstanceType<T>>(classType: T): string {
    const match = classType.toString().match(/class ([a-zA-Z]+)/)

    if (!match) {
      throw new Error(`We couldn't find the name of ${classType.toString()}`)
    }

    return match[1]
  }

  public register<T extends new(...args: any) => InstanceType<T>>(classInstance: any, classType?: T) {
    const className = this.getClassName(classType || classInstance)
    this.dependencyMap[className] = classInstance
  }

  public get<T extends new(...args: any) => InstanceType<T>>(classType: T): InstanceType<T> {
    const className = this.getClassName(classType)
    return this.dependencyMap[className] as InstanceType<T>
  }
}

export const getDependencies = () => {
  const database = process.env.NODE_ENV === `development`
    ? new LocalDatabase(path.join(__dirname, `..`, `..`, `local.db`))
    : new RemoteDatabase(
      process.env.DB_USER,
      process.env.DB_PASS,
      process.env.DB_NAME,
      `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
    )

  const dependencies = new DependencyTree()
  dependencies.register(database, Database)

  return dependencies
}