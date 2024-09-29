import { URL_PARAMS, getFiltersFromURLSearchParams } from "../utils/getFiltersFromURLSearchParams.js";

// Gestion de la suppression des filtres actifs
window.removeActiveFilter = (key, value) => {
  let currentParams = getFiltersFromURLSearchParams();
  let dedupedFilterItem = new Set(currentParams?.[key]);
  const formattedValue = value.trim();

  if (dedupedFilterItem.has(formattedValue)) {
    dedupedFilterItem.delete(formattedValue);
  }

  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set(key, Array.from(dedupedFilterItem).join(','));

  if (key === URL_PARAMS.SEARCH || Array.from(dedupedFilterItem).length === 0) {
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

// Affichage des filtres actifs
const ActiveFilters = () => {
  const currentFilters = getFiltersFromURLSearchParams();

  const createFilterTag = (key, value) => `
    <div class="active-filter">
      <span>${value}</span>
      <button onClick="removeActiveFilter('${key}', '${value}')">×</button>
    </div>
  `;

  let filtersHTML = '';

  Object.keys(currentFilters).forEach((key) => {
    const filterValues = Array.isArray(currentFilters[key]) ? currentFilters[key] : [currentFilters[key]];
    filterValues.forEach((value) => {
      if (value.trim() !== '') {
        filtersHTML += createFilterTag(key, value);
      }
    });
  });

  return filtersHTML;
};

export default ActiveFilters;
