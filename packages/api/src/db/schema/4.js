const run = async (db) => {
  await db.run(`
    ALTER TABLE card ADD COLUMN school VARCHAR(64)
  `)
}

exports.run = run
