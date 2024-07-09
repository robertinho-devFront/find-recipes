// export const RecipeCard = (recipe) => {
//     return `
//       <div class="recipe-card">
//         <img src="recipe/${recipe.image}" alt="${recipe.name}" class="recipe-card__image">
//         <div class="recipe-card__details">
//           <h2 class="recipe-card__title">${recipe.name}</h2>
//           <p class="recipe-card__time"><strong></strong> ${recipe.time} min</p>
//           <p class="recipe-card__description"><strong>Recette</strong> ${recipe.description}</p>
//           <p class="recipe-card__ingredients"><strong>Ingrédients</strong> </p>
//           <ul class="recipe-card__list">
//             ${recipe.ingredients.map(ingredient => `
//               <li class="recipe-card__list-item">
//                 <span>${ingredient.ingredient}</span>
//                 <span class="ingredient">${ingredient.quantity ? ingredient.quantity : ""} ${ingredient.unit ? ingredient.unit : ""}</span>
//               </li>
//             `).join("")}
//           </ul>
//         </div>
//       </div>
//     `;
//   };

//   export default RecipeCard

export const createRecipeCard = (recipe) => {
  return `
    <div class="recipe-card">
      <img src="recipe/${recipe.image}" alt="${recipe.name}" class="recipe-card__image">
      <div class="recipe-card__details">
        <h2 class="recipe-card__title">${recipe.name}</h2>
        <p class="recipe-card__time"><strong></strong> ${recipe.time} min</p>
        <p class="recipe-card__description"><strong>Recette</strong> ${recipe.description}</p>
        <p class="recipe-card__ingredients"><strong>Ingrédients</strong> </p>
        <ul class="recipe-card__list">
          ${recipe.ingredients.map(ingredient => `
            <li class="recipe-card__list-item">
              <span>${ingredient.ingredient}</span>
              <span class="ingredient">${ingredient.quantity ? ingredient.quantity : ""} ${ingredient.unit ? ingredient.unit : ""}</span>
            </li>
          `).join("")}
        </ul>
      </div>
    </div>
  `;
};
export default createRecipeCard;