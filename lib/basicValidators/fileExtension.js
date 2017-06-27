'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Accepts anything.anything.anything.ext.ext and matches the last ext
 * @param value a file extension of a file name
 */
module.exports = function izFileExtension(value, validExtensions) {
  var ext;

  if ((typeof validExtensions === 'undefined' ? 'undefined' : _typeof(validExtensions)) !== 'object' || typeof validExtensions.indexOf === 'undefined' || typeof value !== 'string') {
    return false;
  }

  ext = value.split('.').pop().toLowerCase(); //split by '.' and get me the last thing, then lowercase it
  if (validExtensions.indexOf(ext) !== -1) {
    return true;
  }
  return false;
};