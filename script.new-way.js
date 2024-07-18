// import { getRecipes } from "./api.js";

// import Header from "./components/header.js";
// import Filters from "./components/Filters.js";
// import RecipeCard from "./components/RecipeCard.js";

// import filterRecipes from "./utils/filterRecipes.js";


// import getFiltersFromURLSearchParams, {URL_PARAMS} from './utils/getFiltersFromURLSearchParams.js'

// const ActiveFilters = () => {
//   const currentFilters = getFiltersFromURLSearchParams();

//   const ingredients = currentFilters[URL_PARAMS.INGREDIENTS];
//   const ustensil = currentFilters[URL_PARAMS.USTENSIL];
//   const tools = currentFilters[URL_PARAMS.TOOLS];
//   const search = currentFilters[URL_PARAMS.SEARCH];
  
//   return `${ingredients.map(ingredient => `<span>${ingredient}</span>`).join("")}`
//   return `${tools.map(tools => `<span>${tools}</span>`).join("")}`
//   return `${ustensil.map(ustensil => `<span>${ustensil}</span>`).join("")}`
//   return `${search.map(search => `<span>${search}</span>`).join("")}`
// };

// export const displayPage = (recipes) => {
//   const app = document.querySelector("#app");

//   app.innerHTML = `
//       ${Header()}
//       ${Filters(recipes)}
//       ${ActiveFilters()}
//       <section id="recipes-container">
//         ${recipes.map((recipe) => RecipeCard(recipe)).join("")}
//       </section>
//   `;
// };

// (async () => {
//   const initialRecipes = await getRecipes();

//   const recipesFiltered = filterRecipes(initialRecipes);

//   displayPage(recipesFiltered);
// })();



import { getRecipes } from "./api.js";

import Header from "./components/header.js";
import Filters from "./components/Filters.js";
import RecipeCard from "./components/RecipeCard.js";

import filterRecipes from "./utils/filterRecipes.js";

import getFiltersFromURLSearchParams, { URL_PARAMS } from './utils/getFiltersFromURLSearchParams.js';

const ActiveFilters = () => {
  const currentFilters = getFiltersFromURLSearchParams();

  const ingredients = currentFilters[URL_PARAMS.INGREDIENTS];
  const ustensil = currentFilters[URL_PARAMS.USTENSIL];
  const tools = currentFilters[URL_PARAMS.TOOLS];
  const search = currentFilters[URL_PARAMS.SEARCH];

  return `
    ${ingredients.map(ingredient => `<span>${ingredient}</span>`).join("")}
    ${tools.map(tool => `<span>${tool}</span>`).join("")}
    ${ustensil.map(ust => `<span>${ust}</span>`).join("")}
    ${search ? `<span>${search}</span>` : ''}
  `;
};

export const displayPage = (recipes) => {
  const app = document.querySelector("#app");

  app.innerHTML = `
      ${Header()}
      ${Filters(recipes)}
      <div id="active-filters">
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

