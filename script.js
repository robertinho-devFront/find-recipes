import { getRecipes } from "./api.js";

let recipes = [];
let selectedFilters = {
  search: "",
  ingredients: [],
  appliances: [],
  utensils: []
};

// Composant pour l'entête de la page
const Header = () => {
  return `
    <header class="header">
      <div class="header__content">
        <h1 class="title__logo">Les Petits Plats <img src="assets/img/logo.png"></h1>
        <h2 class="subtitle__page">CHERCHEZ PARMI PLUS DE 1500 RECETTES DU QUOTIDIEN, SIMPLES ET DÉLICIEUSES</h2>
        <div class="search-container">
          <input type="text" id="main-search" class="search-container__input" placeholder="Rechercher une recette, un ingrédient, ..." />
          <button type="button" id="search-button" class="search-container__button"><img class="search-container__img" src="assets/img/loupw.png"></button>
        </div>
      </div>
    </header>
  `;
};

// Composant pour les filtres
const Filters = () => {
  return `
    <div class="filters-wrapper">
      <div class="filters">
        <div class="filter filter--ingredients">
          <label id="ingredients-filter-label" for="ingredients-filter-input">Ingrédients <div class="filter__arrow"></div></label>
          <div class="filter__dropdown hidden" id="ingredients-dropdown">
            <input type="text" id="ingredients-filter-input" class="filter__input" placeholder="" />
            <div id="ingredients-filter" class="filter__select"></div>
          </div>
        </div>
        <div class="filter filter--appareil">
          <label id="appareil-filter-label" for="appareil-filter-input">Appareils <div class="filter__arrow"></div></label>
          <div class="filter__dropdown hidden" id="appareil-dropdown">
            <input type="text" id="appareil-filter-input" class="filter__input" placeholder="" />
            <div id="appareil-filter" class="filter__select"></div>
          </div>
        </div>
        <div class="filter filter--ustensiles">
          <label id="ustensiles-filter-label" for="ustensiles-filter-input">Ustensiles <div class="filter__arrow"></div></label>
          <div class="filter__dropdown hidden" id="ustensiles-dropdown">
            <input type="text" id="ustensiles-filter-input" class="filter__input" placeholder="" />
            <div id="ustensiles-filter" class="filter__select"></div>
          </div>
        </div>
      </div>
      <div id="recipes-count" class="filters__count">0 recettes</div>
    </div>
    <div id="active-filters" class="filters__active"></div>
    <div id="recipes-container" class="filters__recipes"></div>
  `;
};

// Fonction pour obtenir les paramètres de l'URL
const getURLParameters = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    search: params.get("filterSearch") || "",
    appliances: params.get("filterAppareil") ? params.get("filterAppareil").split(",") : [],
    utensils: params.get("filterUstensiles") ? params.get("filterUstensiles").split(",") : [],
    ingredients: params.get("filterIngredients") ? params.get("filterIngredients").split(",") : [],
  };
};

// Fonction pour mettre à jour les filtres
const updateFilters = () => {
  const searchValue = document.querySelector("#main-search").value.toLowerCase();
  const applianceSelected = Array.from(document.querySelectorAll("#appareil-filter .selected")).map(option => option.dataset.value.toLowerCase());
  const utensilsSelected = Array.from(document.querySelectorAll("#ustensiles-filter .selected")).map(option => option.dataset.value.toLowerCase());
  const ingredientsSelected = Array.from(document.querySelectorAll("#ingredients-filter .selected")).map(option => option.dataset.value.toLowerCase());

  selectedFilters.search = searchValue;
  selectedFilters.appliances = applianceSelected;
  selectedFilters.utensils = utensilsSelected;
  selectedFilters.ingredients = ingredientsSelected;
  console.log("Selected Filters Updated:", selectedFilters);
};

