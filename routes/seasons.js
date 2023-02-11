var express = require('express');
var router = express.Router();
var db = require("../database.js");
var external = require("../helpers");

// Middleware for recurring functions
function loadSeason(req, res, next){
  // parseInt sanitizes input, hoo-ray
  var sql = `SELECT * FROM seasons WHERE id = ${parseInt(req.params.id)}`
  var params = []
  db.all(sql, params,(err, rows) => {
    if(err){
      next(new Error('Failed to load season ' + req.params.id));
    }else{
      req.season = rows[0];
      next();
    }
  });
}

/* GET seasons listing. */
router.get('/', function(req, res, next) {
  console.log("Got a request for seasons")
  var sql = "SELECT * FROM seasons"
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

/* GET individual season. */
router.get('/:id', loadSeason, function(req, res, next) {
  console.log("Got a request for season")
  if(req.season){
    res.json({
      "message":"success",
      "data":req.season
    })
    
    return;
  }else{
    res.status(404).json({"error":`Season with id ${req.params.id} not found.`});
  }
});

/* GET teams in a season. */
router.get('/:id/teams', function(req, res, next) {
  
  console.log("Got a request for season teams")
  var sql = `SELECT * FROM teams WHERE season_id = ${parseInt(req.params.id)}`
  var params = []
  db.all(sql, params,(err, rows) => {
    if(err){
      res.status(500).json({"error":err.message});
      return;
    }
    res.json({
      "message":"success",
      "data":rows
    })
  });
});

/* POST seasons data */
router.post('/', external.postRow, function(req, res, next) {});

module.exports = router;
