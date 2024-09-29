import { URL_PARAMS } from "./getFiltersFromURLSearchParams.js";

// Extraction des ingrédients à partir des recettes
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

// Extraction des appareils à partir des recettes
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

// Extraction des ustensiles à partir des recettes
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

// Fonction qui renvoie tous les types de filtres disponibles dans les recettes
export const getInfoFromRecipes = (recipes) => {

  return {
    [URL_PARAMS.INGREDIENTS]: extractIngredientsFromRecipes(recipes),
    [URL_PARAMS.TOOLS]: extractToolsFromRecipes(recipes),
    [URL_PARAMS.USTENSIL]: extractUstensilFromRecipes(recipes),
  };
};

export default getInfoFromRecipes;
