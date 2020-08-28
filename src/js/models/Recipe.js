import { recipeError } from '../views/base';
import axios from 'axios';

//Fetch data of particular recipe from API
export default class Recipe{
  constructor(id){
    this.id = id;
  }

  //Get recipe and set to this
  async getRecipe(){
    try{
      const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.ingredients = res.data.recipe.ingredients;
      this.url = res.data.recipe.source_url;
      this.img = res.data.recipe.image_url;
      //console.log(res);
    }catch(error){
      //console.log(error);
      recipeError(this.id);
    }
  }

  //Time to cook a recipe
  calcTime(){
    //Assuming that every 3 ingrediants requires 15 minutes 
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
    //console.log(this.time);
  }

  //No of peopel can be served by a recipe
  calcServings(){
    this.servings = 4;
  }

  //Formating the ingredient list
  parseIngredients(){

      const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds', 'packages', 'package'];
      const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound', 'pkg', 'pkg'];
      const units = [...unitsShort, 'kg', 'g'];

      //1.Uniform units
      const newIngredients = this.ingredients.map(e => {
      let ingredient = e.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i])
      });

      //2.Remove paranthesis
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

      //3.Parse ingredients into Count, Unit and Ingredient  (in object)
      const arrIng = ingredient.split(' ');
      const unitIndex = arrIng.findIndex(el => units.includes(el));
      let objIng;

       //There is an unit and a number
      if (unitIndex > -1 ){
        const arrCount = arrIng.slice(0, unitIndex);      
        let count;
        if(arrCount.length === 1 && arrCount[0] !== ""){
          count = eval(arrIng[0].replace('-','+'));
        } else if(arrIng[0]==="" || unitIndex === 0 || arrCount.length === 0){
          count = 1;
        }else {
          count = eval(arrIng.slice(0,unitIndex).join('+'));
        }   
        objIng = {
          count: Math.abs(count),
          unit : arrIng[unitIndex],
          ingredient : arrIng.slice(unitIndex + 1).join(' ')
        }

        //There is no unit but number is present at 1st place
      } else if(parseInt(arrIng[0], 10)){
        objIng = {
          count: parseInt(arrIng[0]),
          unit: '',
          ingredient: arrIng.slice(1).join(' ')
        };

        //There is no unit and no number
      } else if (unitIndex === -1){
        objIng = {
          count: 1,
          unit:'',
          ingredient
        };
      }
      return objIng;
    });
    this.ingredients = newIngredients;  
  }

  //Update servings and hence ingredients
  updateServings(type){
    //Update servings
    const newServings = type === 'dec' ? this.servings - 1: this.servings + 1;

    //Update ingredients
    this.ingredients.forEach(ing => {
      ing.count *= (newServings / this.servings);
    });

    this.servings = newServings;
  }
};