'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function izInArray(value, arr) {
  if ((typeof arr === 'undefined' ? 'undefined' : _typeof(arr)) !== 'object' || typeof arr.indexOf === 'undefined') {
    return false;
  }

  if (arr.indexOf(value) !== -1) {
    return true;
  }
  return false;
};