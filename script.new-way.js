// import { getRecipes } from "./api.js";

// import Header from "./components/header.js";
// import Filters from "./components/Filters.js";
// import RecipeCard from "./components/RecipeCard.js";

// import filterRecipes from "./utils/filterRecipes.js";

// import {URL_PARAMS, getFiltersFromURLSearchParams} from './utils/getFiltersFromURLSearchParams.js';

// window.removeActiveFilter = (key, value) => {
//   let currentParams = getFiltersFromURLSearchParams();
//   let dedupedFilterItem = new Set(currentParams?.[key]);
//   const formattedValue = value.trim();

//   if (dedupedFilterItem.has(formattedValue)) {
//     dedupedFilterItem.delete(formattedValue);
//   }

//   const searchParams = new URLSearchParams(window.location.search);
//   searchParams.set(key, Array.from(dedupedFilterItem));

//   const newurl =
//     window.location.protocol +
//     "//" +
//     window.location.host +
//     window.location.pathname +
//     "?" +
//     searchParams.toString();

//   window.location.assign(newurl);
// };

// const ActiveFilters = () => {
//   const currentFilters = getFiltersFromURLSearchParams();

//   const ingredients = currentFilters[URL_PARAMS.INGREDIENTS];
//   const ustensils = currentFilters[URL_PARAMS.USTENSIL];
//   const tools = currentFilters[URL_PARAMS.TOOLS];

//   const createFilterTag = (key, value) => `
//     <div class="active-filter">
//       <span>${value}</span>
//       <button onClick="removeActiveFilter('${key}', '${value}')">×</button>
//     </div>
//   `;

//   return `
//     ${ingredients.map(ingredient => createFilterTag(URL_PARAMS.INGREDIENTS, ingredient)).join("")}
//     ${tools.map(tool => createFilterTag(URL_PARAMS.TOOLS, tool)).join("")}
//     ${ustensils.map(ustensil => createFilterTag(URL_PARAMS.USTENSIL, ustensil)).join("")}
//   `;
// };

// export const displayPage = (recipes) => {
//   const app = document.querySelector("#app");

//   app.innerHTML = `
//       ${Header()}
//       ${Filters(recipes)}
      
//       <div id="active-filters" class="active-filters">
//         ${ActiveFilters()}
//       </div>
      
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
import Filters, { renderActiveFilters } from "./components/Filters.js";
import RecipeCard from "./components/RecipeCard.js";

import filterRecipes from "./utils/filterRecipes.js";

import { URL_PARAMS, getFiltersFromURLSearchParams } from './utils/getFiltersFromURLSearchParams.js';

window.removeActiveFilter = (key, value) => {
  let currentParams = getFiltersFromURLSearchParams();
  let dedupedFilterItem = new Set(currentParams?.[key]);
  const formattedValue = value.trim();

  if (dedupedFilterItem.has(formattedValue)) {
    dedupedFilterItem.delete(formattedValue);
  }

  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set(key, Array.from(dedupedFilterItem));

  if (Array.from(dedupedFilterItem).length === 0) {
    searchParams.delete(key);
  }

  const newurl =
    window.location.protocol +
    "//" +
    window.location.host +
    window.location.pathname +
    "?" +
    searchParams.toString();

  window.location.assign(newurl);
};

const ActiveFilters = () => {
  const currentFilters = getFiltersFromURLSearchParams();

  const ingredients = currentFilters[URL_PARAMS.INGREDIENTS] || [];
  const ustensils = currentFilters[URL_PARAMS.USTENSIL] || [];
  const tools = currentFilters[URL_PARAMS.TOOLS] || [];
  const search = currentFilters[URL_PARAMS.SEARCH];

  const createFilterTag = (key, value) => `
    <div class="active-filter">
      <span>${value}</span>
      <button onClick="removeActiveFilter('${key}', '${value}')">×</button>
    </div>
  `;

  return `
    ${search ? createFilterTag(URL_PARAMS.SEARCH, search) : ''}
    ${ingredients.map(ingredient => createFilterTag(URL_PARAMS.INGREDIENTS, ingredient)).join("")}
    ${tools.map(tool => createFilterTag(URL_PARAMS.TOOLS, tool)).join("")}
    ${ustensils.map(ustensil => createFilterTag(URL_PARAMS.USTENSIL, ustensil)).join("")}
  `;
};

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

  renderActiveFilters(getFiltersFromURLSearchParams());
};

(async () => {
  const initialRecipes = await getRecipes();
  const recipesFiltered = filterRecipes(initialRecipes);

  displayPage(recipesFiltered);
})();

