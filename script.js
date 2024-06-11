import { getRecipes } from "./api.js";

// Composant pour l'entête de la page
const Header = () => {
  return `
    <header>
      <div class="header-content">
        <h1>Les Petits Plats</h1>
        <div class="search-container">
          <input
            type="text"
            id="main-search"
            placeholder="Recherchez des recettes, ingrédients..."
          />
          <button type="button" id="search-button">🔍</button>
        </div>
      </div>
    </header>
  `;
};

// Composant pour les filtres
const Filters = () => {
  // should not do too many things
  // only should display the filters

  return `
    <div id="active-filters" class="active-filters"></div>
    <div class="filters">
      <div class="filter">
        <label id="ingredients-filter-label" for="ingredients-filter">
          Ingrédients
          <div class="arrow"></div>
        </label>
        <div class="dropdown hidden" id="ingredients-dropdown">
          <input
            type="text"
            id="ingredients-filter-input"
            placeholder="Rechercher..."
          />
          <select id="ingredients-filter" size="10"></select>
        </div>
      </div>
      <div class="filter">
        <label id="appareil-filter-label" for="appareil-filter">
          Appareils
          <div class="arrow"></div>
        </label>
        <div class="dropdown hidden" id="appareil-dropdown">
          <input
            type="text"
            id="appareil-filter-input"
            placeholder="Rechercher..."
          />
          <select id="appareil-filter" size="10"></select>
        </div>
      </div>
      <div class="filter">
        <label id="ustensiles-filter-label" for="ustensiles-filter">
          Ustensiles
          <div class="arrow"></div>
        </label>
        <div class="dropdown hidden" id="ustensiles-dropdown">
          <input
            type="text"
            id="ustensiles-filter-input"
            placeholder="Rechercher..."
          />
          <select id="ustensiles-filter" size="10"></select>
        </div>
      </div>
    </div>
    <div id="recipes-count">0 recettes</div>
    <div id="recipes-container"></div>
  `;
};
// url param ?ustensil=&Aparaeil....

// Fonction pour obtenir les paramètres de l'URL
// get param (4 params)
const getURLParameters = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    search: params.get("filterSearch") || "",
    appareil: params.get("filterAppareil") || "",
    ustensiles: params.get("filterUstensiles") || "",
    ingredients: params.get("filterIngredients") || "",
  };
};

// Fonction pour filtrer les recettes
// call search function (4 params + list initial)
const filterRecipes = (recipes) => {
  /* should use the value from the queryParams (url) */

  const searchValue = document
    .querySelector("#main-search")
    .value.toLowerCase();
  const appareilSelected = document
    .querySelector("#appareil-filter")
    .value.toLowerCase();
  const ustensilesSelected = document
    .querySelector("#ustensiles-filter")
    .value.toLowerCase();
  const ingredientsSelected = document
    .querySelector("#ingredients-filter")
    .value.toLowerCase();

  // const filteredRecipes = recipes.filter((recipe) => {
  //   return (
  //     (searchValue === "" ||
  //       recipe.name.toLowerCase().includes(searchValue) ||
  //       recipe.description.toLowerCase().includes(searchValue) ||
  //       recipe.ingredients.some((ingredient) =>
  //         ingredient.ingredient.toLowerCase().includes(searchValue)
  //       )) &&
  //     (appareilSelected === "" ||
  //       recipe.appliance.toLowerCase() === appareilSelected) &&
  //     (ustensilesSelected === "" ||
  //       recipe.ustensils.some((ustensil) =>
  //         ustensil.toLowerCase().includes(ustensilesSelected)
  //       )) &&
  //     (ingredientsSelected === "" ||
  //       recipe.ingredients.some((ingredient) =>
  //         ingredient.ingredient.toLowerCase().includes(ingredientsSelected)
  //       ))
  //   );
  // });

  /* here is an example of the search with more details and explanation of what it's doing - should do the same for the rest of filters */

  const filterBySearch = (recipe) => {
    if (searchValue.trim() === "") return true;

    if (recipe.name.toLowerCase().includes(searchValue)) return true;

    if (recipe.description.toLowerCase().includes(searchValue)) return true;

    return recipe.ingredients.some((ingredient) =>
      ingredient.ingredient.toLowerCase().includes(searchValue)
    );
    
  };

  const filterByAppliance = (recipe) =>
    recipe.appliance.toLowerCase() === appareilSelected;

  const filteredRecipes = recipes.filter(filterBySearch).filter(filterByAppliance);

  displayRecipes(filteredRecipes); // should be removed when rewritten

  /* wtf should not be there -> maybe move it inside its on utils*/
  updateURLParameters(
    searchValue,
    appareilSelected,
    ustensilesSelected,
    ingredientsSelected
  );
  updateActiveFilters(
    {
      "main-search": searchValue,
      "appareil-filter": appareilSelected,
      "ustensiles-filter": ustensilesSelected,
      "ingredients-filter": ingredientsSelected,
    },
    recipes
  );
};

// Fonction pour afficher les recettes
// display recipes from search function
const displayRecipes = (recipes) => {
  const recipesContainer = document.querySelector("#recipes-container");

  recipesContainer.innerHTML = recipes
    .map((recipe) => createRecipeCard(recipe))
    .join("");
  document.querySelector(
    "#recipes-count"
  ).textContent = `${recipes.length} recettes`;
};

