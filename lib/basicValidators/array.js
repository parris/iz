'use strict';

module.exports = function izAnArray(arr) {
  return Object.prototype.toString.call(arr) === '[object Array]';
};