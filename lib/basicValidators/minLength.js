const izInt = require('./int');

module.exports = function izMinLength(val, len) {
  if ((typeof val === 'string' || typeof val === 'object') &&
    typeof val.length !== 'undefined' && izInt(len) && val.length >= len) {
    return true;
  }

  return false;
};
