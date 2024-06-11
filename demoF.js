function createRecipeCard(recipe) {
  return `
        <div class="recipe-card">
            <img src="recipe/${recipe.image}" alt="${recipe.name}">
            <div class="recipe-details">
                <h2>${recipe.name}</h2>
                <p><strong>Recette:</strong> ${recipe.description}</p>
                <p><strong>Ingrédients:</strong></p>
                <ul class="ingredients">
                    ${recipe.ingredients
                      .map(
                        (ingredient) => `
                        <li>
                            <span>${ingredient.ingredient}</span>
                            <span>${
                              ingredient.quantity ? ingredient.quantity : ""
                            } ${ingredient.unit ? ingredient.unit : ""}</span>
                        </li>
                    `
                      )
                      .join("")}
                </ul>
                <p><strong>Temps:</strong> ${recipe.time} min</p>
                <p><strong>Appareil:</strong> ${recipe.appliance}</p>
                <p><strong>Ustensiles:</strong> ${recipe.ustensils.join(
                  ", "
                )}</p>
            </div>
        </div>
    `;
}

function displayRecipes(recipes) {
  const container = document.getElementById("recipes-container");
  const countElement = document.getElementById("recipes-count");
  container.innerHTML = recipes.map(createRecipeCard).join("");
  countElement.textContent = `${recipes.length} recettes`;
  updateFilters(recipes);
}

function updateFilters(recipes) {
  const ingredients = new Set();
  const appareils = new Set();
  const ustensiles = new Set();

  const addIngredientsFromRecipe = (recipe) =>
    recipe.ingredients.forEach((ingredient) =>
      ingredients.add(ingredient.ingredient)
    );

  const addAppareilFromRecipe = (recipe) => appareils.add(recipe.appliance);

  const addUstensilsFromRecipe = (recipe) =>
    recipe.ustensils.forEach((ustensil) => ustensiles.add(ustensil));

  for (const recipe of recipes) {
    addIngredientsFromRecipe(recipe);
    addAppareilFromRecipe(recipe);
    addUstensilsFromRecipe(recipe);
  }

  updateFilterOptions("ingredients-filter", ingredients);
  updateFilterOptions("appareil-filter", appareils);
  updateFilterOptions("ustensiles-filter", ustensiles);
}

function updateFilterOptions(filterId, items) {
  const filterElement = document.getElementById(filterId);
  filterElement.innerHTML = "";
  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    filterElement.appendChild(option);
  });
}

const filterRecipes = () => {
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

  const filterBySearch = (search) => (recipe) => {
    if (!search) return recipes;

    return (
      recipe.name.toLowerCase().includes(search) ||
      recipe.description.toLowerCase().includes(search) ||
      recipe.ingredients.some((ingredient) =>
        ingredient.ingredient.toLowerCase().includes(search)
      )
    );
  };

  const filterByAppareil = (appareilSelected) => (recipe) => {
    if (!appareilSelected) return recipes;

    return recipe.appliance.toLowerCase() === appareilSelected;
  };

  const filterByUstensils = (ustensilSelected) => (recipe) => {
    if (!ustensilSelected) return recipes;

    return recipe.appliance.toLowerCase().includes(ustensilSelected)
  };

  const filterByIngredients = (ingredientSelected) => (recipe) => {
    if (!ingredientSelected) return recipes;

    return recipe.ingredients.some(({ ingredient }) => {
      return ingredient.toLowerCase() === ingredientSelected;
    });
  };

  //   @todos
  const filteredRecipes = recipes
    .filter(filterBySearch(searchValue))
    .filter(filterByAppareil(appareilSelected))
    .filter(filterByUstensils(ustensilesSelected))
    .filter(filterByIngredients(ingredientsSelected));

  displayRecipes(filteredRecipes);
};

const filterRecipesByLinearSearch = () => {
  // implem linear search
};

const filterRecipesByBinarySearch = () => {
  // implem binary search
};

function advancedSearch() {
  const appareilFilter = document
    .getElementById("appareil-filter")
    .value.toLowerCase();
  const ustensilesFilter = document
    .getElementById("ustensiles-filter")
    .value.toLowerCase();
  const ingredientsFilter = document
    .getElementById("ingredients-filter")
    .value.toLowerCase();

  const filteredRecipes = recipes.filter(
    (recipe) =>
      (appareilFilter === "" ||
        recipe.appliance.toLowerCase().includes(appareilFilter)) &&
      (ustensilesFilter === "" ||
        recipe.ustensils.some((ustensil) =>
          ustensil.toLowerCase().includes(ustensilesFilter)
        )) &&
      (ingredientsFilter === "" ||
        recipe.ingredients.some((ingredient) =>
          ingredient.ingredient.toLowerCase().includes(ingredientsFilter)
        ))
  );
  displayRecipes(filteredRecipes);
}

function toggleDropdown(event) {
  const dropdown = event.target.nextElementSibling;
  dropdown.classList.toggle("active");
}

function filterDropdown(event, filterId) {
  const input = event.target.value.toLowerCase();
  const filterElement = document.getElementById(filterId);
  const options = filterElement.options;
  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    if (option.value.toLowerCase().includes(input)) {
      option.style.display = "";
    } else {
      option.style.display = "none";
    }
  }
}

// Initial display of all recipes
displayRecipes(recipes);

// Event listeners for the search and filters
document.getElementById("main-search").addEventListener("input", filterRecipes);
document
  .getElementById("appareil-filter")
  .addEventListener("change", filterRecipes);
document
  .getElementById("ustensiles-filter")
  .addEventListener("change", filterRecipes);
document
  .getElementById("ingredients-filter")
  .addEventListener("change", filterRecipes);

document
  .getElementById("ingredients-filter-label")
  .addEventListener("click", toggleDropdown);
document
  .getElementById("appareil-filter-label")
  .addEventListener("click", toggleDropdown);
document
  .getElementById("ustensiles-filter-label")
  .addEventListener("click", toggleDropdown);

document
  .getElementById("ingredients-filter-input")
  .addEventListener("input", (event) =>
    filterDropdown(event, "ingredients-filter")
  );
document
  .getElementById("appareil-filter-input")
  .addEventListener("input", (event) =>
    filterDropdown(event, "appareil-filter")
  );
document
  .getElementById("ustensiles-filter-input")
  .addEventListener("input", (event) =>
    filterDropdown(event, "ustensiles-filter")
  );

// Fonction pour afficher les filtres actifs

// ==========================================================================================================

import JSON from './recipes.json';


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
              oninput="filterRecipes()"
            />
            <button type="button" onclick="filterRecipes()">🔍</button>
          </div>
        </div>
      </header>
  `
}

// url param ?filterSearch=xxxx

const Filters = () => {
  return `
  `;
}

// url param ?ustensil=&Aparaeil....

const Recipes = () => {
  // get param (4 params)
  // call search function (4 params + list initial)
  
  return ``;
}


const displayPage = (recipes) => {
  const app = document.querySelector("#app");

  app.innerHTML = `
    ${Header()}  
    ${Filters()}
    ${Recipes()}
  `;
};

(() => {
  displayPage(JSON.recipes);
})();
