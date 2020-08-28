
//Like List functionality
export default class Likes{
  constructor(){
    this.likes = [];
  }

  //Add like to the list
  addLike(id, title, author, img){
    const like = {id, title, author, img};
    this.likes.push(like);
    //Persist data to localStorage
    this.persistData();
    return like;
  }

  // Delete like from list
  deleteLike(id){
    const index = this.likes.findIndex(el => el.id === id);
    this.likes.splice(index, 1);
    //Persist data to localStorage
    this.persistData();
  }

  //Liked or not
  isLiked(id){
    return this.likes.findIndex(el => el.id === id) !== -1;
  }

  //Total liked items
  getNumLikes(){
    return this.likes.length;
  }

  //Persist data to localStorage
  persistData(){
    localStorage.setItem('likes', JSON.stringify(this.likes));
  }

  //Read data from localStorage
  readStorage(){
    const storage =JSON.parse(localStorage.getItem('likes'));
    if(storage) this.likes = storage;
  }
  
}