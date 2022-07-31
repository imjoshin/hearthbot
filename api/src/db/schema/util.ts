import path from "path"
import fs from "fs"
import { IDatabase } from "../IDatabase"

export const runUpdates = async (db: IDatabase) => {
  let currentSchema = 0
  try {
    // TODO since errors can't be caught from db, this breaks on new dbs
    const schemaResults = await db.run<{value: string}>(`SELECT value FROM config WHERE name = "schema"`)
    currentSchema = parseInt(schemaResults[0].value)
  } catch (e) {
    // pass through and keep currentSchema at 0 to run first update
  }

  const sqlDir = path.join(__dirname)
  const updatesToRun = fs.readdirSync(sqlDir)
    .filter(f => fs.lstatSync(path.join(sqlDir, f)).isFile() && f.endsWith(`.js`))
    .map(f => parseInt(f.slice(0, -3)))
    .filter(f => f > currentSchema)
    .sort()
  
  for (const update of updatesToRun) {
    console.log(`Running schema update ${update}`)
    const sqlFile = path.join(sqlDir, `${update}.js`)

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const sql = require(sqlFile)

    try {
      await sql.run(db)
      currentSchema = update
    } catch (e) {
      console.log(`TODO: ERRORED`)
      console.log(e)
      break
    }
  }

  await db.run<{value: string}>(`UPDATE config SET value = ? WHERE name = "schema"`, [currentSchema])
}