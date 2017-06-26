/**
 * Returns the name of the class that the object is
 * @author http://blog.magnetiq.com/post/514962277/finding-out-class-names-of-javascript-objects
 * @param obj{Object}
 * @return String name of the class
 */
module.exports = function izGetObjectClass(obj) {
  if (obj && obj.constructor && obj.constructor.toString) {
    var arr = obj.constructor.toString().match(/function\s*(\w+)/);

    if (arr && arr.length === 2) {
      return arr[1];
    }
  }

  return undefined;
};
