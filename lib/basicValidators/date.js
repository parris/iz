'use strict';

var izGetObjectClass = require('../utils/nameOfClass');

/**
 * TODO: maybe provide format and use: http://www.mattkruse.com/javascript/date/source.html
 * but that seems in elegant. Then again dates in general are in elegant... *shrug*
 * @param value
 * @return {Boolean}
 */
module.exports = function izDate(value) {
  return izGetObjectClass(value) === 'Date' || new Date(value).toString() !== 'Invalid Date' || !isNaN(new Date(value));
};