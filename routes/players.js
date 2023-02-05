var express = require('express');
var router = express.Router();
var db = require("../database.js");

// Middleware for recurring functions
function loadPlayer(req, res, next){
  // parseInt sanitizes input, hoo-ray
  var sql = `SELECT * FROM players WHERE id = ${parseInt(req.params.playerid)}`
  var params = []
  db.all(sql, params,(err, rows) => {
    if(err){
      next(new Error('Failed to load user ' + req.params.playerid));
    }else{
      req.player = rows[0];
      next();
    }
  });
}

/* GET players listing. */
router.get('/', function(req, res, next) {
  console.log("Got a request for players")
  var sql = "SELECT * FROM players"
  var params = []
  db.all(sql, params,(err, rows) => {
    if(err){
      res.status(500).json({"error":err.message});
      return;
    }
    console.log(rows);
    res.json({
      "message":"success",
      "data":rows
    })
  });
});

/* GET individual player. */
router.get('/:playerid', loadPlayer, function(req, res, next) {
  console.log("Got a request for player")
  if(req.player){
    res.json({
      "message":"success",
      "data":req.player
    })
    
    return;
  }else{
    res.status(404).json({"error":`Player with id ${req.params.playerid} not found.`});
  }
});

/* GET individual player's matches. */
router.get('/:playerid/matches', loadPlayer, function(req, res, next) {
  console.log("Got a request for player matches")
  var sql = `SELECT * FROM matches WHERE loser_id=${req.params.playerid} OR winner_id=${req.params.playerid}`
  var params = []
  db.all(sql, params,(err, rows) => {
    if(err){
      res.status(500).json({"error":err.message});
      return;
    }
    console.log(rows);
    res.json({
      "message":"success",
      "data":rows
    })
  });
});

/* GET individual player's teams. */
router.get('/:playerid/teams', loadPlayer, function(req, res, next) {
  console.log("Got a request for player teams")
  var sql = `SELECT * FROM teams WHERE player_id=${req.params.playerid}`
  var params = []
  db.all(sql, params,(err, rows) => {
    if(err){
      res.status(500).json({"error":err.message});
      return;
    }
    console.log(rows);
    res.json({
      "message":"success",
      "data":rows
    })
  });
});

/* POST player data */
router.post('/', function(req, res, next) {
  console.log(`Uploading player ${JSON.stringify(req.body)}`);
  var headers = [];
  var values = [];
  
  Object.entries(req.body).forEach(([key, value]) => {
      headers.push(key);
      values.push(value);
  });
  headers = headers.join(', ');
  var insertQuery = values.map((row) => '?').join(', ');
  var sql = `INSERT INTO players(${headers}) VALUES (${insertQuery})`
  console.log(sql)
  console.log(values)
  db.run(sql, values, function(err) {
    if (err) {
      res.status(500).json({"error":err.message});
      console.log(err.message);
      return;
    }
    console.log(`Rows inserted ${this.changes}`);
    res.json({
      "message":"success",
      "changes":this.changes
    })
  });
  // var sql = "INSERT INTO #{tablename}(#{headers.join(', ')}) VALUES (#{Array.new(headers.size, '?').join(', ')})"
  // var params = []
  // db.all(sql, params,(err, rows) => {
  //   if(err){
  //     res.status(500).json({"error":err.message});
  //     return;
  //   }
  //   console.log(rows);
  //   res.json({
  //     "message":"success"
  //   })
  // });
});

module.exports = router;
