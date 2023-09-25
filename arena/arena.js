import { pokeUrl } from './api/api.js';

async function getPokemons() {
  const response = await fetch(pokeUrl);
  const data = await response.json();
  const pokemons = data.results;
  return pokemons;
}

async function getEachPokemon(pokemonUrl) {
  const response = await fetch(pokemonUrl);
  const data = await response.json()
  return data;
}

function createDiv(name, imgUrl) {
  const showPokemonsDiv = document.getElementById('show-pokemons');
  const div = document.createElement('div');
  const nameSpan = document.createElement('span');
  const img = document.createElement('img');

  nameSpan.innerText = name;
  img.src = imgUrl;

  div.appendChild(img); 
  div.appendChild(nameSpan);

  showPokemonsDiv.appendChild(div); 
}

async function Pokemons() {
  const pokemons = await getPokemons();

  console.log(pokemons);

  pokemons.map(async (item) => {
    const pokemonUrl = item.pokeUrl;
    const pokemon = await getEachPokemon(pokemonUrl);
    createDiv(pokemon.name, pokemon.sprites.front_default);
  })
}

Pokemons();