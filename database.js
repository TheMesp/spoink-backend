var sqlite3 = require('sqlite3').verbose()
const DBSOURCE = "db/draft_league.db"

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message)
    throw err
  }else{
    var tables = [
      `CREATE TABLE IF NOT EXISTS players(
        id int NOT NULL PRIMARY KEY,
        discord_id varchar(30),
        discord_name varchar(30),
        timezone varchar(10),
        showdown_name varchar(30),
        favourite_pokemon int
      );`,

      `CREATE TABLE IF NOT EXISTS seasons(
        id int NOT NULL PRIMARY KEY,
        season_name varchar(60),
        start_time date,
        end_time date
      );`,

      `CREATE TABLE IF NOT EXISTS conferences(
        season_id int NOT NULL,
        conference varchar(30),
        CONSTRAINT pk PRIMARY KEY (season_id, conference),
        FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE CASCADE
      );`,

      `CREATE TABLE IF NOT EXISTS teams(
        id int PRIMARY KEY,
        player_id int NOT NULL,
        season_id int NOT NULL,
        team_name varchar(60) NOT NULL,
        wins int,
        losses int,
        placement int,
        FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
        FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE CASCADE
      );`,

      `CREATE TABLE IF NOT EXISTS matches(
        id int PRIMARY KEY,
        replay_link varchar(60),
        week int,
        season_id int,
        winner_id int NOT NULL,
        loser_id int NOT NULL,
        FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE CASCADE,
        FOREIGN KEY (winner_id) REFERENCES teams(id) ON DELETE CASCADE,
        FOREIGN KEY (loser_id) REFERENCES teams(id) ON DELETE CASCADE
      )`,

      `CREATE TABLE IF NOT EXISTS pokemon(
        team_id int NOT NULL,
        pokedex_id int,
        kills int,
        CONSTRAINT pk PRIMARY KEY (team_id, pokedex_id),
        FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
      );`,
    ]

    tables.forEach(function(table) {
      db.run(table, function(err) {
        if (err) {
          res.status(500).json({"error":err.message});
          console.log(err.message);
          return;
        }
      });
    });
      
    console.log('Connected to the SQLite database.')
  }
});


module.exports = db