'use strict';

var izEmpty = require('./empty');

module.exports = function izBlank(value) {
  if (typeof value === 'string') {
    return izEmpty(value);
  }

  return false;
};