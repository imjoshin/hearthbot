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
      dbfId VARCHAR(64) NOT NULL,
      flavor TEXT,
      health INT,
      name TEXT NOT NULL,
      rarity INT,
      text TEXT,
      type INT,
      image TEXT,
      tile TEXT,
      setId VARCHAR(64),
      CONSTRAINT FK_setId FOREIGN KEY (setId) REFERENCES cardSet(id)
    )
  `)

  /*
INSERT INTO 'set' (id, fullName, shortName) VALUES ("set1", "Set 1 Full Name", "s1");
INSERT INTO 'set' (id, fullName, shortName) VALUES ("set2", "Set 2 Full Name", "s2");
INSERT INTO card (id, collectible, dbfId, name, setId) VALUES ("id1", True, "dbf1", "Card Name 1", "SET1");
INSERT INTO card (id, collectible, dbfId, name, setId) VALUES ("id2", True, "dbf2", "Card Name 2", "SET1");
INSERT INTO card (id, collectible, dbfId, name, setId) VALUES ("id3", True, "dbf3", "Card Name 3", "SET2");
  */
}

exports.run = run
