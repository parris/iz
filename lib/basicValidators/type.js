'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var izGetObjectClass = require('../utils/nameOfClass');

module.exports = function izOfType(obj, type) {
  if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && typeof type === 'function') {
    return obj instanceof type;
  }

  if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && typeof obj.length === 'undefined' && typeof type === 'string') {
    if (izGetObjectClass(obj) === type) {
      return true;
    }
  }

  return false;
};