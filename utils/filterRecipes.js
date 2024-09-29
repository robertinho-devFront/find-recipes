import getFiltersFromURLSearchParams, { URL_PARAMS } from "./getFiltersFromURLSearchParams.js";

const toCleanValue = (value) => value.trim().toLowerCase();

// Filtrage des recettes en utilisant des boucles et conditions natives
const filterRecipesNative = (recipes) => {
  console.log("filterRecipesNative appelé avec les recettes:", recipes);
  
  // On récupère les paramètres de filtre de l'URL
  const params = getFiltersFromURLSearchParams();
  console.log("Params:", params);

  // Filtre par nom, description ou ingrédient basé sur une recherche textuelle
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

  // Filtre par appareil (tools)
  const filterByTools = (recipe) => {
    if (params[URL_PARAMS.TOOLS].length === 0) return true;

    return params[URL_PARAMS.TOOLS].some(
      (tool) => toCleanValue(tool) === toCleanValue(recipe.appliance)
    );
  };

  // Filtre par ingrédients
  const filterByIngredients = (recipe) => {
    if (params[URL_PARAMS.INGREDIENTS].length === 0) return true;

    return params[URL_PARAMS.INGREDIENTS].some((ingredient) =>
      recipe.ingredients
        .map((ingredients) => toCleanValue(ingredients.ingredient))
        .includes(toCleanValue(ingredient))
    );
  };

  // Filtre par ustensiles
  const filterByUstensil = (recipe) => {
    if (params[URL_PARAMS.USTENSIL].length === 0) return true;

    return params[URL_PARAMS.USTENSIL].some((ustensil) =>
      recipe.ustensils.map(toCleanValue).includes(toCleanValue(ustensil))
    );
  };

  // Application des différents filtres dans l'ordre
  return recipes
    .filter(filterBySearch)
    .filter(filterByTools)
    .filter(filterByIngredients)
    .filter(filterByUstensil);
};

// Exportation uniquement de la version native
export { filterRecipesNative };
export default filterRecipesNative;
