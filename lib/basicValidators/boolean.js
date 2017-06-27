'use strict';

module.exports = function izBoolean(value) {
  if (typeof value === 'boolean' || typeof value === 'number' && (value === 0 || value === 1)) {
    return true;
  }
  return false;
};