// Fonction pour créer la carte d'une recette
const createRecipeCard = (recipe) => {
  return `
    <div class="recipe-card">
      <img src="recipe/${recipe.image}" alt="${recipe.name}">
      <div class="recipe-details">
        <h2>${recipe.name}</h2>
        <p class="times-recipe">${recipe.time}min</p>
        <p><strong>Recette:</strong> ${recipe.description}</p>
        <p><strong>Ingrédients:</strong></p>
        <ul class="ingredients">
          ${recipe.ingredients
            .map(
              (ingredient) => `
            <li>
              <span>${ingredient.ingredient}</span>
              <span>${ingredient.quantity ? ingredient.quantity : ""} ${
                ingredient.unit ? ingredient.unit : ""
              }</span>
            </li>
          `
            )
            .join("")}
        </ul>
        <p><strong>Appareil:</strong> ${recipe.appliance}</p>
        <p><strong>Ustensiles:</strong> ${recipe.ustensils.join(", ")}</p>
      </div>
    </div>
  `;
};
// Fonction pour mettre à jour les options de filtre dynamiquement
const updateFilterOptions = (recipes) => {
  const appareilSet = new Set();
  const ustensilesSet = new Set();
  const ingredientsSet = new Set();

  recipes.forEach((recipe) => {
    appareilSet.add(recipe.appliance);
    recipe.ustensils.forEach((ustensil) => ustensilesSet.add(ustensil));
    recipe.ingredients.forEach((ingredient) =>
      ingredientsSet.add(ingredient.ingredient)
    );
  });

  populateFilterOptions("#appareil-filter", appareilSet);
  populateFilterOptions("#ustensiles-filter", ustensilesSet);
  populateFilterOptions("#ingredients-filter", ingredientsSet);
};

// Fonction pour remplir les options de filtre
const populateFilterOptions = (selector, items) => {
  const filterElement = document.querySelector(selector);
  filterElement.innerHTML = ""; // Clear existing options
  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    filterElement.appendChild(option);
  });
};
// Fonction pour mettre à jour les filtres actifs
const updateActiveFilters = (filters) => {
  const activeFiltersContainer = document.querySelector("#active-filters");
  activeFiltersContainer.innerHTML = "";

  Object.keys(filters).forEach((key) => {
    if (filters[key]) {
      const filterTag = document.createElement("div");
      filterTag.classList.add("active-filter");
      filterTag.textContent = filters[key];
      const removeButton = document.createElement("button");
      removeButton.textContent = "X";
      removeButton.addEventListener("click", () => {
        document.querySelector(`#${key}`).value = "";
        filterRecipes(recipes);
      });
      filterTag.appendChild(removeButton);
      activeFiltersContainer.appendChild(filterTag);
    }
  });
};

// Fonction pour mettre à jour les paramètres de l'URL en fonction des filtres
const updateURLParameters = (search, appareil, ustensiles, ingredients) => {
  const params = new URLSearchParams();

  if (search) params.append("filterSearch", search);
  if (appareil) params.append("filterAppareil", appareil);
  if (ustensiles) params.append("filterUstensiles", ustensiles);
  if (ingredients) params.append("filterIngredients", ingredients);

  window.history.replaceState(
    {},
    "",
    `${window.location.pathname}?${params.toString()}`
  );
};

// Fonction pour gérer l'ouverture et la fermeture des dropdowns
const toggleDropdown = (labelId, dropdownId) => {
  document.querySelector(labelId).addEventListener("click", () => {
    const dropdown = document.querySelector(dropdownId);
    dropdown.classList.toggle("hidden");
  });
};

// Fonction pour afficher la page entière
const displayPage = (recipes) => {
  const app = document.querySelector("#app");

  app.innerHTML = `
    ${Header()}
    ${Filters()} 
  `;

  /* to be removed */
  updateFilterOptions(recipes); // should be inside the Filters component
  displayRecipes(recipes); // -> should be inside a component called Recipes
};

// Initialisation de la page
document.addEventListener("DOMContentLoaded", async () => {
  const recipes = await getRecipes();

  displayPage(recipes);

  /* to be placed next to its usage e.g component */
  const urlParams = getURLParameters();
  const { search, appareil, ustensiles, ingredients } = urlParams;

  document.querySelector("#main-search").value = urlParams.search;
  document.querySelector("#appareil-filter").value = urlParams.appareil;
  document.querySelector("#ustensiles-filter").value = urlParams.ustensiles;
  document.querySelector("#ingredients-filter").value = urlParams.ingredients;

  /* should be insite its components -> Recipes */

  filterRecipes(recipes); // Filtre les recettes en fonction des paramètres de l'URL

  /* close to its usage */
  document
    .querySelector("#main-search")
    .addEventListener("input", () => filterRecipes(recipes));
  document
    .querySelector("#appareil-filter")
    .addEventListener("change", () => filterRecipes(recipes));
  document
    .querySelector("#ustensiles-filter")
    .addEventListener("change", () => filterRecipes(recipes));
  document
    .querySelector("#ingredients-filter")
    .addEventListener("change", () => filterRecipes(recipes));

  /* close to its usage */
  toggleDropdown("#ingredients-filter-label", "#ingredients-dropdown");
  toggleDropdown("#appareil-filter-label", "#appareil-dropdown");
  toggleDropdown("#ustensiles-filter-label", "#ustensiles-dropdown");
});
