import getFiltersFromURLSearchParams, {
  URL_PARAMS,
} from "./getFiltersFromURLSearchParams.js";

const toCleanValue = (value) => value.trim().toLowerCase();

const filterRecipesNative = (recipes) => {
  const params = getFiltersFromURLSearchParams();

  const filterBySearch = (recipe) => {
    if (!params[URL_PARAMS.SEARCH]) return true;

    const cleanSearch = toCleanValue(params[URL_PARAMS.SEARCH]);

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

  return recipes;
};

const filterRecipesBinary = (recipes) => {
  const params = getFiltersFromURLSearchParams();

  return recipes;
};

export const filterRecipes = filterRecipesNative;

export default filterRecipes;
