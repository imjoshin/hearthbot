const run = async (db) => {
  await db.run(`
    CREATE TABLE IF NOT EXISTS card (
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
      type INT,
      image TEXT
    )
  `)
}

exports.run = run
