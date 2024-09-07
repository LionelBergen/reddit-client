export default class RedditComment {
  constructor(properties) {
    for(let property in properties) {
      this[property] = properties[property];
    }
  }
  
  toString() {
    let result = "";
    for(let property in this) {
      result += property + ": " + this[property] + ", ";
    }
    
    // Trim the last comma
    if (result.length > 2) {
      result = result.substring(0, result.length - 2);
    }
    
    return result;
  }
}
