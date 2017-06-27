module.exports = function izGetObjectClass(obj) {
  // Custom displayName class name (i've seen this standard around)
  // This could work for minified code. Check out the babel display name plugin
  if (obj.constructor && obj.constructor.displayName) {
    return obj.constructor.displayName;
  }

  // ES6 classes, this won't work for minified code probably
  if (obj.constructor && obj.constructor.name) {
    return obj.constructor.name;
  }

  // If name isn't available we can try serializing the constructor name
  // This won't work minified code probably
  if (obj && obj.constructor && obj.constructor.toString) {
    var arr = obj.constructor.toString().match(/function\s*(\w+)/);

    if (arr && arr.length === 2) {
      return arr[1];
    }
  }

  return undefined;
};
