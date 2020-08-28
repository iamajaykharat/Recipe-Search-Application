import { searchError } from '../views/base';
import axios from 'axios';

//Fetch data from API
export default class Search{

  constructor(query){
    this.query = query;
  }

  //Get recipe from API
  async getResult(){
    try{
      const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
      this.result = res.data.recipes;
      //console.log(this.result);
    }catch(error){
      //console.log(error);
      searchError(this.query);
    }

}
}