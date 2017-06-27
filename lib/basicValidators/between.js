'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function izBetween(val, start, end) {
  if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' || typeof val === 'function' || (typeof start === 'undefined' ? 'undefined' : _typeof(start)) === 'object' || typeof start === 'function' || (typeof end === 'undefined' ? 'undefined' : _typeof(end)) === 'object' || typeof end === 'function') {
    return false;
  }

  if (val >= start && val <= end) {
    return true;
  }
  return false;
};