'use strict';

var izNumber = require('./number');

module.exports = function izInt(value, allowDecimal) {
  if (typeof allowDecimal !== 'boolean') {
    allowDecimal = false;
  }

  if (!allowDecimal) {
    return (/^\s*(\+|-)?\d+\s*$/.test(value)
    );
  } else if (izNumber(value) && value % 1 === 0) {
    return true;
  }
  return false;
};