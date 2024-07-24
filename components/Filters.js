// import {
//   URL_PARAMS,
//   getFiltersFromURLSearchParams
// } from "../utils/getFiltersFromURLSearchParams.js";
// import getInfoFromRecipes from "../utils/getInfoFromRecipes.js";
// import { filterRecipesNative, filterRecipesLinear, filterRecipesBinary } from "../utils/filterRecipes.js";
// import { getRecipes } from "../api.js";
// import RecipeCard from "../components/RecipeCard.js";


// window.handleItemFilterClicked = (key, value) => {
//   let currentParams = getFiltersFromURLSearchParams();
//   let dedupedFilterItem = new Set(currentParams?.[key]);
//   const formattedValue = value.trim();

//   if (dedupedFilterItem.has(formattedValue)) {
//     dedupedFilterItem.delete(formattedValue);
//   } else {
//     dedupedFilterItem.add(formattedValue);
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


// window.toggleFilterInput = (event) => {
//   const label = event.currentTarget;
//   const arrow = label.querySelector('.filter__arrow');
//   const filterInput = label.nextElementSibling;

//   if (arrow && filterInput) {
//     arrow.classList.toggle('rotated');
//     filterInput.classList.toggle('visible');
//   }
// };

// window.filterList = (event) => {
//   const input = event.target;
//   const filter = input.value.toLowerCase();
//   const items = input.nextElementSibling.querySelectorAll('.filter__option');
  
//   items.forEach((item) => {
//     const text = item.textContent.toLowerCase();
//     if (text.includes(filter)) {
//       item.style.display = "";
//     } else {
//       item.style.display = "none";
//     }
//   });
// };

// export const Filter = (nom, items, options = {}) => {
//   const currentFilters = getFiltersFromURLSearchParams();
//   const selectedItems = new Set(currentFilters[options.key] || []);

//   return `  
//     <div class="filter">
//       <div class="filter-choice">
//         <label id="appareil-filter-label" for="filter-input" onClick="toggleFilterInput(event)">
//           ${nom}
//           <div class="filter__arrow"></div>
//         </label>
//         <div class="wrapper__filter--input">
//             <input type="text" class="filter__input" placeholder="Search..." oninput="filterList(event)" />
//             <div class="filter__list-items">
//             ${items
//               .map(
//                 (item) =>
//                   `<span class="filter__option${selectedItems.has(item) ? ' selected' : ''}" onClick="handleItemFilterClicked('${options.key}', '${item}'); markAsSelected(event);">${item}</span>`
//               )
//               .join("")}
//             </div>
//         </div>
//       </div>
//     </div>
//   `;
// };

// export const Filters = (recipes) => {
//   const count = recipes.length;
//   const infos = getInfoFromRecipes(recipes);

//   return `
//       <div class="filters-wrapper">
//         <div class="filters">
//             ${Filter("Ingrédients", infos?.[URL_PARAMS.INGREDIENTS], {
//               key: URL_PARAMS.INGREDIENTS,
//             })}
//             ${Filter("Appareils", infos?.[URL_PARAMS.TOOLS], {
//               key: URL_PARAMS.TOOLS,
//             })}
//             ${Filter("Ustensiles", infos?.[URL_PARAMS.USTENSIL], {
//               key: URL_PARAMS.USTENSIL,
//             })}
//         </div>
//         <div id="recipes-count" class="filters__count">${count} recettes</div>
//       </div>
//   `;
// };

// export default Filters;

import {
  URL_PARAMS,
  getFiltersFromURLSearchParams
} from "../utils/getFiltersFromURLSearchParams.js";
import getInfoFromRecipes from "../utils/getInfoFromRecipes.js";
import { filterRecipesNative } from "../utils/filterRecipes.js";
import RecipeCard from "../components/RecipeCard.js";

window.handleItemFilterClicked = (key, value) => {
  let currentParams = getFiltersFromURLSearchParams();
  let dedupedFilterItem = new Set(currentParams?.[key]);
  const formattedValue = value.trim();

  if (dedupedFilterItem.has(formattedValue)) {
    dedupedFilterItem.delete(formattedValue);
  } else {
    dedupedFilterItem.add(formattedValue);
  }

  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set(key, Array.from(dedupedFilterItem).join(','));

  const newurl =
    window.location.protocol +
    "//" +
    window.location.host +
    window.location.pathname +
    "?" +
    searchParams.toString();

  window.location.assign(newurl);
};

