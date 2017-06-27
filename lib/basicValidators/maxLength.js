'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var izInt = require('./int');

module.exports = function izMaxLength(val, len) {
  if ((typeof val === 'string' || (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object') && typeof val.length !== 'undefined' && izInt(len) && val.length <= len) {
    return true;
  }

  return false;
};