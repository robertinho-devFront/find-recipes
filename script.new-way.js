
import { getRecipes } from "./api.js";
import Header from "./components/header.js";
import Filters from "./components/Filters.js";
import RecipeCard from "./components/RecipeCard.js";
import filterRecipes from "./utils/filterRecipes.js";
import { URL_PARAMS, getFiltersFromURLSearchParams } from './utils/getFiltersFromURLSearchParams.js';
import ActiveFilters from './components/ActiveFilters.js';

export const displayPage = (recipes) => {
  const app = document.querySelector("#app");

  app.innerHTML = `
      ${Header()}
      ${Filters(recipes)}
      
      <div id="active-filters" class="active-filters">
        ${ActiveFilters()}
      </div>
      
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
