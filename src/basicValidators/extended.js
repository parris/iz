/**
 * Is obj1 an extension of obj2? True if this is the case.
 * @param obj1
 * @param obj2
 * @return {Boolean}
 */
module.exports = function izExtension(obj1, obj2) {
  var key;
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    return false;
  }

  for (key in obj2) {
    if (obj2.hasOwnProperty(key) && typeof obj1[key] === 'undefined') {
      return false;
    }
  }

  return true;
};