// Fonction de filtrage natif
const filterRecipesNative = () => {
  updateFilters();
  const matchesFilters = [];
  for (let recipe of recipes) {
    const matchesSearch = !selectedFilters.search || recipe.name.toLowerCase().includes(selectedFilters.search) || recipe.description.toLowerCase().includes(selectedFilters.search) || recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(selectedFilters.search));
    if (!matchesSearch) continue;

    const matchesAppliances = !selectedFilters.appliances.length || selectedFilters.appliances.every(appliance => recipe.appliance.toLowerCase().includes(appliance));
    const matchesUstensils = !selectedFilters.utensils.length || selectedFilters.utensils.every(ustensil => recipe.ustensils.map(u => u.toLowerCase()).includes(ustensil));
    const matchesIngredients = !selectedFilters.ingredients.length || selectedFilters.ingredients.every(ingredient => recipe.ingredients.map(i => i.ingredient.toLowerCase()).includes(ingredient));

    if (matchesAppliances && matchesUstensils && matchesIngredients) {
      matchesFilters.push(recipe);
    }
  }
  displayRecipes(matchesFilters);
  updateActiveFilters();
  updateURLParameters();
};

// Fonction de filtrage linéaire
const filterRecipesLinear = () => {
  updateFilters();
  const matchesFilters = [];
  for (let recipe of recipes) {
    const matchesSearch = !selectedFilters.search || recipe.name.toLowerCase().includes(selectedFilters.search) || recipe.description.toLowerCase().includes(selectedFilters.search) || recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(selectedFilters.search));
    if (!matchesSearch) continue;

    const matchesAppliances = !selectedFilters.appliances.length || selectedFilters.appliances.every(appliance => recipe.appliance.toLowerCase().split(',').includes(appliance));
    const matchesUstensils = !selectedFilters.utensils.length || selectedFilters.utensils.every(ustensil => recipe.ustensils.map(u => u.toLowerCase()).includes(ustensil));
    const matchesIngredients = !selectedFilters.ingredients.length || selectedFilters.ingredients.every(ingredient => recipe.ingredients.map(i => i.ingredient.toLowerCase()).includes(ingredient));

    if (matchesAppliances && matchesUstensils && matchesIngredients) {
      matchesFilters.push(recipe);
    }
  }
  displayRecipes(matchesFilters);
  updateActiveFilters();
  updateURLParameters();
};

// Fonction de recherche binaire
const binarySearch = (arr, target) => {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return true;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return false;
};

// Fonction de filtrage binaire
const filterRecipesBinary = () => {
  updateFilters();
  const matchesFilters = [];
  for (let recipe of recipes) {
    const matchesSearch = !selectedFilters.search || recipe.name.toLowerCase().includes(selectedFilters.search) || recipe.description.toLowerCase().includes(selectedFilters.search) || recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(selectedFilters.search));
    if (!matchesSearch) continue;

    const sortedAppliances = recipe.appliance.toLowerCase().split(',').sort();
    const sortedUstensils = recipe.ustensils.map(u => u.toLowerCase()).sort();
    const sortedIngredients = recipe.ingredients.map(i => i.ingredient.toLowerCase()).sort();

    const matchesAppliances = !selectedFilters.appliances.length || selectedFilters.appliances.every(appliance => binarySearch(sortedAppliances, appliance));
    const matchesUstensils = !selectedFilters.utensils.length || selectedFilters.utensils.every(ustensil => binarySearch(sortedUstensils, ustensil));
    const matchesIngredients = !selectedFilters.ingredients.length || selectedFilters.ingredients.every(ingredient => binarySearch(sortedIngredients, ingredient));

    if (matchesAppliances && matchesUstensils && matchesIngredients) {
      matchesFilters.push(recipe);
    }
  }
  displayRecipes(matchesFilters);
  updateActiveFilters();
  updateURLParameters();
};

// Fonction pour afficher les recettes
const displayRecipes = (recipes) => {
  const recipesContainer = document.querySelector("#recipes-container");
  recipesContainer.innerHTML = recipes.map(recipe => createRecipeCard(recipe)).join("");
  document.querySelector("#recipes-count").textContent = `${recipes.length} recettes`;
};

