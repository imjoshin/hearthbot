const run = (db) => {
  const queries = [
    `CREATE TABLE card (id TEXT, name TEXT);`,
    `INSERT INTO card(id, name) VALUES ("ID_1", "Some card 1");`,
    `INSERT INTO card(id, name) VALUES ("ID_2", "Some card 2");`,
    `INSERT INTO card(id, name) VALUES ("ID_3", "Some card 3");`,
    `INSERT INTO card(id, name) VALUES ("ID_4", "Some card 4");`,
    `INSERT INTO card(id, name) VALUES ("ID_5", "Some card 5");`
  ]

  for (const query of queries) {
    db.run(query, (err) => {
      if(err) throw err
    })
  }
}

exports.run = run
