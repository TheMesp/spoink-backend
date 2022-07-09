var express = require('express');
var router = express.Router();
var db = require("../database.js");

// Middleware for recurring functions
function loadMatch(req, res, next){
  // parseInt sanitizes input, hoo-ray
  var sql = `SELECT * FROM matches WHERE id = ${parseInt(req.params.id)}`
  var params = []
  db.all(sql, params,(err, rows) => {
    if(err){
      next(new Error('Failed to load match ' + req.params.id));
    }else{
      req.match = rows[0];
      next();
    }
  });
}

/* GET matches listing. */
router.get('/', function(req, res, next) {
  console.log("Got a request for matches")
  var sql = "SELECT * FROM matches"
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

/* GET individual match. */
router.get('/:id', loadMatch, function(req, res, next) {
  console.log("Got a request for match")
  if(req.player){
    res.json({
      "message":"success",
      "data":req.match
    })
    
    return;
  }else{
    res.status(404).json({"error":`Match with id ${req.params.id} not found.`});
  }
});

module.exports = router;
