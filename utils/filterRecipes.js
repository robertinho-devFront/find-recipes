import getFiltersFromURLSearchParams, {
  URL_PARAMS,
} from "./getFiltersFromURLSearchParams.js";

const toCleanValue = (value) => value.trim().toLowerCase();

const filterRecipesNative = (recipes) => {
  console.log("filterRecipesNative called with recipes:", recipes);
  const params = getFiltersFromURLSearchParams();
  console.log("Params:", params);

  const filterBySearch = (recipe) => {
    if (!params[URL_PARAMS.SEARCH]) return true;

    const cleanSearch = toCleanValue(params[URL_PARAMS.SEARCH]);
    const result = toCleanValue(recipe.name).includes(cleanSearch) ||
    toCleanValue(recipe.description).includes(cleanSearch) ||
    recipe.ingredients.some((ingredient) =>
      toCleanValue(ingredient.ingredient).includes(cleanSearch)
    );
  console.log("filterBySearch result for recipe:", recipe.name, result);

    return (
      toCleanValue(recipe.name).includes(cleanSearch) ||
      toCleanValue(recipe.description).includes(cleanSearch) ||
      recipe.ingredients.some((ingredient) =>
        toCleanValue(ingredient.ingredient).includes(cleanSearch)
      )
    );
  };


  const filterByTools = (recipe) => {
    if (params[URL_PARAMS.TOOLS].length === 0) return true;

    return params[URL_PARAMS.TOOLS].some(
      (tool) => toCleanValue(tool) === toCleanValue(recipe.appliance)
    );
  };

  const filterByIngredients = (recipe) => {
    if (params[URL_PARAMS.INGREDIENTS].length === 0) return true;

    return params[URL_PARAMS.INGREDIENTS].some((ingredient) =>
      recipe.ingredients
        .map((ingredients) => toCleanValue(ingredients.ingredient))
        .includes(toCleanValue(ingredient))
    );
  };

  const filterByUstensil = (recipe) => {
    if (params[URL_PARAMS.USTENSIL].length === 0) return true;

    return params[URL_PARAMS.USTENSIL].some((ustensil) =>
      recipe.ustensils.map(toCleanValue).includes(toCleanValue(ustensil))
    );
  };

  return recipes
    .filter(filterBySearch)
    .filter(filterByTools)
    .filter(filterByIngredients)
    .filter(filterByUstensil);
};


const filterRecipesLinear = (recipes) => {
  const params = getFiltersFromURLSearchParams();
  const matchesFilters = [];

  for (let recipe of recipes) {
    const matchesSearch =
      !params[URL_PARAMS.SEARCH] ||
      recipe.name.toLowerCase().includes(params[URL_PARAMS.SEARCH].toLowerCase()) ||
      recipe.description.toLowerCase().includes(params[URL_PARAMS.SEARCH].toLowerCase()) ||
      recipe.ingredients.some((ingredient) =>
        ingredient.ingredient.toLowerCase().includes(params[URL_PARAMS.SEARCH].toLowerCase())
      );

    const matchesAppliances =
      !params[URL_PARAMS.TOOLS].length ||
      params[URL_PARAMS.TOOLS].some(
        (tool) => toCleanValue(tool) === toCleanValue(recipe.appliance)
      );

    const matchesUstensils =
      !params[URL_PARAMS.USTENSIL].length ||
      params[URL_PARAMS.USTENSIL].every((ustensil) =>
        recipe.ustensils.map((u) => u.toLowerCase()).includes(toCleanValue(ustensil))
      );

    const matchesIngredients =
      !params[URL_PARAMS.INGREDIENTS].length ||
      params[URL_PARAMS.INGREDIENTS].every((ingredient) =>
        recipe.ingredients
          .map((i) => i.ingredient.toLowerCase())
          .includes(toCleanValue(ingredient))
      );

    if (matchesSearch && matchesAppliances && matchesUstensils && matchesIngredients) {
      matchesFilters.push(recipe);
    }
  }

  return matchesFilters;
};

const binarySearch = (arr, target) => {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return true;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return false;
};


const filterRecipesBinary = (recipes) => {
  const params = getFiltersFromURLSearchParams();
  const matchesFilters = [];

  for (let recipe of recipes) {
    const matchesSearch =
      !params[URL_PARAMS.SEARCH] ||
      recipe.name.toLowerCase().includes(params[URL_PARAMS.SEARCH].toLowerCase()) ||
      recipe.description.toLowerCase().includes(params[URL_PARAMS.SEARCH].toLowerCase()) ||
      recipe.ingredients.some((ingredient) =>
        ingredient.ingredient.toLowerCase().includes(params[URL_PARAMS.SEARCH].toLowerCase())
      );
    if (!matchesSearch) continue;

    const sortedAppliances = [recipe.appliance.toLowerCase()].sort();
    const sortedUstensils = recipe.ustensils.map((u) => u.toLowerCase()).sort();
    const sortedIngredients = recipe.ingredients
      .map((i) => i.ingredient.toLowerCase())
      .sort();

    const matchesAppliances =
      !params[URL_PARAMS.TOOLS].length ||
      params[URL_PARAMS.TOOLS].every((appliance) =>
        binarySearch(sortedAppliances, appliance.toLowerCase())
      );

    const matchesUstensils =
      !params[URL_PARAMS.USTENSIL].length ||
      params[URL_PARAMS.USTENSIL].every((ustensil) =>
        binarySearch(sortedUstensils, ustensil.toLowerCase())
      );

    const matchesIngredients =
      !params[URL_PARAMS.INGREDIENTS].length ||
      params[URL_PARAMS.INGREDIENTS].every((ingredient) =>
        binarySearch(sortedIngredients, ingredient.toLowerCase())
      );

    if (matchesAppliances && matchesUstensils && matchesIngredients) {
      matchesFilters.push(recipe);
    }
  }

  return matchesFilters;
};



export { filterRecipesNative, filterRecipesLinear, filterRecipesBinary };

export default filterRecipesBinary;
