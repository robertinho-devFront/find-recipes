export const getRecipes = async () => {
  try {
    const response = await fetch("./recipes.json");
    const { recipes } = await response.json();

    return recipes;
  } catch (e) {
    throw Error("Cannot fetch recipes");
  }
};

export default {
  getRecipes,
};
 