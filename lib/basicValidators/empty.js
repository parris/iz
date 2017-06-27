/**
 * True if the parameter is empty. length > 0 for objects (if exists) or arrays, Functions/Objects have no properties,
 * or the type is primitive.
 * @param value of any type
 * @return {Boolean}
 */
module.exports = function izEmpty(value) {
  var type = typeof value,
    key;
  //arrays and objects with length properties
  if(value.hasOwnProperty('length') && type !== 'function' && value.length > 0) {
    return false;
  } else if(type === 'function' || type === 'object') {
    for (key in value) {
      if(value.hasOwnProperty(key)) {
        return false; //on first valid key, return false;
      }
    }
  }

  //primitives are empty as are objects without properties and empty arrays
  return true;
};
