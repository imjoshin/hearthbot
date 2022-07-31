const run = async (db) => {
  await db.run(`
    CREATE TABLE card (
      id VARCHAR(32) PRIMARY KEY NOT NULL,
      artist VARCHAR(128),
      attack INT,
      collectible BOOLEAN NOT NULL,
      cost INT,
      dbfid INT NOT NULL,
      flavor TEXT,
      health INT,
      name TEXT NOT NULL,
      rarity INT,
      text TEXT,
      type INT
    )
  `)
}

exports.run = run
