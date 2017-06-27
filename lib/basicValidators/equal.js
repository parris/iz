'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Does an equivalence check. Will use .equals on the object if it exists.
 * @param value
 * @param value2
 * @return {Boolean}
 */
module.exports = function izEqual(value, value2) {
  var valueType = typeof value === 'undefined' ? 'undefined' : _typeof(value),
      value2Type = typeof value2 === 'undefined' ? 'undefined' : _typeof(value2),
      key;

  if ((valueType === 'object' || valueType === 'function') && typeof value.equals === 'function') {
    if (value2Type === 'object' || value2Type === 'function') {
      //value2 does not need the equals method, if an exception is thrown here that is the implementor
      //catching it returning false might result in a bug that is hard to track
      return value.equals(value2);
    }
  } else if (valueType === 'object' || valueType === 'function') {
    for (key in value) {
      if (value.hasOwnProperty(key) && !value2.hasOwnProperty(key) && key !== 'equals') {
        //if property is an object then recursively check
        if (_typeof(value[key]) === 'object' || typeof value[key] === 'function' && !izEqual(value[key], value2[key])) {
          return false;
        } else if (value[key] !== value2[key]) {
          //if not object or function
          return false;
        }
      }
    }
    return true;
  }

  return value === value2;
};