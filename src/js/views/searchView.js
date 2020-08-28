import { elements } from './base';

//Get input from user
export const getInput = () => elements.searchInput.value;

//Prepare UI for results
export const clearInput = () =>{
  elements.searchInput.value = '';
};

//Clearing prev result for next result
export const clearResult = () => {
  elements.searchResList.innerHTML = '';
  elements.searchResPages.innerHTML = '';
};

//Highlight the selected recipe
export const highLightSelected = id => { 

  const resultsArr = Array.from(document.querySelectorAll('.results__link'));
  resultsArr.forEach(e => {
    e.classList.remove("results__link--active");
  });

  document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
};

//Render result on UI
export const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if(title.length > limit){ 
    title.split(' ').reduce((acc,cur)=>{
      if(acc + cur.length <= limit){
        newTitle.push(cur);
      }
        return acc + cur.length;
    },0);
      return `${newTitle.join(' ')} ...`;
  }
  return title;
};

//HTML for one recipe
const renderRecipe = recipe =>{
  const markup = `<li>
                    <a class="results__link" href="#${recipe.recipe_id}">
                        <figure class="results__fig">
                            <img src="${recipe.image_url}" alt="${recipe.title}">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                            <p class="results__author">${recipe.publisher}</p>
                        </div>
                    </a>
                </li>`;
  elements.searchResList.insertAdjacentHTML('beforeend',markup);
};

//HTML for pagination buttons
//type : "prev" "next"
const createButton = (page, type) =>`
                <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
                <span>Page ${type === 'prev' ? page - 1: page + 1}</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
                    </svg>
                </button>
`;

//Render pagination buttons after result
const renderButtons = (page, numResults, resPerPage ) => {
  const pages = Math.ceil(numResults / resPerPage);
  let button;
  if(page === 1 && pages > 1){
    //Only one button for next page
    button = createButton(page, 'next');
  }else if (page < pages){
    //Both next and prev buttons
    button = `
              ${createButton(page, 'prev')}
              ${createButton(page, 'next')} 
            `;
  }else if (page === pages && pages > 1){
    //Only one button for prev page
    button = createButton(page, 'prev');
  }

  elements.searchResPages.insertAdjacentHTML('afterbegin' , button);

};

//Render recipe list with pegination buttons for event listner on UI
export const renderResult = (recipes, page = 1, resPerPage = 10) =>{

  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  recipes.slice(start, end).forEach(renderRecipe);
  renderButtons(page, recipes.length, resPerPage);

};

