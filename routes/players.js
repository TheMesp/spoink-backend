var express = require('express');
var router = express.Router();
var db = require("../database.js");

// Middleware for recurring functions
function loadPlayer(req, res, next){
  // parseInt sanitizes input, hoo-ray
  var sql = `SELECT * FROM players WHERE id = ${parseInt(req.params.id)}`
  var params = []
  db.all(sql, params,(err, rows) => {
    if(err){
      next(new Error('Failed to load user ' + req.params.id));
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
router.get('/:id', loadPlayer, function(req, res, next) {
  console.log("Got a request for player")
  if(req.player){
    res.json({
      "message":"success",
      "data":req.player
    })
    
    return;
  }else{
    res.status(404).json({"error":`Player with id ${req.params.id} not found.`});
  }
});

module.exports = router;
