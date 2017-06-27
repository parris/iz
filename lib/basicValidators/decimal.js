'use strict';

var izInt = require('./int');
var izNumber = require('./number');

module.exports = function izDecimal(value) {
  return izNumber(value) && !izInt(value, false);
};