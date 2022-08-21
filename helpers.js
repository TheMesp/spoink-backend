const fetch = require('node-fetch');
async function queryPokeAPI(pokedex_id) {
  return fetch(`https://pokeapi.co/api/v2/pokemon/${pokedex_id}`)
}
module.exports = {queryPokeAPI};