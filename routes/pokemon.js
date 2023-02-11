var express = require('express');
var router = express.Router();
var db = require("../database.js");
var external = require("../helpers");

/* GET pokemon listing. */
router.get('/', function(req, res, next) {
  console.log("Got a request for pokemon")
  var sql = "SELECT * FROM pokemon"
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

/* POST pokemon data */
router.post('/', external.postRow, function(req, res, next) {});

module.exports = router;