import { URL_PARAMS } from "./getFiltersFromURLSearchParams.js";

const extractIngredientsFromRecipes = (recipes) => {
  const seen = {};

  for (const recipe of recipes) {
    for (const ingredient of recipe.ingredients) {
      const key = ingredient.ingredient;
      if (!seen[key]) {
        seen[key] = true;
      }
    }
  }

  return Object.entries(seen).map(([key]) => key);
};

const extractToolsFromRecipes = (recipes) => {
  const seen = {};

  for (const recipe of recipes) {
    const key = recipe.appliance;
    if (!seen[key]) {
      seen[key] = true;
    }
  }

  return Object.entries(seen).map(([key]) => key);
};

const extractUstensilFromRecipes = (recipes) => {
    const seen = {};
  
    for (const recipe of recipes) {
        for (const ustensil of recipe.ustensils) {
          const key = ustensil;
          if (!seen[key]) {
            seen[key] = true;
          }
        }
      }
  
    return Object.entries(seen).map(([key]) => key);
  };

export const getInfoFromRecipes = (recipes) => {

  return {
    [URL_PARAMS.INGREDIENTS]: extractIngredientsFromRecipes(recipes),
    [URL_PARAMS.TOOLS]: extractToolsFromRecipes(recipes),
    [URL_PARAMS.USTENSIL]: extractUstensilFromRecipes(recipes),
  };
};

export default getInfoFromRecipes;
