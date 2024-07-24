// import { URL_PARAMS, getFiltersFromURLSearchParams } from "../utils/getFiltersFromURLSearchParams.js";

// window.handleSearchSubmitted = () => {
//   const value = document.querySelector("#main-search").value ;
//   const key = URL_PARAMS.SEARCH;

//   const currentParams = getFiltersFromURLSearchParams();

//   const formattedValue = value.trim();

//   const searchParams = new URLSearchParams(window.location.search);

//   searchParams.set(key, formattedValue);

//   const newurl =
//     window.location.protocol +
//     "//" +
//     window.location.host +
//     window.location.pathname +
//     "?" +
//     searchParams.toString();

//   window.location.assign(newurl);
// };

// export const Header = () => {
//   return `
//       <header class="header">
//         <div class="header__content">
//           <h1 class="title__logo">Les Petits Plats <img src="assets/img/logo.png"></h1>
//           <h2 class="subtitle__page">CHERCHEZ PARMI PLUS DE 1500 RECETTES DU QUOTIDIEN, SIMPLES ET DÉLICIEUSES</h2>
//           <div class="search-container">
//             <input type="text" id="main-search" class="search-container__input" placeholder="Rechercher une recette, un ingrédient, ..."/>
//             <button type="button" id="search-button" class="search-container__button"><img class="search-container__img" src="assets/img/loupw.png" onClick="handleSearchSubmitted();"></button>
//           </div>
//         </div>
//       </header>
//     `;
// };

// export default Header;
import { URL_PARAMS, getFiltersFromURLSearchParams } from "../utils/getFiltersFromURLSearchParams.js";

window.handleSearchSubmitted = () => {
  const value = document.querySelector("#main-search").value;
  const key = URL_PARAMS.SEARCH;

  const formattedValue = value.trim();

  const searchParams = new URLSearchParams(window.location.search);

  searchParams.set(key, formattedValue);

  const newurl =
    window.location.protocol +
    "//" +
    window.location.host +
    window.location.pathname +
    "?" +
    searchParams.toString();

  window.location.assign(newurl);
};

export const Header = () => {
  return `
      <header class="header">
        <div class="header__content">
          <h1 class="title__logo">Les Petits Plats <img src="assets/img/logo.png"></h1>
          <h2 class="subtitle__page">CHERCHEZ PARMI PLUS DE 1500 RECETTES DU QUOTIDIEN, SIMPLES ET DÉLICIEUSES</h2>
          <form class="search-container">
            <input type="text" id="main-search" class="search-container__input" placeholder="Rechercher une recette, un ingrédient, ..."/>
            <button type="button" id="search-button" class="search-container__button"><img class="search-container__img" src="assets/img/loupw.png" onClick="handleSearchSubmitted();"></button>
          </form>
        </div>
      </header>
    `;
};

export default Header;



