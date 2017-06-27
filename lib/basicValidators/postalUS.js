'use strict';

var izInt = require('./int');

module.exports = function izPostal(str) {
  var cleanedStr = '';
  if (typeof str === 'string') {
    //removing everything but numbers
    cleanedStr = str.replace(/[^0-9]/g, '');
    //is either a 5 or 9 digit zip code...
    if (izInt(cleanedStr) && (cleanedStr.length === 5 || cleanedStr.length === 9)) {
      return true;
    }
  }
  return false;
};