window.removeActiveFilter = (key, value) => {
  let currentParams = getFiltersFromURLSearchParams();
  let dedupedFilterItem = new Set(currentParams?.[key]);
  const formattedValue = value.trim();

  if (dedupedFilterItem.has(formattedValue)) {
    dedupedFilterItem.delete(formattedValue);
  }

  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set(key, Array.from(dedupedFilterItem).join(','));

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

window.toggleFilterInput = (event) => {
  const label = event.currentTarget;
  const arrow = label.querySelector('.filter__arrow');
  const filterInput = label.nextElementSibling;

  if (arrow && filterInput) {
    arrow.classList.toggle('rotated');
    filterInput.classList.toggle('visible');
  }
};

window.filterList = (event) => {
  const input = event.target;
  const filter = input.value.toLowerCase();
  const items = input.nextElementSibling.querySelectorAll('.filter__option');
  
  items.forEach((item) => {
    const text = item.textContent.toLowerCase();
    if (text.includes(filter)) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  });
};

const renderActiveFilters = (filters) => {
  const activeFiltersContainer = document.getElementById('active-filters');
  
  if (activeFiltersContainer) {
    activeFiltersContainer.innerHTML = '';

    const createFilterTag = (key, value) => `
      <div class="active-filter">
        <span>${value}</span>
        <button onClick="removeActiveFilter('${key}', '${value}')">×</button>
      </div>
    `;

    const addedFilters = new Set();

    // Ajouter le filtre de recherche actif s'il n'est pas déjà ajouté
    if (filters[URL_PARAMS.SEARCH] && !addedFilters.has(filters[URL_PARAMS.SEARCH].trim())) {
      activeFiltersContainer.innerHTML += createFilterTag(URL_PARAMS.SEARCH, filters[URL_PARAMS.SEARCH]);
      addedFilters.add(filters[URL_PARAMS.SEARCH].trim());
    }

    Object.keys(filters).forEach((key) => {
      const filterValues = Array.isArray(filters[key]) ? filters[key] : [filters[key]];
      filterValues.forEach((value) => {
        if (value.trim() !== '' && !addedFilters.has(value.trim())) {
          activeFiltersContainer.innerHTML += createFilterTag(key, value);
          addedFilters.add(value.trim());
        }
      });
    });
  }
};

const Filter = (nom, items, options = {}) => {
  const currentFilters = getFiltersFromURLSearchParams();
  const selectedItems = new Set(currentFilters[options.key] || []);

  return `  
    <div class="filter">
      <div class="filter-choice">
        <label id="appareil-filter-label" for="filter-input" onClick="toggleFilterInput(event)">
          ${nom}
          <div class="filter__arrow"></div>
        </label>
        <div class="wrapper__filter--input">
            <input type="text" class="filter__input" placeholder="Search..." oninput="filterList(event)" />
            <div class="filter__list-items">
            ${items
              .map(
                (item) =>
                  `<span class="filter__option${selectedItems.has(item) ? ' selected' : ''}" onClick="handleItemFilterClicked('${options.key}', '${item}'); markAsSelected(event);">${item}</span>`
              )
              .join("")}
            </div>
        </div>
      </div>
    </div>
  `;
};

const Filters = (recipes) => {
  const count = recipes.length;
  const infos = getInfoFromRecipes(recipes);

  return `
      <div class="filters-wrapper">
        <div class="filters">
            ${Filter("Ingrédients", infos?.[URL_PARAMS.INGREDIENTS], {
              key: URL_PARAMS.INGREDIENTS,
            })}
            ${Filter("Appareils", infos?.[URL_PARAMS.TOOLS], {
              key: URL_PARAMS.TOOLS,
            })}
            ${Filter("Ustensiles", infos?.[URL_PARAMS.USTENSIL], {
              key: URL_PARAMS.USTENSIL,
            })}
        </div>
        <div id="recipes-count" class="filters__count">${count} recettes</div>
      </div>
      
  `;
};

export { Filters, renderActiveFilters };
export default Filters;


