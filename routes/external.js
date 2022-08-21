var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');
const external = require('../helpers')

/* GET pokeAPI data */
router.get('/pokemon/:id', function(req, res, next) {
  external.queryPokeAPI(req.params.id).then((response) => response.json()).then((result) => {
    res.json(result);
  });
});

module.exports = router;
