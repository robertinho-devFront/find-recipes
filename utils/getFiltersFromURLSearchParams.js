export const URL_PARAMS  = {
  SEARCH: "search",
  TOOLS: "tools",
  USTENSIL: "ustensil",
  INGREDIENTS: "ingredients"
}


export const getFiltersFromURLSearchParams = () => {
  const params = new URLSearchParams(window.location.search);

  return {
    [URL_PARAMS.SEARCH]: params.get(URL_PARAMS.SEARCH) || "",
    [URL_PARAMS.TOOLS]: params.get(URL_PARAMS.TOOLS) 
      ? params.get(URL_PARAMS.TOOLS).split(",") 
      : [],
    [URL_PARAMS.USTENSIL]: params.get(URL_PARAMS.USTENSIL) 
      ? params.get(URL_PARAMS.USTENSIL).split(",")
      : [],
    [URL_PARAMS.INGREDIENTS]: params.get(URL_PARAMS.INGREDIENTS)
      ? params.get(URL_PARAMS.INGREDIENTS).split(",")
      : [],
  };
};


export default getFiltersFromURLSearchParams;

