var express = require('express');
var router = express.Router();
var db = require("../database.js");
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

module.exports = router;
