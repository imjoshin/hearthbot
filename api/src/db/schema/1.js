const run = async (db) => {
  const queries = [
    `CREATE TABLE config (name VARCHAR(32) NOT NULL PRIMARY KEY, value TEXT NOT NULL, updated DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, description TEXT, note TEXT );`,
    `INSERT INTO config (name, value) VALUES ("schema", "1")`,
  ]

  for (const query of queries) {
    await db.run(query)
  }
}

exports.run = run
