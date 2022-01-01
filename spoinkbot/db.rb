# David "Mesp" Loewen
# DB accessor file

require "sqlite3"

def opendb
	return SQLite3::Database.new "db/draft_league.db"
end

# DELETES THE DATABASE, then recreates it
def setup
	db = opendb
	db.execute <<-SQL
		CREATE TABLE IF NOT EXISTS players(
			id varchar(30) NOT NULL PRIMARY KEY
		);
	SQL
	db.execute <<-SQL
		CREATE TABLE IF NOT EXISTS seasons(
			id int NOT NULL PRIMARY KEY,
			starttime date,
			endtime date
		);
	SQL
	db.execute <<-SQL
		CREATE TABLE IF NOT EXISTS player_records(
			playerid varchar(30) NOT NULL,
			seasonid int NOT NULL,
			teamname varchar(30),
			wins int,
			losses int,
			placement int,
			CONSTRAINT pk PRIMARY KEY (playerid, seasonid),
			FOREIGN KEY (playerid) REFERENCES players(id) ON DELETE CASCADE,
			FOREIGN KEY (seasonid) REFERENCES seasons(id) ON DELETE CASCADE
		);
	SQL
	# TODO
	db.execute <<-SQL
		CREATE TABLE IF NOT EXISTS pokemon(
			playerid varchar(30) NOT NULL,
			seasonid int NOT NULL,
			pokeid int,
			kills int,
			CONSTRAINT pk PRIMARY KEY (playerid, seasonid, pokeid),
			FOREIGN KEY (playerid) REFERENCES players(id) ON DELETE CASCADE,
			FOREIGN KEY (seasonid) REFERENCES seasons(id) ON DELETE CASCADE
		);
	SQL
end
setup