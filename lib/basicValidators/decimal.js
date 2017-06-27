const izInt = require('./int');
const izNumber = require('./number');

module.exports = function izDecimal(value) {
  return izNumber(value) && !izInt(value, false);
};
