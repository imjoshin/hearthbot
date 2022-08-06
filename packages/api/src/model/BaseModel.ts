export class BaseModel {
  constructor(private requiredFields: string[]) {}

  public validate() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const missing = this.requiredFields.filter(field => !this[field])
    console.log({r: this.requiredFields, missing})
    if (missing.length) {
      throw new Error(`Missing required fields ${missing.join(`, `)}`)
    }
  }
}