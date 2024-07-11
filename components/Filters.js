import {
  URL_PARAMS,
  getFiltersFromURLSearchParams,
} from "../utils/getFiltersFromURLSearchParams.js";
import getInfoFromRecipes from "../utils/getInfoFromRecipes.js";

window.handleItemFilterCLicked = (key, value) => {
  let currentParams = getFiltersFromURLSearchParams();

  let dedupedFilterItem = new Set(currentParams?.[key]);
  const formattedValue = value.trim();

  if (dedupedFilterItem.has(formattedValue)) {
    dedupedFilterItem.delete(formattedValue);
  } else {
    dedupedFilterItem.add(formattedValue);
  }

  const searchParams = new URLSearchParams(window.location.search);

  searchParams.set(key, Array.from(dedupedFilterItem));

  const newurl =
    window.location.protocol +
    "//" +
    window.location.host +
    window.location.pathname +
    "?" +
    searchParams.toString();

  window.location.assign(newurl);
};

export const Filter = (name, items, options = {}) => {

  return `  
    <div class="filter">
        <label for="filter-input">${name}</label>
        <div>
            <input type="text" class="filter__input" placeholder="" />
            <div class="filter__list-items" style="display:flex;flex-direction:column;overflow:scroll;height:300px;background-color:white;">
            ${items
              .map(
                (item) =>
                  `<span onClick="handleItemFilterCLicked('${options.key}', '${item}')">${item}</span>`
              )
              .join("")}
            </div>
        </div>
    </div>
    `;
};

export const Filters = (recipes) => {
  const count = recipes.length;

  const infos = getInfoFromRecipes(recipes);

  return `
      <div class="filters-wrapper">
        <div class="filters">
            ${Filter("ingrédients", infos?.[URL_PARAMS.INGREDIENTS], {
              key: URL_PARAMS.INGREDIENTS,
            })}
            ${Filter("Appareils", infos?.[URL_PARAMS.TOOLS], {
              key: URL_PARAMS.TOOLS,
            })}
            ${Filter("Ustensiles", infos?.[URL_PARAMS.USTENSIL], {
              key: URL_PARAMS.USTENSIL,
            })}
        <div id="recipes-count" class="filters__count">${count} recettes</div>
      </div>
      </div>
      <div id="active-filters" class="filters__active"></div>
      <div id="recipes-container" class="filters__recipes"></div>
    `;
};

export default Filters;
