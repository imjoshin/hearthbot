const run = async (db) => {
  await db.run(`
    CREATE TABLE IF NOT EXISTS cardSet (
      id VARCHAR(64) PRIMARY KEY NOT NULL,
      fullName VARCHAR(128),
      shortName VARCHAR(16),
      scrapeUrl TEXT,
      releaseDate datetime
    )
  `)

  await db.run(`
    CREATE TABLE IF NOT EXISTS card (
      id VARCHAR(128) PRIMARY KEY NOT NULL,
      artist VARCHAR(128),
      attack INT,
      classes VARCHAR(512),
      collectible BOOLEAN NOT NULL,
      cost INT,
      dbfId INT NOT NULL,
      durability INT,
      health INT,
      mechanics VARCHAR(256),
      rarity VARCHAR(32),
      type VARCHAR(64),
      tribe VARCHAR(64),
      setId VARCHAR(64),
      image TEXT,
      CONSTRAINT FK_setId FOREIGN KEY (setId) REFERENCES cardSet(id)
    )
  `)

  await db.run(`
    CREATE TABLE IF NOT EXISTS cardTranslation (
      id INT NOT NULL AUTO_INCREMENT,
      cardId VARCHAR(128) NOT NULL,
      locale VARCHAR(4) NOT NULL,
      name TEXT,
      search TEXT,
      flavor TEXT,
      \`text\` TEXT,
      CONSTRAINT FK_cardId FOREIGN KEY (cardId) REFERENCES card(id),
      UNIQUE KEY UK_cardId_locale (cardId, locale),
      PRIMARY KEY (id)
    )
  `)
}

exports.run = run
