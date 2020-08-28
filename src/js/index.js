// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader, searchError, recipeError } from './views/base';


/* Global Application State
-Search object
-Recipe object
-Shopping list object
-Liked items/recipes
*/

const state = {};

//************SEARCH CONTROLLER****************


const controlSearch = async () => {
  //1)Get query from searchView (UI)
  const query = searchView.getInput();

  if(query) {
  //2)New search object and add to state
  state.search = new Search(query);
  
  //3)Prepare UI for results
  searchView.clearInput();
  searchView.clearResult();
  renderLoader(elements.searchRes);

  try{
    //4)Search for recipe(Fetch data)
    await state.search.getResult();

    //5)Render Result on UI
    clearLoader();
    searchView.renderResult(state.search.result);

  }catch(err){
    searchError(query);
    clearLoader();
  }
}
}

//Search Button
elements.searchForm.addEventListener('submit', e =>{
  e.preventDefault();
  controlSearch();
});

//Pagination Buttons (event delegation)
elements.searchResPages.addEventListener('click',e =>{
  const btn = e.target.closest('.btn-inline');
  if(btn){
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResult();
    searchView.renderResult(state.search.result, goToPage);
  }
});


//************RECIPE CONTROLLER****************


const controlRecipe = async () => {
  //Get hash id from URL
  const id = window.location.hash.replace('#','');

  if (id){
    //1.Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    //Highlight the selected element
    if(state.search) searchView.highLightSelected(id);

    //2.Create new object of Recipe
    state.recipe = new Recipe(id);

    //3.Fetch data of recipe
    try{
      await state.recipe.getRecipe();
      
      //Parse ingredients in well manner
      state.recipe.parseIngredients();

      //4.Calculate time and servings
      state.recipe.calcTime();
      state.recipe.calcServings();
      
      //5.Render final result on UI
      clearLoader();
      recipeView.renderRecipe(
        state.recipe,
        state.likes.isLiked(id)
        );
    }catch(err){
      recipeError(id);
    }
  }
};


//Event handler when click on different recipe or bookmark page (Hashchange)
['hashchange', 'load'].forEach(event => window.addEventListener(event,controlRecipe));

//Event handling when button click in recipe section 
elements.recipe.addEventListener('click', e => {
  
  if(e.target.matches('.btn-decrease, .btn-decrease *')){
    //If minus btn is clicked
    if(state.recipe.servings > 1){
      state.recipe.updateServings('dec');
      recipeView.updateServIng(state.recipe);
    }
  
  } else if (e.target.matches('.btn-increase, .btn-increase *')){
    //If plus btn is clicked
    if(state.recipe.servings < 25){
      state.recipe.updateServings('inc');
      recipeView.updateServIng(state.recipe);
    }
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
    //If add to shopping list btn clicked
    controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')){
    //If recipe like button cliked
    controlLike();
  }
});


////************SHOPPING LIST CONTROLLER****************

const controlList = () => {
  //create a list if there is not yet
  if(!state.list) state.list = new List();

  //Add ingredients to the list and render on UI
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
}

//Event handler to delete and update an item in a list

elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;
  if (e.target.matches('.shopping__delete, .shopping__delete *')){
    //Delete from state
    state.list.deleteItem(id);
    //Delete from UI
    listView.deleteItem(id);
  } else if (e.target.matches('.shopping__count--value')){
    //Update list
    const val = parseFloat(e.target.value, 10);
    if(val > 0){
      state.list.updateCount(id, val);
    }
}
});

//Empty the shopping list on btn click
elements.emptyList.addEventListener('click', e => {
  const element = e.target.closest('.empty_list');
  if(element){
    listView.emptyList();
  }  
});


////************LIKES CONTROLLER****************


const controlLike = () => {
  //if Like is not yet there
  if(!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  //If User has not liked current recipe yet and now clicked
  if(!state.likes.isLiked(currentID)){
    //Add like to the state
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    //Toggle the like button
    likesView.toggleLikeBtn(true);

    //Add liked recipe to the UI list
    likesView.renderLike(newLike);
  //If user has liked current recipe already then clicked
  }else{
    //Remove like from the state
    state.likes.deleteLike(currentID);
    //Toggle the like button
    likesView.toggleLikeBtn(false);

    //Remove liked recipe to the UI list 
    likesView.clearLike(currentID);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

//Restore the like recipe list when page load
window.addEventListener('load', () =>{
  //New object created
  state.likes = new Likes();

  //Restore likes
  state.likes.readStorage();

  //Toggle like menu button
  likesView.toggleLikeMenu(state.likes.getNumLikes());

  //Render existing like menu/list
  state.likes.likes.forEach(like =>{likesView.renderLike(like)});
});