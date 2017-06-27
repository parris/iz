'use strict';

module.exports = function izMultiple(num, multiple) {
  if (typeof num !== 'number' || typeof multiple !== 'number') {
    return false;
  }
  if (num % multiple === 0) {
    return true;
  }

  return false;
};