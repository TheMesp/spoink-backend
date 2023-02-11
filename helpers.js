const fetch = require('node-fetch');
var db = require("./database.js");

async function queryPokeAPI(pokedex_id) {
  return fetch(`https://pokeapi.co/api/v2/pokemon/${pokedex_id}`)
}

function postRow(req, res, next) {
  var tablename = req.baseUrl.slice(1);
  var headers = [];
  var values = [];
  
  Object.entries(req.body).forEach(([key, value]) => {
      headers.push(key);
      values.push(value);
  });
  headers = headers.join(', ');
  var insertQuery = values.map((row) => '?').join(', ');
  var sql = `INSERT INTO ${tablename}(${headers}) VALUES (${insertQuery})`
  console.log(sql)
  console.log(values)
  db.run(sql, values, function(err) {
    if (err) {
      res.status(500).json({"error":err.message});
      console.log(err.message);
      next();
      return;
    }
    console.log(`Rows inserted ${this.changes}`);
    res.json({
      "message":"success",
      "changes":this.changes
    })
    next();
  });
}

module.exports = {queryPokeAPI, postRow};