// Fonction pour créer la carte d'une recette
const createRecipeCard = (recipe) => {
  return `
    <div class="recipe-card">
      <img src="recipe/${recipe.image}" alt="${recipe.name}" class="recipe-card__image">
      <div class="recipe-card__details">
        <h2 class="recipe-card__title">${recipe.name}</h2>
        <p class="recipe-card__time"><strong></strong> ${recipe.time} min</p>
        <p class="recipe-card__description"><strong>Recette</strong> ${recipe.description}</p>
        <p class="recipe-card__ingredients"><strong>Ingrédients</strong> </p>
        <ul class="recipe-card__list">
          ${recipe.ingredients.map(ingredient => `
            <li class="recipe-card__list-item">
              <span>${ingredient.ingredient}</span>
              <span class="ingredient">${ingredient.quantity ? ingredient.quantity : ""} ${ingredient.unit ? ingredient.unit : ""}</span>
            </li>
          `).join("")}
        </ul>
      </div>
    </div>
  `;
};

// Fonction pour mettre à jour les options de filtre dynamiquement
const updateFilterOptions = (recipes) => {
  const applianceSet = new Set();
  const ustensilsSet = new Set();
  const ingredientsSet = new Set();

  recipes.forEach(recipe => {
    applianceSet.add(recipe.appliance);
    recipe.ustensils.forEach(ustensil => ustensilsSet.add(ustensil));
    recipe.ingredients.forEach(ingredient => ingredientsSet.add(ingredient.ingredient));
  });

  populateFilterOptions("#appareil-filter", applianceSet);
  populateFilterOptions("#ustensiles-filter", ustensilsSet);
  populateFilterOptions("#ingredients-filter", ingredientsSet);
};

// Fonction pour remplir les options de filtre
const populateFilterOptions = (selector, items) => {
  const filterElement = document.querySelector(selector);
  filterElement.innerHTML = ""; // Clear 
  items.forEach(item => {
    const option = document.createElement("div");
    option.classList.add("filter__option");
    option.dataset.value = item;
    option.textContent = item;
    option.addEventListener('click', () => {
      option.classList.toggle('selected');
      if (selector === "#ingredients-filter") {
        filterRecipesNative();
      } else if (selector === "#appareil-filter") {
        filterRecipesLinear();
      } else if (selector === "#ustensiles-filter") {
        filterRecipesBinary();
      }
    });
    filterElement.appendChild(option);
  });
};

// Fonction pour mettre à jour les filtres actifs
const updateActiveFilters = () => {
  const activeFiltersContainer = document.querySelector("#active-filters");
  activeFiltersContainer.innerHTML = "";

  Object.entries(selectedFilters).forEach(([key, values]) => {
    if (Array.isArray(values)) {
      values.forEach(value => {
        if (value) {
          const filterTag = document.createElement("div");
          filterTag.classList.add("active-filter");
          filterTag.textContent = value;

          const removeButton = document.createElement("button");
          const img = document.createElement("img");
          img.src = "assets/img/Vector.png"; 
          img.alt = "Supprimer";
          img.style.width = "12px"; 
          removeButton.appendChild(img);
          
          removeButton.addEventListener("click", () => {
            console.log(`J'ai cliqué sur ${key} ${value}`);
            selectedFilters[key] = selectedFilters[key].filter(v => v !== value);
            console.log("Selected Filters Updated after removal:", selectedFilters);

            const filterElement = document.querySelector(`#${key}-filter`);
            if (filterElement) {
              const selectedOption = Array.from(filterElement.querySelectorAll('.filter__option')).find(option => option.dataset.value.toLowerCase() === value.toLowerCase());
              if (selectedOption) {
                selectedOption.classList.remove('selected');
              }
            }

            if (key === "ingredients") {
              filterRecipesNative();
            } else if (key === "appliances") {
              filterRecipesLinear();
            } else if (key === "utensils") {
              filterRecipesBinary();
            }
          });

          filterTag.appendChild(removeButton);
          activeFiltersContainer.appendChild(filterTag);
        }
      });
    } else {
      if (values) {
        const filterTag = document.createElement("div");
        filterTag.classList.add("active-filter");
        filterTag.textContent = values;

        const removeButton = document.createElement("button");
        const img = document.createElement("img");
        img.src = "assets/img/Vector.png"; 
        img.alt = "Supprimer";
        img.style.width = "12px"; 
        removeButton.appendChild(img);
        
        removeButton.addEventListener("click", () => {
          if (key === "search") document.querySelector("#main-search").value = "";
          selectedFilters[key] = "";
          console.log("Selected Filters Updated:", selectedFilters);
          filterRecipesNative(); // Change this to the desired filter function
        });

        filterTag.appendChild(removeButton);
        activeFiltersContainer.appendChild(filterTag);
      }
    }
  });
};

