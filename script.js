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
        <h1>Les Petits Plats</h1>
        <div class="search-container">
          <input
            type="text"
            id="main-search"
            class="search-container__input"
            placeholder="Recherchez des recettes, ingrédients..."
          />
          <button type="button" id="search-button" class="search-container__button">🔍</button>
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
          <label id="ingredients-filter-label" for="ingredients-filter">
            Ingrédients
            <div class="filter__arrow">▼</div>
          </label>
          <div class="filter__dropdown hidden" id="ingredients-dropdown">
            <input
              type="text"
              id="ingredients-filter-input"
              class="filter__input"
              placeholder="Rechercher..."
            />
            <select id="ingredients-filter" class="filter__select" size="10" multiple></select>
          </div>
        </div>
        <div class="filter filter--appareil">
          <label id="appareil-filter-label" for="appareil-filter">
            Appareils
            <div class="filter__arrow">▼</div>
          </label>
          <div class="filter__dropdown hidden" id="appareil-dropdown">
            <input
              type="text"
              id="appareil-filter-input"
              class="filter__input"
              placeholder="Rechercher..."
            />
            <select id="appareil-filter" class="filter__select" size="10" multiple></select>
          </div>
        </div>
        <div class="filter filter--ustensiles">
          <label id="ustensiles-filter-label" for="ustensiles-filter">
            Ustensiles
            <div class="filter__arrow">▼</div>
          </label>
          <div class="filter__dropdown hidden" id="ustensiles-dropdown">
            <input
              type="text"
              id="ustensiles-filter-input"
              class="filter__input"
              placeholder="Rechercher..."
            />
            <select id="ustensiles-filter" class="filter__select" size="10" multiple></select>
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

// Fonction pour filtrer les recettes
const filterRecipes = () => {
  const searchValue = document.querySelector("#main-search").value.toLowerCase();
  const applianceSelected = Array.from(document.querySelector("#appareil-filter").selectedOptions).map(option => option.value.toLowerCase());
  const utensilsSelected = Array.from(document.querySelector("#ustensiles-filter").selectedOptions).map(option => option.value.toLowerCase());
  const ingredientsSelected = Array.from(document.querySelector("#ingredients-filter").selectedOptions).map(option => option.value.toLowerCase());

  selectedFilters.search = searchValue;
  selectedFilters.appliances = applianceSelected;
  selectedFilters.utensils = utensilsSelected;
  selectedFilters.ingredients = ingredientsSelected;

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = !searchValue || recipe.name.toLowerCase().includes(searchValue) || recipe.description.toLowerCase().includes(searchValue) || recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(searchValue));
    const matchesAppliances = !applianceSelected.length || applianceSelected.includes(recipe.appliance.toLowerCase());
    const matchesUstensils = !utensilsSelected.length || utensilsSelected.every(ustensil => recipe.ustensils.map(u => u.toLowerCase()).includes(ustensil));
    const matchesIngredients = !ingredientsSelected.length || ingredientsSelected.every(ingredient => recipe.ingredients.map(i => i.ingredient.toLowerCase()).includes(ingredient));

    return matchesSearch && matchesAppliances && matchesUstensils && matchesIngredients;
  });

  displayRecipes(filteredRecipes);
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
        <p class="recipe-card__time"><strong>Temps:</strong> ${recipe.time} min</p>
        <p class="recipe-card__description"><strong>Recette:</strong> ${recipe.description}</p>
        <p class="recipe-card__ingredients"><strong>Ingrédients:</strong></p>
        <ul class="recipe-card__list">
          ${recipe.ingredients.map(ingredient => `
            <li class="recipe-card__list-item">
              <span>${ingredient.ingredient}</span>
              <span>${ingredient.quantity ? ingredient.quantity : ""} ${ingredient.unit ? ingredient.unit : ""}</span>
            </li>
          `).join("")}
        </ul>
        <p class="recipe-card__appliance"><strong>Appareil:</strong> ${recipe.appliance}</p>
        <p class="recipe-card__ustensils"><strong>Ustensiles:</strong> ${recipe.ustensils.join(", ")}</p>
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
  filterElement.innerHTML = ""; // Clear existing options
  items.forEach(item => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
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
          removeButton.textContent = "X";
          removeButton.addEventListener("click", () => {
            // Supprimer le filtre sélectionné
            selectedFilters[key] = selectedFilters[key].filter(v => v !== value);

            // Mettre à jour les options sélectionnées dans le dropdown
            const filterElement = document.querySelector(`#${key}-filter`);
            Array.from(filterElement.options).forEach(option => {
              if (option.value.toLowerCase() === value.toLowerCase()) {
                option.selected = false;
              }
            });

            // Filtrer les recettes après la suppression du filtre
            filterRecipes();
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
        removeButton.textContent = "X";
        removeButton.addEventListener("click", () => {
          if (key === "search") document.querySelector("#main-search").value = "";
          selectedFilters[key] = "";

          filterRecipes();
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
      arrow.textContent = "▲";
    } else {
      arrow.textContent = "▼";
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
    const option = document.querySelector(`#appareil-filter option[value="${appliance}"]`);
    if (option) option.selected = true;
  });
  selectedFilters.appliances = urlParams.appliances;

  urlParams.utensils.forEach(utensil => {
    const option = document.querySelector(`#ustensiles-filter option[value="${utensil}"]`);
    if (option) option.selected = true;
  });
  selectedFilters.utensils = urlParams.utensils;

  urlParams.ingredients.forEach(ingredient => {
    const option = document.querySelector(`#ingredients-filter option[value="${ingredient}"]`);
    if (option) option.selected = true;
  });
  selectedFilters.ingredients = urlParams.ingredients;

  filterRecipes();

  document.querySelector("#main-search").addEventListener("input", filterRecipes);
  document.querySelector("#appareil-filter").addEventListener("change", filterRecipes);
  document.querySelector("#ustensiles-filter").addEventListener("change", filterRecipes);
  document.querySelector("#ingredients-filter").addEventListener("change", filterRecipes);

  toggleDropdown("#ingredients-filter-label", "#ingredients-dropdown");
  toggleDropdown("#appareil-filter-label", "#appareil-dropdown");
  toggleDropdown("#ustensiles-filter-label", "#ustensiles-dropdown");
});
