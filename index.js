import { url } from "./api/api.js";
let container = document.querySelector(".pokemons");
let selectPage = document.querySelector("#limit");
let navigation = document.querySelector(".navigation .numbers");

let prevLink = "";
let nextLink = "";
let count = 0;
let perPage = 40;
let currentPage = 0;

// Utilizar window ao inves de const para executar funções chamadas no html, isso é por causa do type="module" colocada para chamar o js
// Esta é uma medida de segurança introduzida com módulos ES6 para evitar poluir o escopo global acidentalmente. Portanto, ao usar módulos ES6, você deve ser explícito sobre quais variáveis ou funções deseja expor globalmente usando window.
window.changePg = (value) => {
  let newUrl = `${url}pokemon?limit=${value}`;
  perPage = value;
  getPokemons(newUrl);
};

window.prev = () => {
  getPokemons(prevLink);
};

window.next = () => {
  getPokemons(nextLink);
};

const getPokemons = (url) => {
  let params = new URLSearchParams(url.split("?")[1]);
  let offset = params.get("offset");
  currentPage = offset / perPage;

  fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      prevLink = responseJson.previous;
      nextLink = responseJson.next;
      count = responseJson.count;
      addNumbers(count);
      showPokemons(responseJson.results);
    });
};

const showPokemons = (array) => {
  clearPokemons();
  array.map((item) => {
    fetch(item.url)
      .then((response) => response.json())
      .then((data) => {
        loadCard(data);
      });
  });
};
const loadCard = (data) => {
  const image = data.sprites.other.home.front_default;
  const imageAlternative = data.sprites.other["official-artwork"].front_default;
  let newImage = image
    ? image
    : imageAlternative
    ? imageAlternative
    : "./assets/pokemon.png";
  let card = document.createElement("div");
  card.setAttribute("id", "pokemon-card");
  let content = `
        <img src="${newImage}" alt="${data.name}">
        <p>${data.name}</p>
        <p class="order"> #${data.order}</p>
    `;
  card.innerHTML = content;
  container.appendChild(card);

  card.addEventListener('click', () => {
    showPokemonInfo(data, newImage);
    openModal();
  });
};

const clearPokemons = () => (container.innerHTML = "");

const clearNumbers = () => (navigation.innerHTML = "");

window.actionNumber = (index) => {
  const newLink = `https://pokeapi.co/api/v2/pokemon?offset=${
    index * perPage
  }&limit=${perPage}`;
  getPokemons(newLink);
};

const addNumbers = (count) => {
  clearNumbers();
  const pages = count / perPage;
  for (let index = 0; index < pages; index++) {
    let number = document.createElement("span");
    number.classList.add(`element-${index}`);
    const numLink = `<button onclick="actionNumber(${index})">${
      index + 1
    }</button>`;
    number.innerHTML = numLink;
    navigation.appendChild(number);
  }
  addFocusClass();
};

const addFocusClass = () => {
  const span = document.querySelector(`.element-${currentPage}`);
  span.classList.add("current");
};

getPokemons(`${url}pokemon?offset=0&limit=40`);

// Modal
window.openModal = () => {
    document.getElementById("modal").classList.add("active");
};

const typePokemonBackground = (type) => {
  let backgroundType = ""; 
  if (type == "ice" || type == "water") {
    backgroundType = "./assets/elementos/elemento-agua.png";
  } 
  else if (type == "rock" || type == "ground" || type == "fighting") {
    backgroundType = "./assets/elementos/elemento-luta.png";
  }
  else if (type == "grass" || type == "bug") {
    backgroundType = "./assets/elementos/elemento-planta.png";
  }
  else if (type == "poison" || type == "psychic") {
    backgroundType = "./assets/elementos/elemento-psiquico.png";
  }
  else if (type == "dark" || type == "ghost") {
    backgroundType = "./assets/elementos/elemento-obscuro.png";
  }
  else if (type == "fairy") {
    backgroundType = "./assets/elementos/elemento-fada.png";
  }
  else if (type == "fire") {
    backgroundType = "./assets/elementos/elemento-fogo.png";
  }
  else if (type == "electric") {
    backgroundType = "./assets/elementos/elemento-eletricidade.png";
  }
  else if (type == "dragon") {
    backgroundType = "./assets/elementos/elemento-dragao.png";
  }
  else if (type == "steel") {
    backgroundType = "./assets/elementos/elemento-metal.png";
  }
  else {
    backgroundType = "./assets/elementos/elemento-neutro.png";
  }
  return backgroundType;
};

const showPokemonInfo = (data, newImage) => {
  let pokemonType = data.types[0].type.name

  let typeCard = typePokemonBackground(pokemonType);

  const modalContent = document.querySelector(".modal-info");
  modalContent.innerHTML = ""
  const div = document.createElement("div");
  div.classList.add("content-info");

  
  let statsArray = data.stats.map((item) => {
    return `
      <div class="progress-bar">
        <p>${item.stat.name}: ${item.base_stat}</p>
      </div>
    `;
  }).join("");

  let content = `
      <img class="energy-background" src="${typeCard}">
      <img class="pokemon-image" src="${newImage}">
      <span>
        <p>${data.name}</p>
        <p class="order"> #${data.order}</p>
      </span>
      <div class="pokemon-info">
        ${statsArray}
      </div>
  `;

  div.innerHTML = content;
  modalContent.appendChild(div);
  
  const progressBars = document.querySelectorAll(".progress-bar");
  data.stats.forEach((item, index) => {
    if (progressBars[index]) {
      const progressBar = progressBars[index];
      progressBar.style.setProperty('--progress', item.base_stat);
    }
  });
};

window.closeModal = () => {
  document.getElementById("modal").classList.remove("active");
};

document.getElementById("modalClose").addEventListener("click", closeModal);