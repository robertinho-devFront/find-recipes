// import {
//   URL_PARAMS,
//   getFiltersFromURLSearchParams,
// } from "../utils/getFiltersFromURLSearchParams.js";
// import getInfoFromRecipes from "../utils/getInfoFromRecipes.js";

// window.handleItemFilterCLicked = (key, value) => {
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

// export const Filter = (name, items, options = {}) => {

//   return `  
//     <div class="filter">
//         <label id="appareil-filter-label" for="filter-input">${name}<div class="filter__arrow"></div></label>
//         <div class="wrapper__filter--input">
//             <input type="text" class="filter__input" placeholder="" />
//             <div class="filter__list-items" style="">
//             ${items
//               .map(
//                 (item) =>
//                   `<span onClick="handleItemFilterCLicked('${options.key}', '${item}')">${item}</span>`
//               )
//               .join("")}
//             </div>
//         </div>
//     </div>
//     `;
// };

// export const Filters = (recipes) => {
//   const count = recipes.length;

//   const infos = getInfoFromRecipes(recipes);

//   return `
//       <div class="filters-wrapper">
//         <div class="filters">
//             ${Filter("ingrédients", infos?.[URL_PARAMS.INGREDIENTS], {
//               key: URL_PARAMS.INGREDIENTS,
//             })}
//             ${Filter("Appareils", infos?.[URL_PARAMS.TOOLS], {
//               key: URL_PARAMS.TOOLS,
//             })}
//             ${Filter("Ustensiles", infos?.[URL_PARAMS.USTENSIL], {
//               key: URL_PARAMS.USTENSIL,
//             })}
//         <div id="recipes-count" class="filters__count">${count} recettes</div>
//       </div>
//       </div>
//       <div id="active-filters" class="filters__active"></div>
//       <div id="recipes-container" class="filters__recipes"></div>
//     `;
// };

// export default Filters;

import {
  URL_PARAMS,
  getFiltersFromURLSearchParams
} from "../utils/getFiltersFromURLSearchParams.js";
import getInfoFromRecipes from "../utils/getInfoFromRecipes.js";

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
  searchParams.set(key, Array.from(dedupedFilterItem));

  const newurl =
    window.location.protocol +
    "//" +
    window.location.host +
    window.location.pathname +
    "?" +
    searchParams.toString();

  window.location.assign(newurl);
  renderActiveFilters(getFiltersFromURLSearchParams());
};

window.removeActiveFilter = (key, value) => {
  let currentParams = getFiltersFromURLSearchParams();

  let dedupedFilterItem = new Set(currentParams?.[key]);
  const formattedValue = value.trim();

  if (dedupedFilterItem.has(formattedValue)) {
    dedupedFilterItem.delete(formattedValue);
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
  renderActiveFilters(getFiltersFromURLSearchParams());
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

    Object.keys(filters).forEach((key) => {
      filters[key].forEach((value) => {
        const filterElement = document.createElement('div');
        filterElement.className = 'active-filter';
        filterElement.innerHTML = `
          <span>${value}</span>
          <button onClick="removeActiveFilter('${key}', '${value}')">×</button>
        `;
        activeFiltersContainer.appendChild(filterElement);
      });
    });
  }
};

window.markAsSelected = (key, value) => {
  const selectedItems = new Set(getFiltersFromURLSearchParams()?.[key]);
  const formattedValue = value.trim();

  document.querySelectorAll(`.filter__option`).forEach((span) => {
    if (span.textContent.trim() === formattedValue) {
      if (selectedItems.has(formattedValue)) {
        span.classList.add('selected');
      } else {
        span.classList.remove('selected');
      }
    }
  });
};

export const Filter = (nom, items, options = {}) => {
  const currentFilters = getFiltersFromURLSearchParams();
  return `  
    <div class="filter">
      <div class="filter-choice">
        <label id="appareil-filter-label" for="filter-input" onClick="toggleFilterInput(event)">
          ${nom}
          <div class="filter__arrow"></div>
        </label>
        <div class="wrapper__filter--input">
            <input type="text" class="filter__input" placeholder="" oninput="filterList(event)" />
            <div class="filter__list-items">
            ${items
              .map((item) => {
                const selectedClass = currentFilters?.[options.key]?.includes(item) ? 'selected' : '';
                return `<span class="filter__option ${selectedClass}" onClick="handleItemFilterClicked('${options.key}', '${item}'); markAsSelected('${options.key}', '${item}');">${item}</span>`;
              })
              .join("")}
            </div>
        </div>
      </div>
    </div>
    `;
};

export const Filters = (recipes) => {
  const count = recipes.length;

  const infos = getInfoFromRecipes(recipes);
  const currentFilters = getFiltersFromURLSearchParams();

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
      <div id="active-filters" class="filters__active"></div>
    `;
};

export default Filters;

// Assurez-vous que renderActiveFilters est appelé après que le DOM soit mis à jour
document.addEventListener("DOMContentLoaded", () => {
  const currentFilters = getFiltersFromURLSearchParams();
  renderActiveFilters(currentFilters);
  // Mark selected filters
  Object.keys(currentFilters).forEach((key) => {
    currentFilters[key].forEach((value) => {
      markAsSelected(key, value);
    });
  });
});

      // <div id="recipes-container" class="filters__recipes"></div>