// Fonction pour mettre à jour les paramètres de l'URL en fonction des filtres
const updateURLParameters = () => {
  const params = new URLSearchParams();

  if (selectedFilters.search) params.append("filterSearch", selectedFilters.search);
  if (selectedFilters.appliances.length) params.append("filterAppareil", selectedFilters.appliances.join(","));
  if (selectedFilters.utensils.length) params.append("filterUstensiles", selectedFilters.utensils.join(","));
  if (selectedFilters.ingredients.length) params.append("filterIngredients", selectedFilters.ingredients.join(","));

  window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
};

// Fonction pour gérer l'ouverture et la fermeture des dropdowns
const toggleDropdown = (labelId, dropdownId) => {
  const label = document.querySelector(labelId);
  const dropdown = document.querySelector(dropdownId);

  label.addEventListener("click", () => {
    dropdown.classList.toggle("filter__dropdown--active");
    const arrow = label.querySelector(".filter__arrow");
    if (dropdown.classList.contains("filter__dropdown--active")) {
      arrow.classList.add("filter__arrow--up");
    } else {
      arrow.classList.remove("filter__arrow--up");
    }
  });
};

// Fonction pour afficher la page entière
const displayPage = (recipes) => {
  const app = document.querySelector("#app");
  app.innerHTML = `${Header()} ${Filters()}`;
  updateFilterOptions(recipes);
  displayRecipes(recipes);
};

// Initialisation de la page
document.addEventListener("DOMContentLoaded", async () => {
  recipes = await getRecipes();
  displayPage(recipes);
  const urlParams = getURLParameters();

  document.querySelector("#main-search").value = urlParams.search;
  selectedFilters.search = urlParams.search;

  urlParams.appliances.forEach(appliance => {
    const option = document.querySelector(`#appareil-filter .filter__option[data-value="${appliance}"]`);
    if (option) option.classList.add("selected");
  });
  selectedFilters.appliances = urlParams.appliances;

  urlParams.utensils.forEach(ustensil => {
    const option = document.querySelector(`#ustensiles-filter .filter__option[data-value="${ustensil}"]`);
    if (option) option.classList.add("selected");
  });
  selectedFilters.utensils = urlParams.utensils;

  urlParams.ingredients.forEach(ingredient => {
    const option = document.querySelector(`#ingredients-filter .filter__option[data-value="${ingredient}"]`);
    if (option) option.classList.add("selected");
  });
  selectedFilters.ingredients = urlParams.ingredients;

  filterRecipesNative();

  document.querySelector("#main-search").addEventListener("input", filterRecipesNative);
  document.querySelector("#appareil-filter-input").addEventListener("input", () => filterOptions('appareil'));
  document.querySelector("#ustensiles-filter-input").addEventListener("input", () => filterOptions('ustensiles'));
  document.querySelector("#ingredients-filter-input").addEventListener("input", () => filterOptions('ingredients'));

  toggleDropdown("#ingredients-filter-label", "#ingredients-dropdown");
  toggleDropdown("#appareil-filter-label", "#appareil-dropdown");
  toggleDropdown("#ustensiles-filter-label", "#ustensiles-dropdown");
});

// Fonction pour filtrer les options dans les dropdowns
const filterOptions = (filterType) => {
  const input = document.querySelector(`#${filterType}-filter-input`).value.toLowerCase();
  const options = document.querySelectorAll(`#${filterType}-filter .filter__option`);
  options.forEach(option => {
    if (option.dataset.value.toLowerCase().includes(input)) {
      option.style.display = 'block';
    } else {
      option.style.display = 'none';
    }
  });
};
