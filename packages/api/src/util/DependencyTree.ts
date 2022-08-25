export class DependencyTree {
  private dependencyMap: {[key: string]: object}
  constructor() {
    this.dependencyMap = {}
  }

  private getClassName<T extends new(...args: any) => InstanceType<T>>(classType: T): string {
    const match = classType.toString().match(/class ([$a-zA-Z0-9]+)/)

    if (!match) {
      throw new Error(`We couldn't find the name of ${classType.toString()}`)
    }

    return match[1]
  }

  public register<T extends new(...args: any) => InstanceType<T>>(classType: T, classInstance: any) {
    const className = this.getClassName(classType)
    this.dependencyMap[className] = classInstance
  }

  public get<T extends new(...args: any) => InstanceType<T>>(classType: T): InstanceType<T> {
    const className = this.getClassName(classType)
    return this.dependencyMap[className] as InstanceType<T>
  }
}