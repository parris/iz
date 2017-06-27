'use strict';

var izInt = require('./int');
var luhnChk = require('../utils/luhnCheck');

module.exports = function izCC(value) {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return false;
  }

  value = value.replace(/[ \-]/g, ''); // normalizing
  if (izInt(value)) {
    return luhnChk(value);
  }
  return false;
};