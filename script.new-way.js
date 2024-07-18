import { getRecipes } from "./api.js";

import Header from "./components/header.js";
import Filters from "./components/Filters.js";
import RecipeCard from "./components/RecipeCard.js";

import filterRecipes from "./utils/filterRecipes.js";


import getFiltersFromURLSearchParams, {URL_PARAMS} from './utils/getFiltersFromURLSearchParams.js'

const ActiveFilters = () => {
  const currentFilters = getFiltersFromURLSearchParams();

  const ingredients = currentFilters[URL_PARAMS.INGREDIENTS];
  
  return `${ingredients.map(ingredient => `<span>${ingredient}</span>`).join("")}`
};

export const displayPage = (recipes) => {
  const app = document.querySelector("#app");

  app.innerHTML = `
      ${Header()}
      ${Filters(recipes)}
      ${ActiveFilters()}
      <section id="recipes-container">
        ${recipes.map((recipe) => RecipeCard(recipe)).join("")}
      </section>
  `;
};

(async () => {
  const initialRecipes = await getRecipes();

  const recipesFiltered = filterRecipes(initialRecipes);

  displayPage(recipesFiltered);
})();

