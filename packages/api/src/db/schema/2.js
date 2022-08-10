const run = async (db) => {
  await db.run(`
    CREATE TABLE IF NOT EXISTS cardSet (
      id VARCHAR(64) PRIMARY KEY NOT NULL,
      fullName VARCHAR(128) NOT NULL,
      shortName VARCHAR(8) NOT NULL,
      releaseDate datetime
    )
  `)

  await db.run(`
    CREATE TABLE IF NOT EXISTS card (
      id VARCHAR(32) PRIMARY KEY NOT NULL,
      artist VARCHAR(128),
      attack INT,
      collectible BOOLEAN NOT NULL,
      cost INT,
      dbfId INT NOT NULL,
      flavor TEXT,
      durability INT,
      health INT,
      mechanics VARCHAR(256),
      name TEXT NOT NULL,
      rarity INT,
      text TEXT,
      type VARCHAR(64),
      setId VARCHAR(64)
    )
  `)

  // TODO add this constraint in once we get sets working
  // CONSTRAINT FK_setId FOREIGN KEY (setId) REFERENCES cardSet(id)

}

exports.run = run
