const run = async (db) => {
  await db.run(`
    CREATE TABLE IF NOT EXISTS user (
      username VARCHAR(256) NOT NULL,
      password VARCHAR(256) NOT NULL,
      admin BOOLEAN NOT NULL DEFAULT FALSE,
      canRead BOOLEAN NOT NULL DEFAULT TRUE,
      canWrite BOOLEAN NOT NULL DEFAULT FALSE,
      created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      lastLogin TIMESTAMP,
      PRIMARY KEY (username)
    )
  `)
}

exports.run = run
