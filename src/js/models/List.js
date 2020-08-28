import uniqid from 'uniqid';

//Create a list to add, delete and update items
export default class List {

  constructor(){
    this.items = [];
  }
  //add item to the list
  addItem(count, unit, ingredient){
    const item = {
      id: uniqid(),
      count,
      unit,
      ingredient
    }
    this.items.push(item);
    return item;
  }

  //delete item from the list
  deleteItem(id){
    const index = this.items.findIndex(el => el.id ===id);
    this.items.splice(index,1);
  }

  //update the list count
  updateCount(id, newCount){
    this.items.find(el => el.id === id).count = newCount;
  }

};