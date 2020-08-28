
//Collection of all selectors(id,class,tags)
export const elements = {
  searchForm: document.querySelector('.search'),
  searchInput: document.querySelector('.search__field'),
  searchRes: document.querySelector('.results'),
  searchResList: document.querySelector('.results__list'),
  searchResPages: document.querySelector('.results__pages'),
  recipe: document.querySelector('.recipe'),
  shopping: document.querySelector('.shopping__list'),
  emptyList: document.querySelector('.empty_list'),
  likesMenu: document.querySelector('.likes__field'),
  likesList: document.querySelector('.likes__list')
};

export const elementStrings = {
  loader: 'loader'
};

//Show spinner before fetching data from API
export const renderLoader = parent =>{
  const loader = `
          <div class="${elementStrings.loader}">
            <svg>
              <use href="img/icons.svg#icon-cw"></use>
            </svg>
          </div>

  `;
  parent.insertAdjacentHTML('afterbegin', loader);
};

//Clear spinner after fetching data from API
export const clearLoader = () => {
  const loader = document.querySelector(`.${elementStrings.loader}`);
  if(loader){
    loader.parentElement.removeChild(loader);
  }
};

//Error Handling Msg for search
export const searchError = (query = query) =>
  alert(
    `Something went wrong with your search - "${query}"...
    Suggestions:
      1.Make sure that all words are spelled correctly.
      2.Try different recipe.
      3.Try more general recipe. 
    `
  );

//Error Handling Msg for recipe 
export const recipeError = (id = 0) =>
  alert(
    `Something went wrong while fetching recipe with ID - "${id}"...
    Suggestions:
      1.Reload the page and try again.
      2.Don't click fast give time to load the recipe.
      3.Recipe with this ID is not available.
      4.API is not responding try after sometime.
      
    `
  );
