'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * True if the parameter is empty. length > 0 for objects (if exists) or arrays, Functions/Objects have no properties,
 * or the type is primitive.
 * @param value of any type
 * @return {Boolean}
 */
module.exports = function izEmpty(value) {
  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value),
      key;
  //arrays and objects with length properties
  if (value.hasOwnProperty('length') && type !== 'function' && value.length > 0) {
    return false;
  } else if (type === 'function' || type === 'object') {
    for (key in value) {
      if (value.hasOwnProperty(key)) {
        return false; //on first valid key, return false;
      }
    }
  }

  //primitives are empty as are objects without properties and empty arrays
  return true;
};