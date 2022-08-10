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
      durability INT,
      health INT,
      mechanics VARCHAR(256),
      rarity INT,
      type VARCHAR(64),
      setId VARCHAR(64)
    )
  `)

  await db.run(`
    CREATE TABLE IF NOT EXISTS cardTranslation (
      id INT NOT NULL AUTO_INCREMENT,
      cardId VARCHAR(32) NOT NULL,
      locale VARCHAR(4) NOT NULL,
      name TEXT,
      flavor TEXT,
      \`text\` TEXT,
      CONSTRAINT FK_cardId FOREIGN KEY (cardId) REFERENCES card(id),
      UNIQUE KEY UK_cardId_locale (cardId, locale),
      PRIMARY KEY (id)
    )
  `)

  // TODO add this constraint in once we get sets working
  // CONSTRAINT FK_setId FOREIGN KEY (setId) REFERENCES cardSet(id)

}

exports.run = run
